---
title: Force GPG to ask for password on command line
tags:
  - Linux
date: 2023-12-26
---

By default, GPG on Ubuntu will try to use an X11 or curses dialog when prompting
for a password. To force it to read from the terminal...

Install `pinentry-tty`:
```sh
$ sudo apt install pinentry-tty
```

Choose the option for `/usr/bin/pinentry-tty`:
```sh
$ sudo update-alternatives --config pinentry
There are 2 choices for the alternative pinentry (providing /usr/bin/pinentry).

  Selection    Path                      Priority   Status
------------------------------------------------------------
  0            /usr/bin/pinentry-curses   50        auto mode
  1            /usr/bin/pinentry-curses   50        manual mode
* 2            /usr/bin/pinentry-tty      30        manual mode

Press <enter> to keep the current choice[*], or type selection number: 2
```

And finally add the following to `$HOME/.basrc`:
```bash
export GPG_TTY=$(tty)
```

Start a new terminal or run `source $HOME/.bashrc` accept the new changes.
