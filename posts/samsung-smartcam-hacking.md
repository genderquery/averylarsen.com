---
title: Samsung SmartCam Hacking
date: 2024-07-04
---

1. Hold WiFi button until LED turns yellow/green.
2. Connect to DIRECT-CAM-XXXX. Password "smartcam".
3. GET http://192.168.123.1/information
4. GET http://192.168.123.1/device/network/aplist
5. PUT /device/network
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Network>
<selectedNetwork>Wireless</selectedNetwork>
<wireless>
<fromDHCP>True</fromDHCP>
<ssid>YOUR SSID</ssid>
<password>YOUR PASSWORD</password>
<security>WPA</security>
</wireless>
</Network>
```
