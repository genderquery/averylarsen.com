---
title: Sign your Git Commits in Windows
tags:
  - Windows
  - git
date: 2025-03-14
---

Install Git if you haven't already.

```powershell
winget install --id Git.Git
```

Install [The GNU Privacy Guard](https://gnupg.org/).

```powershell
winget install --id GnuPG.GnuPG
```

Import your key(s) or [generate a new one](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key).

```powershell
gpg --import secret.asc
```

I don't like the dialog box for password entry and prefer to enter my password on the command line. Add this option to `gpg.conf`.

```powershell
"pinentry-mode loopback" >> $env:APPDATA\gnupg\gpg.conf
```

By default your password is cached for 10 minutes. Add these options to `gpg-agent.conf` to cache it for 365 days (32850000 seconds).

```powershell
"default-cache-ttl 32850000" >> $env:APPDATA\gnupg\gpg-agent.conf
"max-cache-ttl 32850000" >> $env:APPDATA\gnupg\gpg-agent.conf
```

Configure Git to use our `gpg.exe` instead of the one bundled with Git.

```powershell
git config --global gpg.program $(Get-Command gpg | Select-Object -Expand Source)
```

Configure git to sign your commits by default. This is optional, but if you don't enable this option, you'll have to run `git commit -S` to sign each time.

```powershell
git config --global commit.gpgsign true
```
