# ============================================================================
# 版本发布一条龙（new-tab，一条龙模式）
# 用法：
#   ./release.ps1 patch   # 🐛 小修复
#   ./release.ps1 minor   # ✨ 新功能
#   ./release.ps1 major   # 💥 破坏性变更
#
# 流程：bump 版本号 → 构建 → 部署 → 重载（deploy.ps1 默认一条龙）
# 等价于：bump-version.mjs + ./deploy.ps1
# ============================================================================

param(
    [ValidateSet("patch", "minor", "major")]
    [string]$Level = "patch"
)

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

Write-Host "==> [0/3] 版本号 bump ($Level)..." -ForegroundColor Cyan
node "$PSScriptRoot\bump-version.mjs" $Level
if ($LASTEXITCODE -ne 0) { throw "版本号 bump 失败" }

& "$PSScriptRoot\deploy.ps1"   # 构建 + 部署 + 重载（一条龙）
