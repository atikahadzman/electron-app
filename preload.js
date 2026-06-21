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
        ipcRenderer.invoke('get-dashboard', token),

    getLocalDashboard: () =>
        ipcRenderer.invoke('get-local-dashboard'),

    saveUser: (user) =>
        ipcRenderer.invoke('save-user', user),

    getUser: (username) =>
        ipcRenderer.invoke('get-user', username),
    
    validateLocalLogin: (username, password) =>
        ipcRenderer.invoke('validate-local-login', username, password),

    deleteUser: (id) =>
        ipcRenderer.invoke('delete-user', id),

    deleteDashboard: (id = 'dashboard') =>
        ipcRenderer.invoke('delete-dashboard', id),
});