---
title: Pwnable CFT - flag
tags:
  - pwnable
  - ctf
date: 2024-01-05
---

In this challenge, we only get a binary:

```
Papa brought me a packed present! let's open it.

Download : http://pwnable.kr/bin/flag

This is reversing task. all you need is binary
```

Let's take a look:

```sh
$ file flag
flag: ELF 64-bit LSB executable, x86-64, version 1 (GNU/Linux), statically linked, no section header
```

Running the program gives us a hint:

```sh
$ ./flag
I will malloc() and strcpy the flag there. take it.
```

If we run [`strings`] against the binary, we'll see a lot of garbage, but we can also see that it is packed by [UPX].

```sh
$ strings -n60 flag
...
$Info: This file is packed with the UPX executable packer http://upx.sf.net $
$Id: UPX 3.08 Copyright (C) 1996-2011 the UPX Team. All Rights Reserved. $
```

We could use `upx -d flag` to decompress the binary and run strings then, but
let's take a more interesting and universal approach using `gdb`:

```sh
$ gdb ./flag
...
Reading symbols from flag...
(No debugging symbols found in flag)
```

We don't have any debugging symbols this time, so we won't be able to break on
specific functions. We can, however, break on [syscalls]. We want break just
before the program exits, so we can catch [`exit`] or [`exit_group`].

```
(gdb) catch syscall exit
Catchpoint 1 (syscall 'exit' [60])
(gdb) catch syscall exit_group
Catchpoint 2 (syscall 'exit_group' [231])
```

Let now run the program:

```
(gdb) run
Starting program: /home/avery/src/pwnable/flag
I will malloc() and strcpy the flag there. take it.

Catchpoint 2 (call to syscall exit_group), 0x0000000000418ee8 in ?? ()
```

We caught the syscall and now what we want to do is examine the heap. First we need to find where the heap is in memory:

```
(gdb) info proc mappings
process 54777
Mapped address spaces:

          Start Addr           End Addr       Size     Offset  Perms  objfile
            0x400000           0x4c2000    0xc2000        0x0  r-xp
            0x4c2000           0x6c1000   0x1ff000        0x0  ---p
            0x6c1000           0x6ea000    0x29000        0x0  rw-p   [heap]
            0x800000           0x801000     0x1000        0x0  rwxp
      0x7ffff7ff8000     0x7ffff7ff9000     0x1000        0x0  rw-p
      0x7ffff7ff9000     0x7ffff7ffd000     0x4000        0x0  r--p   [vvar]
      0x7ffff7ffd000     0x7ffff7fff000     0x2000        0x0  r-xp   [vdso]
      0x7ffffffde000     0x7ffffffff000    0x21000        0x0  rw-p   [stack]
```

We can see the heap is from `0x6c1000` to `0x6ea000`. Let's dump it to a file:

```
(gdb) dump binary memory flag.heap 0x6c1000 0x6ea000
```

Now we can run `strings` on it and get our flag:

```
(gdb) shell strings flag.heap
UPX...? sounds like a delivery service :)
```

[`strings`]: https://linux.die.net/man/1/strings
[UPX]: https://en.wikipedia.org/wiki/UPX
[syscalls]: https://en.wikipedia.org/wiki/System_call
[`exit`]: https://linux.die.net/man/2/exit
[`exit_group`]: https://linux.die.net/man/2/exit_group
