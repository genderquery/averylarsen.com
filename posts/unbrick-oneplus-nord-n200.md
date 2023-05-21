---
title: Unbrick a OnePlus Nord N200
date: 2023-05-19
---

1. Download and extract [Qualcomm drivers].
2. Download and extract [firmware and tools].
3. Power off phone.
4. Hold volume up and volume down buttons while connecting the phone to the computer over USB. This will place it into emergency download (EDL) mode.
5. Alternatively, you can run `adb reboot edl`.
6. Open Device Manager. There should be a device labeled "QHUSB_BULK". Right-click and select "Update driver".
7. Select "Browse my computer for drivers" and select the folder of the Qualcomm Drivers.
8. The device should now be listed as "QDLOADER 9008".
9. Open "MsmDownloadTool V4.0.exe" in the firmware tools folder.
10. For "User type", select "Others" and click "Next".
11. Click "Start".
12. It should take a few minutes to complete. Reboot when done.

[Qualcomm drivers]: http://download.windowsupdate.com/c/msdownload/update/driver/drvs/2017/03/fe241eb3-d71f-4f86-9143-c6935c203e12_fba473728483260906ba044af3c063e309e6259d.cab
[firmware and tools]: https://onepluscommunityserver.com/list/Unbrick_Tools/OnePlus_Nord_N200/Global_DE17AA/R/OnePlus_Nord_N200_Global_OxygenOS_11.0.3.zip
