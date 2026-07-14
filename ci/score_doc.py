"""
文档质量评分脚本 - 供 GitLab CI 调用
用法：python score_doc.py <markdown文件路径>
输出：评分结果 JSON（总分、文档类型、主要问题）
"""

import sys
import os
import json
import re
from pathlib import Path

# ============================================================
# 配置区：根据你选的 LLM 服务修改
# ============================================================

# 方案 A：OpenAI（GPT-4）
USE_OPENAI = True
# 方案 B：Claude
USE_CLAUDE = False

# API Key 从环境变量读取（不要硬编码到代码里）
API_KEY = os.environ.get("LLM_API_KEY", "")
# 评分不通过的阈值
SCORE_THRESHOLD = 70


def load_prompt_template():
    """加载评分 Prompt 模板"""
    template_path = Path(__file__).parent / "assistant.md"
    if not template_path.exists():
        print(f"错误：找不到评分模板 {template_path}")
        sys.exit(1)
    return template_path.read_text(encoding="utf-8")


def build_prompt(template: str, doc_path: str, doc_content: str) -> str:
    """构建完整的评分 Prompt"""
    prompt = template.replace("{{path}}", doc_path)
    prompt = prompt.replace("{{content}}", doc_content)
    prompt = prompt.replace("{{references}}", "无")
    return prompt


def call_openai(prompt: str) -> str:
    """调用 OpenAI API"""
    import httpx

    response = httpx.post(
        "https://api.deepseek.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "你是一名开发者平台文档质量评估助手。"},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
            "max_tokens": 4000,
        },
        timeout=120,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


def call_claude(prompt: str) -> str:
    """调用 Claude API"""
    import httpx

    response = httpx.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": API_KEY,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        },
        json={
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 4000,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
        },
        timeout=120,
    )
    response.raise_for_status()
    return response.json()["content"][0]["text"]


def extract_score(result: str) -> int | None:
    """从评分结果中提取总分"""
    # 尝试从 DOC_SCORE 元数据提取
    meta_match = re.search(r'<!--\s*DOC_SCORE\s*(\{.*?\})\s*-->', result, re.DOTALL)
    if meta_match:
        try:
            meta = json.loads(meta_match.group(1))
            if meta.get("total"):
                return int(meta["total"])
        except (json.JSONDecodeError, ValueError):
            pass

    # 尝试从正文提取
    score_match = re.search(r'总分[：:]\s*(\d{1,3})(?:\s*/\s*100)?', result)
    if score_match:
        return int(score_match.group(1))

    return None


def main():
    if len(sys.argv) < 2:
        print("用法：python score_doc.py <markdown文件路径>")
        sys.exit(1)

    doc_path = sys.argv[1]
    doc_file = Path(doc_path)

    if not doc_file.exists():
        print(f"错误：文件不存在 {doc_path}")
        sys.exit(1)

    if not API_KEY:
        print("错误：未设置 LLM_API_KEY 环境变量")
        sys.exit(1)

    # 读取文档
    doc_content = doc_file.read_text(encoding="utf-8")

    # 加载模板并构建 Prompt
    template = load_prompt_template()
    prompt = build_prompt(template, doc_path, doc_content)

    # 调用 LLM
    print(f"正在评分：{doc_path}")
    if USE_OPENAI:
        result = call_openai(prompt)
    elif USE_CLAUDE:
        result = call_claude(prompt)
    else:
        print("错误：未配置 LLM 服务")
        sys.exit(1)

    # 提取分数
    score = extract_score(result)

    # 输出结果
    output = {
        "file": doc_path,
        "score": score,
        "passed": score >= SCORE_THRESHOLD if score else False,
        "detail": result,
    }

    # 写入结果文件（供后续步骤读取）
    result_path = Path("score_result.json")
    result_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")

    # 打印摘要
    print("\n" + "=" * 60)
    if score is not None:
        status = "✅ 通过" if score >= SCORE_THRESHOLD else "❌ 未通过"
        print(f"📄 文件：{doc_path}")
        print(f"📊 评分结果：{score}/100 {status}（阈值：{SCORE_THRESHOLD}）")
    else:
        print(f"📄 文件：{doc_path}")
        print("⚠️ 未能解析出分数，请检查评分结果")
    print("=" * 60)

    # 不管是否通过，都打印完整的评分详情和修改建议
    print("\n📝 评分详情与修改建议：\n")
    print(result)
    print("\n" + "=" * 60)

    # 写入 GitHub Actions Job Summary（如果在 CI 环境中）
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a", encoding="utf-8") as f:
            if score is not None:
                emoji = "✅" if score >= SCORE_THRESHOLD else "❌"
                f.write(f"## {emoji} {doc_path} — {score}/100\n\n")
            else:
                f.write(f"## ⚠️ {doc_path} — 未解析出分数\n\n")
            f.write("<details>\n<summary>点击查看评分详情与修改建议</summary>\n\n")
            f.write(result)
            f.write("\n\n</details>\n\n")

    # 退出码：不通过时返回非零，让 CI 标记失败
    if score is None or score < SCORE_THRESHOLD:
        sys.exit(1)


if __name__ == "__main__":
    main()
