# 开发命令（commands.md）

## 日常开发

| 命令 | 作用 |
|:-----|:-----|
| `npm run build` | 构建 dev 版（inline sourcemap，`/* nosourcemap */` 防 Obsidian 裁剪）→ `main.js` |
| `npm run build:prod` | 构建生产版（minify + treeshake） |
| `npx tsc --noEmit --skipLibCheck` | 类型检查（构建前先跑，零错误才发布） |
| `npm install` | 安装依赖（清理作者工具链后依赖显著减少） |

## 发布（一条龙：bump + 构建 + 部署 + 重载）

| 命令 | 语义 |
|:-----|:-----|
| `npm run release:patch` | 🐛 小修复 |
| `npm run release:minor` | ✨ 新功能 |
| `npm run release:major` | 💥 破坏性变更 |

## 部署（单独执行）

| 命令 | 作用 |
|:-----|:-----|
| `./deploy.ps1` | 构建 + 部署 + 重载（默认一条龙） |
| `./deploy.ps1 -NoReload` | 只构建 + 部署（下次打开 Obsidian 自动加载） |
| `./deploy.ps1 -SkipBuild` | 跳过构建，只部署/重载现有产物（改配置/样式微调用） |
| `node bump-version.mjs patch\|minor\|major` | 仅版本号 bump（manifest 权威源，四处一致） |

## 基建生成（新项目）

```powershell
& "$env:USERPROFILE\.pi\agent\skills\obsidian-plugin-rebuild\init-pipeline.ps1" -PluginId new-tab
```

## 运行时验证（cdp-bridge）

```powershell
# 插件状态
cdp-bridge eval 'JSON.stringify({enabled: app.plugins.enabledPlugins.has("new-tab"), loaded: !!app.plugins.plugins["new-tab"]})'
# 语言检测
cdp-bridge eval 'JSON.stringify({locale: moment.locale(), uiLang: app.plugins.plugins["new-tab"].uiLang})'
```

> cdp-bridge eval 返回包装 JSON（`{"ok":true,"file":...}`），真实结果在 `%TEMP%\cdp-bridge\eval_*.json` 的 `result.value`；eval 不解析 Promise。

## 注意事项

- 重载成功标志：状态输出 `{"enabled":true,"loaded":true}`
- 版本号缓存坑：重载后插件面板版本号是旧值，只有完全重启才刷新
- Obsidian 未开时 deploy 的 -Reload 会失败（cdp-bridge eval 无法连接）→ 用 `-NoReload`
