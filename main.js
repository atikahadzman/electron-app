const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const axios = require('axios');
require('dotenv').config();

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// IPC login handler
ipcMain.handle('login', async (_, username, password) => {
    if (!process.env.API_URL || !process.env.LOGIN_ENDPOINT) {
        throw new Error("Missing API_URL or LOGIN_ENDPOINT in .env file");
    }
    const url = process.env.API_URL + process.env.LOGIN_ENDPOINT;

    try {
        const res = await axios.post(url, {
            username,
            password
        });

        return {
            success: true,
            token: res.data.token,
            data: res.data
        };

    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message
        };
    }
});