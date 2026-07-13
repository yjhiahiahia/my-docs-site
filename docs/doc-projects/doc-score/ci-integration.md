---
sidebar_position: 4
---

# CI 集成

## 原理

把文档质量评分脚本集成到 CI/CD 流水线中，每次有人提交文档变更时自动运行评分。分数低于阈值（默认 70 分）则 CI 失败，MR 无法合入。

```mermaid
sequenceDiagram
    participant 开发者
    participant GitLab/GitHub
    participant CI Runner
    participant LLM API

    开发者->>GitLab/GitHub: 提交文档 MR
    GitLab/GitHub->>CI Runner: 触发流水线
    CI Runner->>CI Runner: 检测变更的 .md 文件
    CI Runner->>LLM API: 发送文档 + 评分 Prompt
    LLM API-->>CI Runner: 返回评分结果
    CI Runner->>CI Runner: 解析分数
    alt 分数 ≥ 70
        CI Runner->>GitLab/GitHub: ✅ 通过
    else 分数 < 70
        CI Runner->>GitLab/GitHub: ❌ 失败
    end
