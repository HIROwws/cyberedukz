# CyberEdu KZ Labs

This folder contains the planned isolated lab structure for future Docker/VM execution.

Current machine status:

- Docker is not installed.
- WSL is not installed.
- The MVP therefore runs safe flag-based challenges without real containers.

## Target Runtime

Recommended first runtime:

- Docker Desktop with WSL2 backend
- No public network by default
- Read-only filesystem where possible
- Dropped Linux capabilities
- Small CPU and memory limits
- Short-lived containers per session

## Lab Manifest

See:

```text
labs/catalog.json
```

Each lab maps:

- course
- lesson
- challenge
- runtime
- isolation controls
- image name
- learning goal

## Future Command Shape

Example:

```powershell
docker build -t cyberedukz/linux-hidden-file-lab .\labs\docker\linux-hidden-file
docker run --rm -it --network none --memory 128m --cpus 0.5 --cap-drop ALL cyberedukz/linux-hidden-file-lab
```

Do not run untrusted public images as training labs.

## Local Setup

See:

```text
docs/docker-wsl-setup.md
```
