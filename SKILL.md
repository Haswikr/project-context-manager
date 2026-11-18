---
name: project-context-manager
description: 初始化并维护项目上下文。当用户说“初始化项目”“发送初始化项目”或使用 /对齐、/快照、/交接、/指令时，基于项目证据创建、核对和交接版本化文档。
---

# 项目上下文管理

本 Skill 以 `assets/` 中从用户 v1.1 文件包整理的模板为基础。先读取当前项目已有文件和已确认信息；仅把已核实内容写成事实，未知项留待填写。项目已有结构优先，默认目录为 `<项目根目录>/.chatgpt-context/`。

## 命令

- **初始化项目**（兼容“发送初始化项目”）：确认项目根目录，检查已有上下文。可运行 `node scripts/context.mjs init <项目根目录>` 补齐缺失文件；已有文件一律保留。结合实际项目资料填写项目总览，生成适用的项目指令。运行 `validate` 检查结果。普通 ChatGPT 无本地权限时提供文件内容或文件包，明确说明未写入本地。
- **/对齐**：运行 `align` 或读取 `00_PROJECT.md`、`02_DECISIONS.md`、`05_SNAPSHOT.md`，按任务核对 `03_SYMBOLS.md`、`06_SOURCES.md` 及原始材料。输出当前目标、已确认约束、有效结论、冲突、未核实项和下一步。默认只读。
- **/快照**：根据实际新成果起草完整快照，注明证据和未解决事项。审阅后以 UTF-8 Markdown 保存为临时文件，再运行 `node scripts/context.mjs snapshot <项目根目录> <内容文件>`。脚本先将旧版存入 `snapshots/`，再更新当前快照。必要时另行追加决策和工作日志，不改写旧决策。
- **/交接**：读取最新快照、决策和来源，写出可独立恢复的交接文档及新会话首条提示词。可运行 `node scripts/context.mjs handoff <项目根目录> <内容文件>` 保存唯一版本。若重要进度尚未持久化，指出这一点。
- **/指令**：运行 `instructions` 展示当前项目指令，并简述五个命令的用途。

## 文件与设置

`PROJECT_INSTRUCTIONS.md` 是供 ChatGPT Project settings → Project instructions 使用的文本；写入文件不等于设置已应用。仅在当前工具确实支持且用户授权时修改项目设置，否则交付可复制文本。Codex/Work 可读取本地文件；不要静默改动项目现有 `AGENTS.md`。

脚本提供确定性的文件操作，不会自动提取或编造项目事实。命令详情和各环境用法见 [README.md](README.md)。

