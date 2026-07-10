---
sidebar_position: 3
---

# IoT 平台函数计算 API 文档

> 写作示例，无实际意义。

IoT 开放平台提供了一系列 HTTP 接口，供开发者在函数计算中调用，实现设备控制、数据持久化存储、缓存等能力。

---

## 调用说明

### 环境与域名

| 环境 | 域名 |
| --- | --- |
| 测试环境 | `https://api-test.iot-platform.com` |
| 线上环境 | `https://api.iot-platform.com` |

### 认证方式

所有接口均需要通过 AK/SK 进行认证。AK/SK 在申请函数计算权限时生成，认证算法已封装在 SDK 内部，开发者无需自行实现签名逻辑。

每个请求的 JSON Body 中必须包含以下两个字段：

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| access_key | string | 是 | 函数计算的 Access Key |
| secret_key | string | 是 | 函数计算的 Secret Key |

> 后续接口文档中不再重复列出这两个字段，但请求时必须携带。

### SDK 接入（Java）

引入依赖：

```xml
<dependency>
    <groupId>com.example.iot</groupId>
    <artifactId>iot-faas-sdk</artifactId>
</dependency>
```

调用示例：

```java
String uri = "https://api.iot-platform.com/api/v1/persistence/kv/store";

Map<String, Object> request = new HashMap<>();
request.put("access_key", "{your_ak}");
request.put("secret_key", "{your_sk}");
request.put("functionName", "light-control");
request.put("did", "123456");
request.put("subject", "brightness");
request.put("value", "80");

String response = FaasClient.dispatcher(request, uri);
log.info(response);
```

### 统一响应结构

所有接口的响应均为 JSON 格式，结构如下：

| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| status | int | 业务状态码，200 表示成功，非 200 表示失败 |
| message | string | 状态描述 |
| result | any | 业务数据，不同接口返回类型不同（boolean/string/object/array/null） |
| timestamp | string | 服务端处理时间 |
| requestId | string | 请求唯一标识，排查问题时提供给平台 |

成功响应示例：

```json
{
    "status": 200,
    "message": "成功",
    "result": true,
    "timestamp": "2023-08-15 09:28:10.858",
    "requestId": "cb0a03d76abd31d2c0271d89eee2080b"
}
```

> 后续接口文档中，响应部分仅列举 result 字段的内容。

### 通用错误码

| status | 说明 | 解决方案 |
| --- | --- | --- |
| 200 | 成功 | - |
| 400 | 参数错误 | 检查必填参数是否缺失或格式错误 |
| 401 | 认证失败 | 检查 AK/SK 是否正确、是否过期 |
| 403 | 无权限 | 确认函数计算权限是否已申请 |
| 500 | 服务内部错误 | 记录 requestId 联系平台排查 |

---

## 设备控制

### 向设备发送消息

向指定设备发送 Spec 协议指令，支持读取属性、设置属性和执行动作。

#### 基本信息

| 项目 | 说明 |
| --- | --- |
| 请求方式 | POST |
| 请求路径 | /api/v1/device/spec/send |
| 认证方式 | AK/SK |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| userid | long | 是 | 用户 ID |
| request | array | 是 | 指令列表，支持批量发送 |
| request[].did | string | 是 | 目标设备 ID |
| request[].method | string | 是 | 操作方法（如 get_properties、set_properties、action） |
| request[].identify | object | 是 | Spec 标识符 |
| request[].identify.siid | int | 是 | Service ID（服务标识） |
| request[].identify.piid | int | 否 | Property ID（属性标识），读取/设置属性时必填 |
| request[].identify.aiid | int | 否 | Action ID（动作标识），执行动作时必填 |
| request[].value | object | 否 | 设置属性或执行动作时的值 |
| request[].value.type | string | 否 | 值的数据类型（string/int/bool 等） |
| request[].value.value | any | 否 | 具体的值 |

#### 请求示例

```json
{
    "access_key": "your_ak",
    "secret_key": "your_sk",
    "userid": 123456,
    "request": [
        {
            "did": "device_001",
            "method": "set_properties",
            "identify": {
                "siid": 2,
                "piid": 1,
                "aiid": 0
            },
            "value": {
                "type": "bool",
                "value": true
            }
        }
    ]
}
```

#### 响应参数（result）

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| [].did | string | 设备 ID |
| [].code | int | 执行结果码，0 表示成功 |
| [].identify | object | 对应的 Spec 标识符 |
| [].value | object | 返回值（读取属性时有值） |

#### 响应示例

