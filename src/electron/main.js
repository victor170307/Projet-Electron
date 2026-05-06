const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// 🛡️ Vérification des imports
// Si une erreur survient ici, l'app ne démarrera même pas.
const { login, register } = require('../backend/auth');

// Import des fonctions de labyrinthe pour plus tard
const db = require('../backend/database');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // Vérifie que preload.js est bien dans le même dossier que main.js
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false, // Sécurité : à garder sur false
    }
  });

  win.loadFile(path.join(__dirname, '../renderer/login/login.html'));
  
  // Optionnel : Ouvre les outils de développement automatiquement pour voir les erreurs
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// =====================
// 👤 IPC HANDLERS (AUTH)
// =====================

ipcMain.handle('login', async (event, { username, password }) => {
  console.log("Main: Tentative de connexion pour", username);
  try {
    const result = await login(username, password);
    
    // 🚀 AJOUT : Si c'est un succès, on change de page
    const win = BrowserWindow.fromWebContents(event.sender);
    win.loadFile(path.join(__dirname, '../renderer/dashboard/dashboard.html'));
    
    return { success: true, data: result };
  } catch (err) {
    console.error("Main Error Login:", err.message);
    return { success: false, error: err.message };
  }
});
ipcMain.handle('register', async (event, { username, password }) => {
  console.log("Main: Tentative d'inscription pour", username);
  try {
    const result = await register(username, password);
    return { success: true, data: result };
  } catch (err) {
    console.error("Main Error Register:", err.message);
    return { success: false, error: err.message };
  }
});

// =====================
// 🧩 IPC HANDLERS (LABS)
// =====================

ipcMain.handle('getLabyrinths', async (event, userId) => {
  try {
    const labs = await db.getLabyrinths(userId);
    return labs;
  } catch (err) {
    return [];
  }
});

ipcMain.handle('createLabyrinth', async (event, userId, data) => {
  try {
    const id = await db.createLabyrinth(userId, data);
      return { success: true, id };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('deleteLabyrinth', async (event, id) => {
  try {
    await db.deleteLabyrinth(id);
    return { success: true };
  } catch (err) {
    return { success: false };
  }
});
