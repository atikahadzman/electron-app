const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
});

contextBridge.exposeInMainWorld('auth', {
    login: (username, password) =>
        ipcRenderer.invoke('login', username, password),

    getDashboard: (token) =>
        ipcRenderer.invoke('get-dashboard', token)
});