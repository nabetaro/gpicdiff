'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

const parseArgs = require('electron-args')
const cli = parseArgs(`
    gpicdiff

    Graphical diff for pics

    Usage
      $ gpicdiff [options] path1 path2

    Options
      --label-path1=label  caption for path1
      --label-path2=label  caption for path2
      --help       show help
      --version    show version

    Examples
      $ gpicdiff pic1.jpg pic2.jpg
`, {
  alias: {
    h: 'help',
    v: 'version'
  },
  default: {
  }
})

const fs = require('fs')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)

const readFileData = async (path, handler) => {
  if (path === undefined) { return '' }
  const data = await readFileAsync(path)
  handler('data:;base64,' + data.toString('base64'))
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, webPreferences: {
    nodeIntegration: true
  } })

  let file1 = { filename: cli.input.slice(-2)[0] }
  let file2 = { filename: cli.input.slice(-2)[1] }
  readFileData(file1.filename, (data) => { file1.data = data })
  readFileData(file2.filename, (data) => { file2.data = data })
  file1.label = cli.flags.labelPath1 || file1.filename
  file2.label = cli.flags.labelPath2 || file2.filename
  let fileSet = {
    file1: file1,
    file2: file2
  }

  console.log(fileSet)

  
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.webContents.on('did-finish-load', function () {
    win.webContents.send('clear')
    win.webContents.send('fileSet', fileSet)
  })

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }

  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
