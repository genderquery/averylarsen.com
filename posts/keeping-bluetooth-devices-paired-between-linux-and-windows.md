---
title: Keeping Bluetooth devices paired between Linux and Windows
tags:
  - Linux
  - Windows
  - Bluetooth
date: 2019-12-20
---

When booting between Debian and Windows on my laptop, I used to have to re-pair my Bluetooth devices each time. In this guide, I'll show how I copied the pairing keys from Windows and used them in Debian so everything stays paired between reboots.

<!--more-->

## Getting the keys out of Windows

The pairing keys in Windows 10 are stored in the registry at `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BTHPORT\Parameters\Keys\`. However, they can only be accessed by the SYSTEM account. We're going to use PsExec to run the Registry Editor with the SYSTEM account. Additionally, PsExec must be ran as Administrator, so were going to run it from an Administrator Command Prompt.

1. [Download PsTools][pstools] from Microsoft's Windows Sysinternals site and extract it somewhere.

2. Open the Command Prompt as Administrator by hitting the Windows key, typing `cmd`, then right-clicking on the *Command Prompt* menu entry, and finally selecting "Run as administrator".

3. Navigate to where you extracted PsTools.

```
> cd /users/avery/downloads/pstools
```

4. Launch the Registry Editor as the SYSTEM account by using PsExec.

```
> psexec64 -s -i regedit
```

5. Navigate to the branch `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BTHPORT\Parameters\Keys\`.

6. You should seen an entry for each Bluetooth device you've paired. The name of the key is the MAC address and the value is the pairing key. In my case, it looked something like this:

```ini
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BTHPORT\Parameters\Keys\1002b589d351]
"28c13c548dc2"=hex:05,0f,65,62,09,dd,d3,5c,0f,78,20,09,8a,41,a5,2e
"34885dae8022"=hex:36,85,a7,90,32,1d,ba,11,70,df,89,81,43,29,b8,3c
```
7. Export the Keys branch by right-clicking and selecting *Export*. Save it somewhere you'll be able it access from Linux.


## Updating the keys in Linux

Now that we have our pairing keys, we can boot back into Linux and change the keys. Go ahead and pair your devices the way you normally would, if you haven't already. This will create the config files we'll need to edit. Those files, however, can only be accessed by root, so we'll need a root shell.

1. Get a root shell.

```sh
$ sudo -s
```

2. Find the directory for your Bluetooth controller.

```
# cd /var/lib/bluetooth/ && ls
10:02:B5:89:D3:51
```

3. There's probably only one, so move into that directory:

```
# cd 10:02:B5:89:D3:51
```

If there's more than one, you can use `bluetoothctl` to figure out which is your default.

```
# bluetoothctl list
Controller 10:02:B5:89:D3:51 thinkpad [default]
```

4. Inside this directory, there will be a directory for each paired device, named with it's respective MAC address, with an `info` file inside each.

```
# ls
28:C1:3C:54:8D:C2  34:88:5D:AE:80:22  cache  settings
```

5. Referencing the Registry entries you exported earlier, edit the `info` files such that the `Key` under `[LinkKey]` matches the string of hex values from Windows.

```
# vim 34:88:5D:AE:80:22/info
```

For example, this is the edited entry for my mouse:

```ini
[General]
Name=Bluetooth Mouse M336/M337/M535
Class=0x000580
SupportedTechnologies=BR/EDR;
Trusted=true
Blocked=false
Services=00001000-0000-1000-8000-00805f9b34fb;00001124-0000-1000-8000-00805f9b34fb;00001200-0000-1000-8000-00805f9b34fb;

[LinkKey]
Key=3685a790321dba1170df89814329b83c
Type=4
PINLength=0

[DeviceID]
Source=2
Vendor=1133
Product=45078
Version=4611
```

6. When you're done editing all the `info` files, restart the Bluetooth service for the new settings to take effect.

```
# systemctl restart bluetooth
```

## Acknowledgments

Thank you to [Richard Vigars][richardvigars] for writing an article that got me started on figuring this out.

Thank you to user [thezeroth][thezeroth] on Super User for providing an answer on how to access the pairing keys in the Registry.


[pstools]: https://docs.microsoft.com/en-us/sysinternals/downloads/psexec "PsExec - Windows Sysinternals | Microsoft Docs"

[richardvigars]: https://medium.com/@richardvigars/where-to-find-bluetooth-link-keys-in-the-windows-registry-for-the-ekobuy-usb-dongle-csr-harmony-b7777c90b41 "Finding Bluetooth link key in Windows 7, to double pair a device on dualboot computer - Super User"

[thezeroth]: https://superuser.com/questions/229930/finding-bluetooth-link-key-in-windows-7-to-double-pair-a-device-on-dualboot-com/835710#835710 "Where to find Bluetooth link keys in the Windows registry for the EkoBuy USB dongle / CSR Harmony stack"
