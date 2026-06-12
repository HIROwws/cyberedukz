$ErrorActionPreference = "Continue"

$docker = "docker"
if (Test-Path -LiteralPath "C:\Program Files\Docker\Docker\resources\bin\docker.exe") {
  $docker = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
}

Write-Host "Docker CLI:"
& $docker --version

Write-Host ""
Write-Host "Docker contexts:"
& $docker context ls

Write-Host ""
Write-Host "Docker engine:"
& $docker info

