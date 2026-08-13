# ============================================================================
# Obsidian 插件一键部署脚本（new-tab）
# 用法：
#   ./deploy.ps1           # 构建 + 部署（默认不重载，安全）
#   ./deploy.ps1 -Reload   # 构建 + 部署 + 重载（可安全重载的插件一条龙）
#   ./deploy.ps1 -SkipBuild  # 跳过构建（只部署/重载现有产物）
#
# 语义约定：
#   - deploy = 构建 + 复制到 vault（放到运行位置）
#   - reload = 激活新产物（disable/enable，触发 onload）
#   - 重载是显式动作（-Reload），默认不执行——部分插件无法安全自动重载
#     （数据迁移/核心行为改动），需人工确认
# ============================================================================

param(
    [switch]$Reload,
    [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'
# 控制台 UTF-8，避免中文乱码
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

# ===== 按项目修改这两个路径 =====
$ProjectRoot   = $PSScriptRoot                                   # 插件项目根目录
$VaultPlugins  = "$env:USERPROFILE\Documents\Flow\.obsidian\plugins"  # vault 插件目录
$PluginDir     = Join-Path $VaultPlugins 'new-tab'               # 目标插件目录（= 插件 id）
$CdpBridge     = "$env:USERPROFILE\.pi\agent\bin\cdp-bridge.exe"
$PluginId      = 'new-tab'

# 预检
if (-not (Test-Path $PluginDir)) { throw "未找到插件目录: $PluginDir" }
if (-not (Test-Path $CdpBridge)) { throw "未找到 cdp-bridge: $CdpBridge" }

function Invoke-CdpEval([string]$code) {
    & $CdpBridge eval $code
    if ($LASTEXITCODE -ne 0) { throw "cdp-bridge eval 失败: $code" }
}

# ---------- 1. 构建 ----------
if (-not $SkipBuild) {
    Write-Host "==> [1/3] 构建..." -ForegroundColor Cyan
    Push-Location $ProjectRoot
    npm run build
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw "npm run build 失败" }
    Pop-Location
} else {
    Write-Host "==> [1/3] 跳过构建" -ForegroundColor DarkGray
}

# ---------- 2. 部署（复制到 vault）----------
# 复制顺序：manifest.json → styles.css → main.js
# 原因：若使用热重载插件（文件监听），main.js 最后到位触发重载，
#       此时 manifest.json 已就位，避免重载读到旧 manifest
Write-Host "==> [2/3] 部署到 vault..." -ForegroundColor Cyan
Copy-Item "$ProjectRoot\manifest.json" $PluginDir -Force
Copy-Item "$ProjectRoot\styles.css"    $PluginDir -Force
Copy-Item "$ProjectRoot\main.js"       $PluginDir -Force
Write-Host "    已复制 main.js / manifest.json / styles.css"
Write-Host "    （data.json 保留，不影响配置）" -ForegroundColor DarkGray

# ---------- 3. 重载（显式，-Reload 才执行）----------
if ($Reload) {
    Write-Host "==> [3/3] 重载插件..." -ForegroundColor Cyan
    Invoke-CdpEval "app.plugins.disablePlugin(`"$PluginId`")"
    Start-Sleep -Milliseconds 800
    Invoke-CdpEval "app.plugins.enablePlugin(`"$PluginId`")"
    Start-Sleep -Milliseconds 800

    $status = Invoke-CdpEval 'JSON.stringify({enabled: app.plugins.enabledPlugins.has("new-tab"), loaded: !!app.plugins.plugins["new-tab"]})'
    Write-Host "    状态: $status" -ForegroundColor Green
} else {
    Write-Host "==> [3/3] 跳过重载（下次打开 Obsidian 自动加载新版本；或 ./deploy.ps1 -Reload）" -ForegroundColor DarkGray
}

Write-Host "完成 ✔" -ForegroundColor Green
