# ═══ AGENTS.md — 项目上下文 ═══

Obsidian 插件「New Tab」：新开 tab 时自动打开指定笔记（或触发命令），像浏览器的新标签页。fork 自已弃用的 new-tab-default-page，二次开发并加入 i18n。

| 技术 | 选型 |
| :--- | :--- |
| 语言 | TypeScript |
| 构建 | esbuild（单文件打包 → main.js） |
| 运行宿主 | Obsidian（桌面 + 移动，isDesktopOnly: false） |
| 部署 | deploy.ps1 + cdp-bridge（disable/enable 重载） |
| i18n | 自研类型安全字典（zh/en，auto 跟随 Obsidian UI） |

## 导航

接手必读:功能目录（含文件映射） → docs/context/features.md
接手必读:架构骨架、核心数据流 → docs/context/architecture.md
接手必读:命名规范、隐含假设、反模式 → docs/context/conventions.md
接手必读:开发命令（构建/发布/部署/验证） → docs/context/commands.md
接手必读:设计决策（为什么这么设计） → docs/context/design-decisions.md

## 知识库文件

- [features.md](docs/context/features.md)
- [architecture.md](docs/context/architecture.md)
- [conventions.md](docs/context/conventions.md)
- [commands.md](docs/context/commands.md)
- [design-decisions.md](docs/context/design-decisions.md)

## 其他 AI 注意事项

- 开发命令模式：**一条龙**（`npm run release:*` 自动重载），已确认无需再问
- 首次部署新插件需在 Obsidian 手动启用一次（`enablePlugin` 对未注册插件静默无效）
- 修改涉及新 UI 文案时，zh/en 字典必须同步（类型检查会拦截）
- 本项目是 fork，upstream 已弃用，不合并上游
