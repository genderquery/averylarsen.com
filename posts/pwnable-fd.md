---
title: Pwnable CTF - fd
tags:
  - pwnable
  - ctf
date: 2024-01-03
---

In this first challenge, we have to SSH into a shell:

```
Mommy! what is a file descriptor in Linux?

* try to play the wargame your self but if you are ABSOLUTE beginner, follow this tutorial link:
https://youtu.be/971eZhMHQQw

ssh fd@pwnable.kr -p2222 (pw:guest)
```

Let's look around:
```sh
$ ls -l
total 16
-r-sr-x--- 1 fd_pwn fd   7322 Jun 11  2014 fd
-rw-r--r-- 1 root   root  418 Jun 11  2014 fd.c
-r--r----- 1 fd_pwn root   50 Jun 11  2014 flag
```

The `flag` file we need to read is owned by and can only be read by `fdpwn`. As
the user `fd`, we can execute `fd` and read `fd.c`. The `fd` program also has
the [sticky bit] set, which means when it runs, it will run as the owner,
`fd_pwn`. We need to figure out how to get this program to read the `flag` file
for us.

When we run `fd`, we can see it wants an argument:
```sh
$ ./fd
pass argv[1] a number
```

Passing a number gives a hint:
```sh
$ ./fd 1234
learn about Linux file IO
```

Let's take a look at `fd.c`:
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
char buf[32];
int main(int argc, char* argv[], char* envp[]){
        if(argc<2){
                printf("pass argv[1] a number\n");
                return 0;
        }
        int fd = atoi( argv[1] ) - 0x1234;
        int len = 0;
        len = read(fd, buf, 32);
        if(!strcmp("LETMEWIN\n", buf)){
                printf("good job :)\n");
                system("/bin/cat flag");
                exit(0);
        }
        printf("learn about Linux file IO\n");
        return 0;

}
```

We can see the argument gets converted to an `int` with [`atoi`], subtracted
from `0x1234`, and finally stored in `fd`. That variable gets passed to [`read`]
as a [file descriptor], which reads from the file into `buf` that gets compared
against "LETMEWIN". If that succeeds, the program will `cat` out the `flag`
file.

So how do we get "LETMEWIN" into the buffer? On POSIX systems, there are three
special file descriptors. `0` for standard in (stdin), `1` for standard out
(stdout), and `2` for standard error (stderr). If `read` is passed `0` into it's
first argument, it will read from standard in and we can type in "LETMEWIN".

To get `fd` to equal `0`, we need to pass a number to the program that will get
parsed as `0x1234`, or `4660` in decimal.

```sh
~$ ./fd 4660
LETMEWIN
good job :)
mommy! I think I know what a file descriptor is!!
```

And just like, we have our flag: `mommy! I think I know what a file descriptor
is!!`

[`atoi`]: https://linux.die.net/man/3/atoi
[`read`]: https://linux.die.net/man/3/read
[`stdin`]: https://linux.die.net/man/3/stdin
[file descriptor]: https://en.wikipedia.org/wiki/File_descriptor
[sticky bit]: https://en.wikipedia.org/wiki/Sticky_bit
