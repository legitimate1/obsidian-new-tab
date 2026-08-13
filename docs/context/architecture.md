# 架构骨架（architecture.md）

## 核心数据流：新 tab → 指定页面

```
用户 Ctrl+T / 点 + 新建 tab
        │
        ▼
workspace.on("layout-change") 事件（onLayoutReady 后注册）
        │
        ▼
checkForNewTab(existingLeaves)
        │  iterateAllLeaves：WeakSet 中已有的 leaf 跳过（每个 leaf 只检查一次）
        ▼
tabIsEmpty(leaf) —— leaf.view 为空 或 viewType === "empty"
        │
        ├── whatToOpen === "new-tab-page" ──► openDefaultPage(leaf)
        │        │  读取 settings.filePath → metadataCache.getFirstLinkpathDest
        │        │  [兼容模式] leafIsStillEmpty() 延迟复查
        │        │  leaf.openFile(file) → setViewMode(leaf, mode)
        │        └── 无效路径 → Notice
        │
        └── 其他命令 id ──► runCommand(id, leaf)
                 │  switcher 类命令延迟 200ms
                 │  executeCommandById → 失败 Notice
                 └── 执行前复查 tabIsEmpty
```

## 模块关系

```
src/main.ts       插件入口 + 核心逻辑（onload / checkForNewTab / openDefaultPage）
   │  new DefaultNewTabPageSettingTab(app, this)
   ▼
src/settings.ts   设置面板（5 个设置项，文案全部走 plugin.t）
   │  getDict(detectLang(...))
   ▼
src/i18n.ts       中英字典（Dict 接口 + zh/en 实现）+ LANG_OPTIONS
```

- `main.ts` 持有 `settings`（data.json 持久化）与 `t`（当前语言字典 getter）
- `settings.ts` 通过 `plugin.t` 读取文案，语言切换时调用 `this.display()` 重绘
- 语言解析：`detectLang(settings.language, moment.locale())` → `"zh" | "en"`

## 生命周期

```
onload ──► loadSettings() ──► addSettingTab() ──► onLayoutReady() 注册 layout-change 监听
onunload ──► 插件卸载（注册的事件随 registerEvent 自动清理）
```

## 构建与部署

```
src/*.ts ──esbuild 打包──► main.js（单文件，banner 标注生成来源）
                                │
deploy.ps1 复制 manifest.json → styles.css → main.js（保留 data.json）
                                ▼
            vault: .obsidian/plugins/new-tab/
                                │
            cdp-bridge: disablePlugin → enablePlugin（重载，触发 onload）
```

- 构建：`.esbuild.mjs`（dev 带 inline sourcemap + `/* nosourcemap */` 防 Obsidian 裁剪；production 参数 minify）
- 版本号：manifest.json 为权威源，bump-version.mjs 同步写回 4 个文件
