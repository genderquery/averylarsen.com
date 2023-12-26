---
title: Force GPG to ask for password on command line
tags:
  - Linux
date: 2023-12-26
---

By default, Ubuntu will try to use an X11 or curses dialog when prompting for a
password. To force it to use your terminal, add the following to `$HOME/.basrc`:

```bash
export GPG_TTY=$(tty)
```
