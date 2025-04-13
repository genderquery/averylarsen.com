---
title: Install Alpine Linux as a WSL Distribution
tags:
  - Linux
  - Windows
  - WSL
date: 2025-03-14
---

Download the x86_64 "Mini root filesystem" tarball from https://alpinelinux.org/downloads/.
```powershell
curl -LO https://dl-cdn.alpinelinux.org/alpine/v3.21/releases/x86_64/alpine-minirootfs-3.21.3-x86_64.tar.gz
```

Check that the hash matches.
```powershell
Get-FileHash -Algorithm SHA256 alpine-minirootfs-3.21.3-x86_64.tar.gz
```

Install from the rootfs tarball.
```powershell
wsl --install --name Alpine --from-file alpine-minirootfs-3.21.3-x86_64.tar.gz
```

Enter a root shell. You can also close and reopen Windows Terminal and Alpine should be added to the list of profiles.
```powershell
wsl.exe -d Alpine
```

Add a new user. Add yourself to `wheel` group so you can use `doas` become `root` temporarily.
```sh
adduser -h /home/avery -s /bin/ash avery
adduser avery wheel
```

Install and configure `doas`.
```sh
apk add doas
echo "permit :wheel" >> /etc/doas.conf
```

Back in PowerShell, set the default user.
```powershell
wsl --manage Alpine --set-default-user avery
```
