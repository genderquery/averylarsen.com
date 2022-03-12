---
title: Allocate Disk Space Fast With fallocate
tags:
  - Linux
date: 2019-08-05 20:53:30
---

The `fallocate` command allows you to instantly allocate disk space without
having to write to any of the data blocks. It's a near-instant operation and
much easier on your solid-state drive.

<!-- more -->

When allocating space for a disk images, you might be used to using something
like `dd if=/dev/zero of=disk.img bs=2048 count=3906250`, but this is really
slow and creates unnecessary wear.

If you're using XFS, ext4, Btrfs, or tmpfs, your filesystem supports the
`fallocate(2)` Linux system call which can allocate space without having to
write to the blocks. The space is simple marked as uninitialized and is
instantly ready to use.

The `fallocate(1)` utility is included in the `util-linux` package in
Debian-based distros and acts a command-line front-end to the system call.
Instead of the above usage of `dd`, you would run something like the
following:

```
fallocate -l 8GB disk.img
```

There is also a `truncate(1)` utility, a part of the `coreutils` package that
can be used to shrink or extend the size of a file.
