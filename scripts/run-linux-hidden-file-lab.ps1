$ErrorActionPreference = "Stop"

$docker = "docker"
if (Test-Path -LiteralPath "C:\Program Files\Docker\Docker\resources\bin\docker.exe") {
  $docker = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
}

& $docker run --rm -it --network none --memory 128m --cpus 0.5 --cap-drop ALL cyberedukz/linux-hidden-file-lab