```json
[
    {
        "did": "device_001",
        "code": 0,
        "identify": {
            "siid": 2,
            "piid": 1,
            "aiid": 0
        },
        "value": {
            "type": "bool",
            "value": true
        }
    }
]
```

#### 注意事项

1. request 数组支持批量发送，但建议单次不超过 10 条指令。
2. piid 和 aiid 不能同时为 0，至少有一个有效标识。
3. 设备离线时调用会返回错误码，建议先查询设备在线状态。

---

## KV 持久化存储

KV 存储提供按设备维度的持久化数据存储能力，支持写入、读取、删除和按时间范围查询。数据按 did + subject 进行隔离。

### 存储数据

将一条数据写入 KV 持久化存储。

#### 基本信息

| 项目 | 说明 |
| --- | --- |
| 请求方式 | POST |
| 请求路径 | /api/v1/persistence/kv/store |
| 认证方式 | AK/SK |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| functionName | string | 是 | 函数名称，当前函数计算的标识 |
| did | string | 是 | 设备 ID，用于数据隔离 |
| subject | string | 是 | 业务名称，与 did 一起用于分表，区分同一设备下不同业务的数据 |
| value | string | 是 | 要存储的数据值 |
| ts | long | 否 | 13 位毫秒级时间戳，不传则使用服务端当前时间 |

#### 请求示例

```json
{
    "access_key": "your_ak",
    "secret_key": "your_sk",
    "functionName": "light-control",
    "did": "123456",
    "subject": "brightness_history",
    "value": "80",
    "ts": 1692072490858
}
```

#### 响应示例

result 为 null 表示写入成功：

```json
{
    "status": 200,
    "message": "成功",
    "result": null,
    "timestamp": "2023-08-15 09:28:10.858",
    "requestId": "cb0a03d76abd31d2c0271d89eee2080b"
}
```

#### 注意事项

1. subject 建议使用有业务含义的命名（如 brightness_history），避免不同业务间数据冲突。
2. value 为 string 类型，如需存储对象请先 JSON 序列化。
3. 同一 did + subject + ts 下重复写入会覆盖旧数据。

---

### 获取最新数据

获取指定用户和业务下最近一次存储的数据。

#### 基本信息

| 项目 | 说明 |
| --- | --- |
| 请求方式 | POST |
| 请求路径 | /api/v1/persistence/kv/getLatest |
| 认证方式 | AK/SK |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| functionName | string | 是 | 函数名称 |
| uid | long | 是 | 用户 ID |
| subject | string | 是 | 业务名称 |

#### 请求示例

```json
{
    "access_key": "your_ak",
    "secret_key": "your_sk",
    "functionName": "light-control",
    "uid": 123456,
    "subject": "brightness_history"
}
```

#### 响应示例

result 为最新一条数据的 value：

```json
{
    "status": 200,
    "message": "成功",
    "result": "80",
    "timestamp": "2023-08-15 09:30:00.000",
    "requestId": "abc123def456"
}
```

如果没有数据，result 为 null。

---

### 删除数据

删除指定条件下的一条数据。

#### 基本信息

| 项目 | 说明 |
| --- | --- |
| 请求方式 | POST |
| 请求路径 | /api/v1/persistence/kv/delete |
| 认证方式 | AK/SK |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| functionName | string | 是 | 函数名称 |
| uid | long | 是 | 用户 ID |
| subject | string | 是 | 业务名称 |
| ts | long | 是 | 要删除的数据对应的时间戳（13 位毫秒级） |

#### 请求示例

```json
{
    "access_key": "your_ak",
    "secret_key": "your_sk",
    "functionName": "light-control",
    "uid": 123456,
    "subject": "brightness_history",
    "ts": 1692072490858
}
```

#### 响应示例

result 为 null 表示删除成功：

```json
{
    "status": 200,
    "message": "成功",
    "result": null,
    "timestamp": "2023-08-15 09:35:00.000",
    "requestId": "def789ghi012"
}
```

---

### 按时间范围批量获取

获取指定时间范围内的所有数据。

#### 基本信息

| 项目 | 说明 |
| --- | --- |
| 请求方式 | POST |
| 请求路径 | /api/v1/persistence/kv/getByTsRange |
| 认证方式 | AK/SK |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| functionName | string | 是 | 函数名称 |
| uid | long | 是 | 用户 ID |
| subject | string | 是 | 业务名称 |
| beginTs | long | 是 | 起始时间戳（13 位毫秒级，包含） |
| endTs | long | 是 | 结束时间戳（13 位毫秒级，包含） |

#### 请求示例

```json
{
    "access_key": "your_ak",
    "secret_key": "your_sk",
    "functionName": "light-control",
    "uid": 123456,
    "subject": "brightness_history",
    "beginTs": 1692000000000,
    "endTs": 1692100000000
}
```

