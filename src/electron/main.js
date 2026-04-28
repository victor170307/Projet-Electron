const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const { login, register } = require('../backend/auth');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, '../renderer/login/login.html'));
}

app.whenReady().then(createWindow);


ipcMain.handle('login', async (event, { username, password }) => {  // login
  try {
    const result = await login(username, password);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// REGISTER
ipcMain.handle('register', async (event, { username, password }) => {
  try {
    const result = await register(username, password);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
});