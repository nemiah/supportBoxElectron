# !/bin/bash
#electron-packager . --all --icon "/home/nemiah/NetBeansProjects/supportBoxElectron/iconWindows.ico"
electron-packager . --overwrite --asar --platform=linux --arch=x64 --icon="/home/nemiah/NetBeansProjects/supportBoxElectron/iconLinux.png" --prune=true --out=release
electron-packager . --overwrite --asar --platform=win32 --arch=ia32 --icon="/home/nemiah/NetBeansProjects/supportBoxElectron/iconWindows.ico" --prune=true --out=release
