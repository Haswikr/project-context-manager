# project-context-manager

基于 ChatGPT Library 中的「通用项目初始化」v1.1 模板制作的 Agent Skill。输入 `初始化项目` 可以建立项目上下文；之后用 `/对齐`、`/快照`、`/交接`、`/指令` 维护和读取状态。

## 安装

### Codex / Work（本地文件可用）

将本仓库克隆到用户级技能目录。PowerShell 示例：

```powershell
New-Item -ItemType Directory -Force "$HOME\.agents\skills" | Out-Null
git clone <本仓库地址> "$HOME\.agents\skills\project-context-manager"
```

若你的 Codex 使用 `$CODEX_HOME/skills`，则克隆到该目录。重启或刷新技能列表后，在项目对话中输入 `初始化项目`，或显式选择 `$project-context-manager`。新电脑登录相同 GitHub 账号后重复克隆即可。升级时在技能目录执行 `git pull --ff-only`；先保留自己的本地改动。

### ChatGPT

如果账号提供 Skills 安装入口，可从本仓库导入 Skill。若无安装入口，可将 `assets/PROJECT_INSTRUCTIONS.md` 粘贴到目标 Project 的 Project instructions，并把模板文件添加到 Project sources；在对话中输入 `初始化项目`。ChatGPT 普通对话通常不能自动写入电脑目录，也不能因为生成了 `PROJECT_INSTRUCTIONS.md` 就视为已应用项目设置。Work 有授权文件访问时可以执行本地脚本。

## 项目文件

默认创建 `<项目根目录>/.chatgpt-context/`，其中含项目总览、规则、决策、符号、工作日志、快照、来源、项目指令和初始化说明九份 Markdown，以及 `snapshots/` 和 `references/`。已有同名文件保留。请先核对项目证据，再填写模板中的占位字段。

## 命令与脚本

在对话中说命令时，Agent 负责读取证据、生成内容和报告实际保存状态。以下脚本只处理文件，不替 Agent 判断事实。需要 Node.js 18 或更新版本。

```powershell
node scripts/context.mjs init D:\Projects\MyProject
node scripts/context.mjs validate D:\Projects\MyProject
node scripts/context.mjs align D:\Projects\MyProject
node scripts/context.mjs instructions D:\Projects\MyProject
node scripts/context.mjs snapshot D:\Projects\MyProject D:\Drafts\snapshot.md
node scripts/context.mjs handoff D:\Projects\MyProject D:\Drafts\handoff.md
```

`/快照` 应先在内容文件中写完整新快照，脚本会将当前版归档后替换；相同内容不重复归档。`/交接` 每次生成单独文件。无本地权限时，Agent 应输出完整内容并说明尚未写入。`/对齐` 只读。

## 非破坏性规则

- 重复初始化只补缺，不覆盖项目现有成果。
- 快照更新前保留旧版，且不将未验证结论写成已证实事实。
- 决策日志保留历史与取代关系；原始资料不自动复制到公开仓库。
- 项目自定义指令文件与 ChatGPT Project settings 是两项独立配置。项目特有规则应保留并合并。

## 跨电脑与项目同步

GitHub 仓库同步的是 Skill 源码和通用模板。每个项目的 `.chatgpt-context/` 应由项目自己的备份或 Git 仓库同步；在新电脑只安装 Skill 不会自动恢复旧项目事实。不要把密钥或私有资料加入本 Skill 仓库。