#### 响应示例

result 为 key-value 对象，key 是时间戳，value 是存储的值：

```json
{
    "status": 200,
    "message": "成功",
    "result": {
        "1692072490858": "80",
        "1692075000000": "60"
    },
    "timestamp": "2023-08-15 09:40:00.000",
    "requestId": "ghi345jkl678"
}
```

如果时间范围内没有数据，result 为空对象 `{}`。

---

### 按时间范围批量删除

删除指定时间范围内的所有数据。

#### 基本信息

| 项目 | 说明 |
| --- | --- |
| 请求方式 | POST |
| 请求路径 | /api/v1/persistence/kv/delete/range |
| 认证方式 | AK/SK |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| functionName | string | 是 | 函数名称 |
| uid | long | 是 | 用户 ID |
| subject | string | 是 | 业务名称 |
| beginTs | long | 是 | 起始时间戳（13 位毫秒级，包含） |
| endTs | long | 是 | 结束时间戳（13 位毫秒级，包含） |

#### 请求示例

```json
{
    "access_key": "your_ak",
    "secret_key": "your_sk",
    "functionName": "light-control",
    "uid": 123456,
    "subject": "brightness_history",
    "beginTs": 1692000000000,
    "endTs": 1692100000000
}
```

#### 响应示例

result 为 null 表示删除成功：

```json
{
    "status": 200,
    "message": "成功",
    "result": null,
    "timestamp": "2023-08-15 09:45:00.000",
    "requestId": "jkl901mno234"
}
```

#### 注意事项

1. 删除操作不可恢复，请谨慎使用。
2. 时间范围过大时可能影响性能，建议单次删除范围不超过 7 天。

---

## 缓存

缓存接口提供短期数据存储能力，适用于需要快速读写但不需要持久化的场景。最长支持 7 天有效期。

### 设置缓存

写入一条或多条缓存数据，支持批量操作。

#### 基本信息

| 项目 | 说明 |
| --- | --- |
| 请求方式 | POST |
| 请求路径 | /api/v1/cache/set |
| 认证方式 | AK/SK |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| dataList | array | 是 | 缓存数据列表 |
| dataList[].key | string | 是 | 缓存键名 |
| dataList[].value | string | 是 | 缓存值 |
| dataList[].expireAfterSec | int | 是 | 过期时间（秒），范围 1 ~ 604800（7 天） |

#### 请求示例

```json
{
    "access_key": "your_ak",
    "secret_key": "your_sk",
    "dataList": [
        {
            "key": "device_001_status",
            "value": "online",
            "expireAfterSec": 300
        },
        {
            "key": "device_002_status",
            "value": "offline",
            "expireAfterSec": 300
        }
    ]
}
```

#### 响应示例

result 为 null 表示设置成功：

```json
{
    "status": 200,
    "message": "成功",
    "result": null,
    "timestamp": "2023-08-15 10:00:00.000",
    "requestId": "mno567pqr890"
}
```

#### 注意事项

1. key 建议使用有业务含义的前缀命名（如 `device_001_status`），避免不同业务间 key 冲突。
2. value 为 string 类型，如需存储对象请先 JSON 序列化。
3. 相同 key 重复设置会覆盖旧值并重置过期时间。
4. expireAfterSec 超出范围会返回 400 错误。

---

### 读取缓存

批量读取缓存数据。

#### 基本信息

| 项目 | 说明 |
| --- | --- |
| 请求方式 | POST |
| 请求路径 | /api/v1/cache/get |
| 认证方式 | AK/SK |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| keys | array | 是 | 要查询的缓存键名列表 |

#### 请求示例

```json
{
    "access_key": "your_ak",
    "secret_key": "your_sk",
    "keys": ["device_001_status", "device_002_status"]
}
```

#### 响应参数（result）

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| dataList | array | 缓存数据列表 |
| dataList[].key | string | 缓存键名 |
| dataList[].value | string/null | 缓存值，已过期或不存在时为 null |

#### 响应示例

```json
{
    "status": 200,
    "message": "成功",
    "result": {
        "dataList": [
            {
                "key": "device_001_status",
                "value": "online"
            },
            {
                "key": "device_002_status",
                "value": null
            }
        ]
    },
    "timestamp": "2023-08-15 10:05:00.000",
    "requestId": "pqr123stu456"
}
```

#### 注意事项

1. 查询不存在或已过期的 key 时，对应的 value 返回 null，不会报错。
2. 建议单次查询 key 数量不超过 100 个。
