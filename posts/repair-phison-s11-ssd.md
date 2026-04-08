---
title: Repair Phison S11 SSD in Panic Mode (SATAFIRM S11)
date: 2026-04-08
---

I had a Patriot Burst 120 GB SATA SSD that was no longer working.
Under Windows, it shows up as "Not Initialized" in Disk Management 
and in the Device Manager as "SATAFIRM S11".

This drive uses the Phison PS3111-S11 controller which is used in 
many budget SSDs and has a tendency to go into "panic mode" when 
encountering too many block errors or just due to firmware bugs.

While at this point any data is no longer easily recoverable, it is 
possible to reflash the firmware to make the drive usable again.

The flashing utility generally only detects drives that are 
directly attached to the host SATA controller. It might not work 
on a drive attached over USB.

We will be downloading and running executables as Administrator from 
an untrusted website. While I have no reason to beleive there is any 
malware in these files, I highly recommend doing this on a computer
that you don't care about.

Run all of the following on an Administrator console.

First we must identify the existing firmware and NAND manufacturer 
of the drive. Download and run lastest version of phison_flash_id.exe 
from https://www.usbdev.ru/files/phison/phisonflashid/.

I got the following output:
```
Model: SATAFIRM   S11
Fw   : SBFM11W1
Size : 114473 MB
P/N  : 511-170920029   , SBSM11.0
S11fw: SBFM11.1, 2017Sep 1
S11rv: M11.1-37
Original Model: Patriot Burst
Bank00: 0x98,0x3a,0x98,0xa3,0x76,0x51,0x8,0x14 - Toshiba 15nm TLC 16k 128Gb/CE 128Gb/die 2Plane/die
Bank01: 0x98,0x3a,0x98,0xa3,0x76,0x51,0x8,0x14 - Toshiba 15nm TLC 16k 128Gb/CE 128Gb/die 2Plane/die
Bank04: 0x98,0x3a,0x98,0xa3,0x76,0x51,0x8,0x14 - Toshiba 15nm TLC 16k 128Gb/CE 128Gb/die 2Plane/die
Bank05: 0x98,0x3a,0x98,0xa3,0x76,0x51,0x8,0x14 - Toshiba 15nm TLC 16k 128Gb/CE 128Gb/die 2Plane/die
Bank08: 0x98,0x3a,0x98,0xa3,0x76,0x51,0x8,0x14 - Toshiba 15nm TLC 16k 128Gb/CE 128Gb/die 2Plane/die
Bank09: 0x98,0x3a,0x98,0xa3,0x76,0x51,0x8,0x14 - Toshiba 15nm TLC 16k 128Gb/CE 128Gb/die 2Plane/die
Bank12: 0x98,0x3a,0x98,0xa3,0x76,0x51,0x8,0x14 - Toshiba 15nm TLC 16k 128Gb/CE 128Gb/die 2Plane/die
Bank13: 0x98,0x3a,0x98,0xa3,0x76,0x51,0x8,0x14 - Toshiba 15nm TLC 16k 128Gb/CE 128Gb/die 2Plane/die
Controller    : PS3111
Flash CE      : 8
Flash Channel : 2
DRAM Size,MB  : 32
Flash CE Mask : [++--++-- ++--++--]
Flash Mode/Clk: 2/5 (Set 2/5)
SLC Cache     : Default
```

We can see the firmware is `SBFM11.1, 2017Sep 1` and the NANDs are from Toshiba.

Download firmware files, `firmware_ps3111.rar`, from https://www.usbdev.ru/files/phison/ps3111fw/.

Locate a compatible firmware. Match the letters and major version. 
In my case SBFM11. I had the following firmware to choose from:
```
SBFM11.0_10022017.BIN
SBFM11.0_01032017.BIN
SBFM11.1_01092017.BIN
SBFM11.2_25052018.BIN
SBFM11.2_08082018.BIN
SBFM11.2_11062021.BIN
SBFM11.2_06092018.BIN
SBFM11.3_26062019.BIN
```

I chose the most recent, `SBFM11.3_26062019.BIN`.
This release fixes some of the issues that can cause the firmware to panic.

Download and extract `s11-flasher` from https://www.usbdev.ru/files/phison/phisons11flasher/. 
Copy the firmware file you extracted earlier into this directory and rename it `fw.bin`.

Since I have Toshiba NANDs, I ran `s11-flasher2-toshiba.cmd`. This will generate a `fw.exe`. 
Run it as Administrator. Select your drive from the dropdown menu and click "Upgrade Firmware".
Reboot. You should now have a working drive. Note that this will clear any SMART metrics. 
Use the drive with caution and don't store anything important on it.
