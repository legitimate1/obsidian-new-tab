# 命名规范与隐含假设（conventions.md）

## 命名规范

| 对象 | 规范 | 实例 |
|:-----|:-----|:-----|
| 插件类 | 沿用原项目名 `defaultNewTabPage` | `src/main.ts` |
| 设置接口 | `DefaultNewTabPageSettings` | `src/main.ts` |
| i18n 类型 | `Lang` / `LangSetting` / `Dict` | `src/i18n.ts` |
| 脚本 | `deploy.ps1` / `release.ps1` / `bump-version.mjs` | 项目根 |
| 设置项值 | 命令 id（`whatToOpen`）用小写短横线 | `new-tab-page` / `random-note` |

## 隐含假设

- **插件目录名 = manifest.json 的 `id` = `new-tab`**——改 id 等于换插件，deploy.ps1 里的 `$PluginId` 要同步
- **vault 路径硬编码**在 deploy.ps1：`$env:USERPROFILE\Documents\Flow\.obsidian\plugins`（换环境重新跑 init-pipeline 生成）
- **cdp-bridge 路径硬编码**：`$env:USERPROFILE\.pi\agent\bin\cdp-bridge.exe`（Obsidian 未开时 eval 会失败）
- **版本号权威源是 manifest.json**，bump 时写回 manifest + versions + package + package-lock 四处
- **data.json 保留策略**：deploy 只覆盖 3 个产物文件，插件配置不丢
- **i18n 字典类型安全**：`Dict` 接口约束，zh/en 缺一处编译报错；新增翻译键必须两边同步
- **一条龙模式**（deploy 默认重载）是已确认的开发模式，除非用户重新要求，不再询问
- **语言检测**：`moment.locale()` 反映 Obsidian UI 语言，`zh-*` → zh，其余 → en

## 反模式

- **禁止从社区市场更新**——本地接管版，市场更新会覆盖魔改；upstream 仅作参考不同步
- **首次启用不能靠 enablePlugin**——新插件未注册时 `enablePlugin` 静默无效（返回 resolved 但 enabledPlugins 无它）；必须 Obsidian 设置里手动启用一次
- **重载后版本号显示滞后**——Obsidian 内存是启动时快照，只有完全重启才刷新；确认版本看仓库 manifest.json
- **不要写死版本号示例在文档里**——用相对描述（小修复/新功能/破坏性变更）
- **`gh repo rename` 必须显式 `--repo`**——否则默认作用到 upstream
