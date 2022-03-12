---
title: Updating ThinkPad UEFI Firmware With A Flash Drive Using Linux
tags:
  - Linux
  - UEFI
  - ThinkPad
  - Lenovo
date: 2019-08-05 20:53:05
---

Lenovo offers two options for updating the UEFI firmware: using a Windows-only
program or booting from a CD. In this article, I'll show you how to make a
bootable flash drive from the firmware update CD image using `geteltorito`.

<!-- more -->

## Download the ISO Image

Head over to [Lenovo's support site][support] and put your model or serial
number in to get access to the your laptop's downloads page. Scroll down to
the _BIOS/UEFI_ section and download the _BIOS Update (Bootable CD)_ file.
It'll be named something like "jbuj72wd.iso".

## Extract the Boot Image

If you don't already have the `geteltorito` utility, it's a part of the
`genisoimage` package:

```
$ sudo apt install genisoimage
```

From the directory of the ISO file you downloaded, run `geteltorito` and
specify an output file with option `-o`.

```
$ geteltorito -o efi-update.img jbuj72wd.iso
Booting catalog starts at sector: 20
Manufacturer of CD: NERO BURNING ROM VER 12
Image architecture: x86
Boot media type is: harddisk
El Torito image starts at sector 27 and has 43008 sector(s) of 512 Bytes

Image has been written to file "efi-update.img".
```

## Write to the Flash Drive

Insert a flash drive that doesn't have anything important on it because **any
data on it will be overwritten**! Identify the device path for the drive:

```
$ lsblk -do PATH,SIZE,MODEL
PATH       SIZE MODEL
/dev/sda 465.8G ST500LM021-1KJ152
/dev/sdb 223.6G SB2
/dev/sdc  14.9G SanDisk_SSD_U110_16GB
/dev/sdd   3.7G STORE_N_GO
```

In my case, my flash drive is `/dev/sdd`. Use `dd` to write the image to the
flash drive. `if` is the input file, `of` is the output device.

```
$ sudo dd if=efi-update.img of=/dev/sdd
43008+0 records in
43008+0 records out
22020096 bytes (22 MB, 21 MiB) copied, 0.091765 s, 240 MB/s
```

And finally make sure any cached writes get written before restarting or
removing the flash drive.

```
$ sync
```

## Restart and Update

Restart your laptop, boot from the flash drive (using F12 on the T450s, at
least), and follow the on-screen instructions.

[support]: https://support.lenovo.com/
