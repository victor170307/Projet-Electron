const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  login: (data) => ipcRenderer.invoke('login', data),
  register: (data) => ipcRenderer.invoke('register', data),
  getLabyrinths: (userId) => ipcRenderer.invoke('getLabyrinths', userId),
  createLabyrinth: (userId, data) => ipcRenderer.invoke('createLabyrinth', userId, data),
  deleteLabyrinth: (id) => ipcRenderer.invoke('deleteLabyrinth', id)
});