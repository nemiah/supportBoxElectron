const electron = require('electron')
// Module to control application life.
const app = electron.app
const Tray = electron.Tray
const Menu = electron.Menu
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

const path = require('path')
const url = require('url')
const Config = require('electron-config')
const config = new Config()

ipcMain.on('reload', (event, arg) => {  
    reload();
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let appIcon = null
function createWindow() {
	let opts = {width: 300, height: 600, show: false, nodeIntegration: false, maximizable: false, icon: __dirname+"/iconTaskbar.png"};
	if(process.platform === "win32")
		opts.icon = __dirname+"/iconWindows.ico"
	
	Object.assign(opts, config.get('winBounds'))
	
	// Create the browser window.
	mainWindow = new BrowserWindow(opts);//{width: 300, height: 600})
	// and load the index.html of the app.
	reload();
	
	//mainWindow.once('ready-to-show', mainWindow.show)

	mainWindow.on('minimize',function(event){
		event.preventDefault();
		mainWindow.hide();
	});

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})

	mainWindow.on('close', function(event) {
		config.set('winBounds', mainWindow.getBounds())
		
		if(!app.isQuiting){
			event.preventDefault();
			mainWindow.hide();
		}

		return false;
	})
	
	appIcon = new Tray(__dirname+"/iconTray.png")
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Anzeigen', click: function(){ mainWindow.show(); }},
		//{label: 'Einstellungen'},
		{label: "Beenden", click: function(){ 
			app.isQuiting = true;
			app.quit(); }}
	])
	appIcon.on("click", function(){
		if(mainWindow.isVisible())
			mainWindow.hide();
		else
			mainWindow.show();
	});
	// Make a change to the context menu
	contextMenu.items[1].checked = false

	// Call this again for Linux because we modified the context menu
	appIcon.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

function reload(){
	mainWindow.loadURL(config.get('server', 'https://hq.supportbox.io')+"/ubiquitous/CustomerPage/?D=supportBox/SBElectron&cloud="+config.get('cloud', 'https://cloud.furtmeier.it'));
}
