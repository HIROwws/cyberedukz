$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$node = "node"
$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if (Test-Path -LiteralPath "C:\Program Files\nodejs\node.exe") {
  $node = "C:\Program Files\nodejs\node.exe"
} elseif (Test-Path -LiteralPath $bundledNode) {
  $node = $bundledNode
}

Set-Location -LiteralPath $projectRoot
$env:NODE_NO_WARNINGS = "1"

$existing = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" |
  Where-Object { $_.CommandLine -like "*server.js*" }
foreach ($process in $existing) {
  Stop-Process -Id $process.ProcessId -Force
}
if ($existing) {
  Start-Sleep -Seconds 1
}

Start-Process -FilePath $node -ArgumentList "--no-warnings server.js" -WorkingDirectory $projectRoot -WindowStyle Hidden

$healthy = $false
for ($i = 0; $i -lt 20; $i++) {
  try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -TimeoutSec 2
    if ($health.ok) {
      $healthy = $true
      break
    }
  } catch {
    Start-Sleep -Milliseconds 500
  }
}

if (-not $healthy) {
  throw "Server did not become healthy at http://localhost:3000/health"
}

& $node --no-warnings scripts/smoke-test.js
Write-Host "QA complete. Server is running at http://localhost:3000"
