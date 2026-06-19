const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const axios = require('axios');
const PouchDB = require('pouchdb');
const db = new PouchDB('users');
require('dotenv').config();

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');

// make the app auto reload
try {
    require('electron-reload')(__dirname);
} catch (err) {
    console.error(err);
}

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

ipcMain.handle('validate-local-login', async (_, username, password) => {
    try {
        const user = await db.get(username).catch(() => null);

        if (user.password === password) {
            return {
                success: true,
                offline: true,
                user
            };
        }

        return {
            success: false,
            message: 'Invalid password'
        };

    } catch (err) {
        console.log('err: ' + JSON.stringify(err));
        return {
            success: false,
            message: 'User not found locally'
        };
    }
});

// saving user
ipcMain.handle('save-user', async (_, user) => {
    try {
        const existing = await db.get(user.username).catch(() => null);

        if (existing) {
            return {
                success: true,
                message: 'User already exists'
            };
        }

        await db.put({
            _id: user.username,
            ...user
        });

        return { success: true };

    } catch (err) {
        return {
            success: false,
            message: err.message
        };
    }
});

ipcMain.handle('get-user', async (_, username) => {
    try {
        const user = await db.get(username);
        return {
            success: true,
            user
        };
    } catch (err) {
        return {
            success: false,
            message: err.message
        };
    }
});

ipcMain.handle('get-dashboard', async (_, token) => {
    try {
        const response = await axios.get(
            process.env.API_URL + '/dashboard',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
});