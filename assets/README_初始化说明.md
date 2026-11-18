# 通用项目初始化包 v1.1

## 新项目首次初始化
1. 在 ChatGPT 创建一个 Project 并命名。
2. 在该 Project 的对话中输入 `初始化项目`（可加项目名称或本地目录）。
3. 系统会检索资料库中最新模板，并结合可读取的项目资料生成初始化内容。
4. 将 `PROJECT_INSTRUCTIONS.md` 的完整正文粘贴至 Project settings → Project instructions（项目自定义指令）。
5. 在 Project sources 中加入项目文件，或将文件包解压至获授权本地项目根目录下的 `.chatgpt-context/`。
6. 首次运行 `/对齐` 检查初始化信息，完成研究或开发阶段后运行 `/快照`。

## 本地推荐位置
`<项目根目录>/.chatgpt-context/`，含 9 份 Markdown：
- `PROJECT_INSTRUCTIONS.md`
- `README_初始化说明.md`
- `00_PROJECT.md`、`01_RULES.md`、`02_DECISIONS.md`、`03_SYMBOLS.md`、`04_WORKLOG.md`、`05_SNAPSHOT.md`、`06_SOURCES.md`
另外包含 `snapshots/` 与 `references/` 两个目录。

如果用户已有文档架构或明确路径，按现有规范整合，不重复建立第二套。

## 执行边界
- 普通聊天只能读取资料库、生成文本及可保存的文件，不能直接修改你的 Windows 本地目录或 ChatGPT Project settings。
- 在具有授权文件写入能力的 Work/本地环境中可实际创建、核验和更新本地文件；必须报告具体成功或失败的路径。
- 重新运行初始化只补缺或核对版本，默认不覆盖已保存项目事实。
- `PROJECT_INSTRUCTIONS.md` 的更新与实际 ChatGPT Project settings 的同步是两项独立操作。

## 命令
- `初始化项目`：检索主模板，检查环境，初始化项目资料及更新版指令；旧短语 `发送初始化项目` 兼容。
- `/对齐`：只读核对项目上下文和决策一致性。
- `/快照`：生成/更新状态快照并按权限写入、归档。
- `/交接`：形成新对话恢复材料。
- `/指令`：显示命令和用法。

