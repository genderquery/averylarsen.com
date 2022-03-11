---
title: Installing the free Celeste game from Epic Games
date: 2019-08-29 20:53:56
tags:
  - Linux
  - Games
---

For a limited time, Celeste is available as a part of [Epic Games' Free
Games Collection][freegames]. Unfortunately for Linux users, this version is
Windows-only and requires the Epic Games Installer to download. In this short
article, I'll show you how to get the game running under Debian.

<!-- more -->

If you don't already have an Epic Games account, you'll need to sign up. Then
from the [Celeste product page][celeste] you can click the *Get* button to add
it to your account.

The Epic Games Installer won't install if you try to download it from the
website and run it with vanilla Wine. Instead, I used [Lutris][lutris] which
uses user-contributed install scripts to make everything work. (Thanks for the
tip, kitten!)

After installing, go to the [Lutris page for the Epic Games
Store][lutrisepicgames] and click the *Install* button and it should launch in
your Lutris install.

It took awhile for everything to download and install everything, so be
patient.

Once the Epic Games Store is installed under Lutris, run it and log into your
Epic Games Account. It should begin downloading Celeste automatically.

I initially got an error with the following message:

> There is a problem with your graphics card. Please ensure your card meets
> the minimum system requirements and you have the latest drivers installed.

The solution for this was to disable DXVK in the *Runner options* in the
configuration window, launched by right-clicking and selecting *Configure* or
clicking the wrench and screwdriver icon in the side panel.

Once Celeste is installed, we won't be using the Epic Games Store to run it,
so you can close it.

Add a new game in Lutris by clicking the plus button and selecting *Add game*
from the menu. In the *Game info* tab, fill in "Celeste" for the name. In the
*Game options* tab, browse for the executable. It should be located somewhere
similar to `$HOME/Games/epic-games-store/drive_c/Program Files/Epic
Games/Celeste/Celeste.exe`. 

In order to get my PS4 Dual Shock controller to work, I had to enable *x360ce
xinput 9.1.0 mode* under the *Runner options* tab.

That should be it. Save your settings and click the *Play* button. Enjoy!


[celeste]: https://www.epicgames.com/store/en-US/product/celeste/home
[freegames]: https://www.epicgames.com/store/en-US/collection/free-games-collection
[lutris]: https://lutris.net/downloads/
[lutrisepicgames]: https://lutris.net/games/epic-games-store/
