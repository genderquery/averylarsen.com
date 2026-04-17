---
title: Mitigating performance and health issues on budget SATA SSDs
tags:
  - Linux
date: 2026-04-16
---

## Overview

[Solid state drives] (SSDs) use NAND flash organized into cells to store data.
These cells have a limited number of writes and become unusable over time. A
controller inside the SSD manages a flash translation layer (FTL) to map logical
blocks to physical cells. This allows the controller to remap bad cells.

On high quality SSDs, this FTL is stored on a DRAM chip; however on some budget
SATA SSDs, the controller uses space reserved on the NAND flash itself to use
for this purpose. This creates several issues with performance and drive
reliability that can be mitigated on Linux with the right choices and tools.

## zram instead of swap

When partitioning for a new install, do not create a swap partition. Instead,
use [zram]. It creates a compressed swap space in RAM. This is not only faster
than swapping to disk, but reduces wear on flash cells.

Fedora uses zram by default since 33. On Debian it can be enabled by
installing [systemd-zram-generator]. The default configuration will create a
swap device that is "50% of available RAM or 4GiB, whichever is less". See
`zram-generator.conf(5)` if you want to configure it further.

It is recommend to increase `vm.swappiness` to take better advantage of zram.
See https://wiki.archlinux.org/title/Zram#Optimizing_swap_on_zram.

## File systems

If you don't need extra features of [Btrfs] such as snapshotting, [ext4] is more
performant and causes less wear on DRAM-less SSDs.

Btrfs is a copy on write (COW) filesystem where instead of overwriting existing
blocks, it writes modifications to a new block and updates the metadata to point
to it. This tends to generate a high volume of [TRIM] commands as old blocks are
marked unused. DRAM-less SSD controllers like the Phison S11 struggle to keep
pace and panic rendering the drive unusable.

To mitigate the issue, use the following mount options:

Use either `discard=async` to batch TRIM commands or `nodiscard` to disable it
entirely. Run `fstrim` on a weekly basis to clean up unused blocks. The systemd
`fstrim.timer` is automatically enabled on Fedora 32 or later and Debian 11 or
later.

Add `commit=60` to increase metadata syncs from the default of 30 seconds on
Btrfs or 5 seconds on ext4. If there is a sudden power loss, you may lose data
not yet committed, but the filesystem will be intact regardless.

You can use `noatime` to prevent the filesystem from updating the access time
every time a file is read. This can prevent some applications like `mutt` from
working, however.

On Btrfs only, `compress-force=zstd:1` enables transparent compression
minimizing the number of impacted cells. 

Regardless of file system, try to keep the drive from filling up. Its
performance degrades as less free space is available.

[Solid state drives]: https://wiki.archlinux.org/title/Solid_state_drive
[zram]: https://wiki.archlinux.org/title/Zram
[systemd-zram-generator]: https://packages.debian.org/systemd-zram-generator
[Btrfs]: https://wiki.archlinux.org/title/Btrfs
[ext4]: https://wiki.archlinux.org/title/Ext4
[TRIM]: https://en.wikipedia.org/wiki/Trim_(computing)
