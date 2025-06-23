const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  toggleExpand: () => ipcRenderer.send('toggleExpand')
});
