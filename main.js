const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let win;
let isExpanded = false;
let savedPosition = null;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // सुरुवाती पोजिसन
  savedPosition = {
    x: width - 340,
    y: height - 420
  };

  win = new BrowserWindow({
    width: 320,
    height: 400,
    x: savedPosition.x,
    y: savedPosition.y,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('index.html');

  // Move गर्दा पोजिसन track गर्ने
  win.on('moved', () => {
    if (!isExpanded) {
      const bounds = win.getBounds();
      savedPosition = { x: bounds.x, y: bounds.y };
    }
  });

  // Expand/switch toggle
  ipcMain.on('toggleExpand', () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    if (!isExpanded) {
      // expand to center
      win.setBounds({
        x: Math.round((width - 600) / 2),
        y: Math.round((height - 600) / 2),
        width: 600,
        height: 600
      });
      isExpanded = true;
    } else {
      // return to last dragged position
      win.setBounds({
        x: savedPosition.x,
        y: savedPosition.y,
        width: 320,
        height: 400
      });
      isExpanded = false;
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
