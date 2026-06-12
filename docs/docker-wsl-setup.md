# Docker and WSL Setup

Docker Desktop is installed, but this machine still needs Windows WSL/virtualization features enabled before real isolated labs can run.

## Current Finding

Docker CLI is installed:

```text
C:\Program Files\Docker\Docker\resources\bin\docker.exe
```

Docker Desktop starts, but the backend does not provide a working engine yet because WSL/VM platform is not enabled.

Attempting to enable Windows features from this session failed with:

```text
Error: 740
Elevated permissions are required to run DISM.
```

## Required Admin Step

Open PowerShell as Administrator and run:

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
wsl --install --no-distribution
```

Then restart Windows.

After restart:

```powershell
wsl --status
docker info
```

## CyberEdu KZ Lab Commands

Build lab images:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-labs.ps1
```

Run first lab:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-linux-hidden-file-lab.ps1
```

Check Docker:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\check-docker.ps1
```

