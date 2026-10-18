const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {

    const win = new BrowserWindow({

        title: "Welcome to our Town - by Lo.Ca. 4 Students",

        width: 1400,
        height: 900,

        autoHideMenuBar: true,

        show: false,

        webPreferences: {
            contextIsolation: true,
            devTools: true
        }

    });

    win.loadFile("index.html");
    //win.webContents.openDevTools({ mode: "detach" });
    win.webContents.on("did-finish-load", () => {
     console.log("Pagina caricata");
    });

    win.maximize();

    win.once("ready-to-show", () => {

        win.show();

    });

}

app.commandLine.appendSwitch("remote-debugging-port", "9222");
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {

    if (process.platform !== "darwin")
        app.quit();

});
