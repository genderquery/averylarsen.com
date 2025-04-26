---
title: Sign your commits with Git and GPG on the command line
tags:
  - Linux
  - git
  - gpg
date: 2024-01-26
---

This article assumes you already have a private signing key in your GPG keychain.

Configure git to sign your commits by default. This is optional, but if you don't enable this option, you'll have to run `git commit -S` to sign each time.

```sh
git config --global commit.gpgsign true
```

To get GPG to ask for the password on the command line instead of a curses window:

Edit (or create) `$HOME/.gnupg/gpg.conf`:

```
use-agent
pinentry-mode loopback
```

Edit (or create) `$HOME/.gnupg/gpg-agent.conf`:

```
allow-loopback-pinentry
```

Reload those changes by running:

```sh
gpgconf --kill gpg-agent
```

Finally add the following to `$HOME/.bashrc`, `$HOME/.zshrc`, etc:

```sh
export GPG_TTY=$(tty)
```

Start a new terminal or run `source $HOME/.bashrc` accept the new changes.
