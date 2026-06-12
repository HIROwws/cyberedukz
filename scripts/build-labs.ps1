$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$docker = "docker"
if (Test-Path -LiteralPath "C:\Program Files\Docker\Docker\resources\bin\docker.exe") {
  $docker = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
}

Set-Location -LiteralPath $projectRoot

& $docker build -t cyberedukz/linux-hidden-file-lab .\labs\docker\linux-hidden-file

