Project Overview:
I wanted to explore how SimApp Pro communicates with the USB hardware devices such as the F16 ICP. In this project I setup a barebones project to talk to the LCD Display on the DED. But we also have access to all other Devices such as `SetLedState, SetLedStateBySerialNumber, ReadEvents, etc` (you can find these in `mainsrc\WWTHID.js` of the original SimAPp Pro unpacked code (read below how to unpack source code of SimApp Pro))

My example only touches the LCD screen, but with little tweaking you can easily configure backlight states, lcd brightness, F18 UFC etc. All of the interactions are controlled via their WWTHID_JSAPI.node module which interacts with all their DLLs.


How to unpack Electron App, skip if you do not care about seeing original source code (SimApp Pro)
- Install SimAPp Pro locally
- Find installation on computer
- Go to install_folder/resources/
- Create a new folder called output_folder
- Run `npx extract app.asar output_folder`
- Here you can see the Electron source code used to build the app
- (Checkokut `mainsrc/WWTHID.js` for some signatures of methods available in the .node/DLL modules)

Build Steps if you want to tweak and build on this project:
- Have node installed
- Download src code
- Run `npm install`
- Build the application using: `electron-packager . --platform=win32 --arch=ia32 --out=dist --overwrite`
- Launch via ./dist/F16DEDWriter-win-32-ia32/F16DEDWriter.exe
- Note: for some reason you must rebuild the project using electron-packager each time you make a change, this is so the dll/.node files are copied to the correct spot. I have not found a way to bypass this, but it works!

Example of a simple Pong Game made on the UFC
https://github.com/llamaXc/winwing-f16-ded/assets/11560596/d7d616c9-6641-4bf1-bb54-a633350dc298
