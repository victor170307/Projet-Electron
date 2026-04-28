const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

// Quand Electron est prêt
app.whenReady().then(() => {
  createWindow();
});

// Quitter l'app quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  app.quit();
});