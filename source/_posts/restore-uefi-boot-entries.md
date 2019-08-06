---
title: Restore UEFI Boot Entries
tags:
  - Linux
  - Debian
  - UEFI
date: 2019-08-06 14:25:07
---


I recently loaded the setup defaults on my ThinkPad after trying to diagnose a
boot problem and this cleared the UEFI boot entries leaving me unable to boot
my installed OS. In this article, I'll show you how to recreate a new boot
entry using `efibootmgr`.

<!-- more -->

You'll need a live OS to boot from that has `efibootmgr`. You might be able to
use the [Debian netinst rescue mode][rescue], but I would recommend the [full
live install images][live]. I used [Tails], a Debian-based live OS focused on
privacy, because it's what I had on hand. If you do use Tails, make to
[enable the administration password][admin] at the Tails Greeter.

Whatever you choose, boot into it and get yourself to a root prompt.

Identify the device name for your system partition. In my case, my EFI System
partition is `sda1`, which is always a FAT filesystem and is usually the first
partition on a disk.

```
root@amnesia:~# lsblk -o NAME,FSTYPE,MODEL,SIZE
NAME                      FSTYPE      MODEL                   SIZE
sda                                   SB2                   223.6G
├─sda1                    vfat                                512M
├─sda2                    ext2                                244M
└─sda3                    crypto_LUKS                       222.9G
  └─sda3_crypt            LVM2_member                       222.8G
    ├─thinkpad--vg-root   ext4                                 28G
    ├─thinkpad--vg-swap_1 swap                               11.9G
    └─thinkpad--vg-home   ext4                                183G
sdb                                   USB_2.0_FD              7.5G
├─sdb1                    vfat                                  4G
└─sdb2                    crypto_LUKS                         3.5G
```

I recommend mounting the EFI system partition to check you have the right disk
and also to verify the path to the UEFI binary we'll need next. Unmount when
you're done.

```
root@amnesia:~# mount /dev/sda1 /mnt
root@amnesia:~# find /mnt
/mnt
/mnt/EFI
/mnt/EFI/debian
/mnt/EFI/debian/shimx64.efi
/mnt/EFI/debian/grubx64.efi
/mnt/EFI/debian/mmx64.efi
/mnt/EFI/debian/fbx64.efi
/mnt/EFI/debian/BOOTX64.CSV
/mnt/EFI/debian/grub.cfg
/mnt/EFI/debian/grub.efi
/mnt/EFI/debian/grubia32.efi
```

Now that you've identified the correct disk, use `efibootmgr` to create a new
entry. `--disk` is the disk of the system partition, *not* the partition
itself! `--part` is the partition number, *starting at 1*. `--loader` is the
path to the UEFI binary. You will need to use `shimx64.efi` instead of
`grubx64.efi` if you're using [SecureBoot][secureboot]. You must use
backslashes as the path separator.

```
root@amnesia:~# efibootmgr --verbose --create --disk /dev/sda --part 1 --loader "\efi\debian\grubx64.efi" --label "Debian"
BootCurrent: 0008
Timeout: 2 seconds
BootOrder: 0012,0000,0001,0002,0003,0007,0008,0009,000A,000B,000C,000D
Boot0000  Setup	FvFile(721c8b66-426c-4e86-8e99-3457c46ab0b9)
Boot0001  Boot Menu	FvFile(126a762d-5758-4fca-8531-201a7f57f850)
Boot0002  Diagnostic Splash Screen	FvFile(a7d8d9a6-6ab0-4aeb-ad9d-163e59a7a380)
...
Boot0012* Debian	HD(1,GPT,3b9ed62c-c28d-4866-842e-29c9bc7b0ac7,0x800,0x100000)/File(\efi\debian\grubx64.efi)
```

Assuming everything went OK, `efibootmgr` will list all the entries (which I
trimmed here) and your new one should be at the bottom. Confirm everything
looks correct and reboot. Fingers crossed!


[rescue]: https://www.debian.org/releases/stable/amd64/ch08s06.en.html
[live]: https://www.debian.org/CD/live/
[tails]: https://tails.boum.org/
[admin]: https://tails.boum.org/doc/first_steps/startup_options/administration_password/index.en.html
[secureboot]: https://wiki.debian.org/SecureBoot