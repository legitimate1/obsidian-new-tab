# New Tab

Obsidian 插件：新开 tab 时自动打开你指定的笔记（或 Quick Switcher），像浏览器的新标签页一样。

Fork 自 [chrisgrieser/new-tab-default-page](https://github.com/chrisgrieser/new-tab-default-page)（原项目已弃用），在此基础上二次开发。

## 功能

- 新开 tab（`Ctrl/Cmd + T`）时打开指定笔记
- 支持指定笔记 / 每日笔记 / 随机引用 / Quick Switcher
- 关闭最后一个 tab 时同样会打开指定页
- 阅读模式 / 编辑模式可选

## 安装

### BRAT（推荐）

1. 安装 [BRAT](https://obsidian.md/plugins?id=obsidian42-brat) 插件
2. `Obsidian42 - BRAT` → `Add a beta plugin for testing`
3. 输入 `https://github.com/legitimate1/obsidian-new-tab`
4. 启用 `New Tab` 插件

### 手动安装

1. 从 [Releases](https://github.com/legitimate1/obsidian-new-tab/releases) 下载 `main.js`、`manifest.json`、`styles.css`
2. 放入 vault 的 `.obsidian/plugins/new-tab/` 目录
3. 在 Obsidian 设置中启用

## 开发

```bash
npm install
npm run dev   # 开发模式
npm run build # 构建
```

## 开发计划

- [ ] 支持新 tab 打开外部页面 / HTML
- [ ] 动态决定打开哪个页面（读取配置笔记 / 对接外部系统）
- [ ] 其他增强功能（待定）

## 致谢

原项目 [New Tab Default Page](https://github.com/chrisgrieser/new-tab-default-page) by [Chris Grieser (pseudometa)](https://chris-grieser.de/)，MIT License。
