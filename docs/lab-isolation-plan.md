# Lab Isolation Plan

## Current Status

The current MVP uses safe server-side flag challenges. Real isolated labs are not running yet because the local machine does not currently have Docker or WSL installed.

## Recommended Runtime

Use Docker Desktop with WSL2 backend as the first lab runtime.

Why:

- Faster than full VM orchestration.
- Easier to reset per user session.
- Good enough for beginner Linux, forensics, web, and log-analysis labs.
- Can later be replaced or extended with VM-based labs.

## Isolation Defaults

For beginner labs:

- `--network none` unless the lab explicitly needs internal networking.
- `--cap-drop ALL`.
- memory limit around `128m` to `512m`.
- CPU limit around `0.5` to `1`.
- no host directory mounts except read-only lab assets.
- short-lived containers.
- no privileged containers.
- no access to real targets.

## MVP Integration Plan

1. Add lab catalog metadata.
2. Add `/labs` page.
3. Add Dockerfile templates for safe labs.
4. Add a lab launcher service after Docker is installed.
5. Connect challenge pages to lab start/stop actions.
6. Log lab start/stop events.
7. Add cleanup command for stale containers.

## First Candidate Labs

- Linux hidden file lab.
- Forensics metadata lab.
- HTTP request reading lab.
- Log analysis lab.

## Safety Rule

Labs must be educational and isolated. The platform should never encourage attacking real systems or scanning public networks.

