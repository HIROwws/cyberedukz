$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if (Test-Path -LiteralPath $bundledNode) {
  $node = $bundledNode
} else {
  $node = "node"
}

Set-Location -LiteralPath $projectRoot
$env:NODE_NO_WARNINGS = "1"
& $node scripts/reset-demo-data.js
