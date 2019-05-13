'use strict'

import { app, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const parseArgs = require('electron-args')
const cli = parseArgs(`
    gpicdiff

    Graphical diff for pics

    Usage
      $ gpicdiff [options] path1 path2

    Options
      --old-label=oldlabel  caption for old file
      --new-label=newlabel  caption for new file
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
  const data = await readFileAsync(path)
  handler('data:;base64,' + data.toString('base64'))
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  })

  let file1 = { filename: cli.input.slice(-2)[0] }
  let file2 = { filename: cli.input.slice(-2)[1] }
  readFileData(file1.filename, (data) => { file1.data = data })
  readFileData(file2.filename, (data) => { file2.data = data })
  file1.label = file1.filename
  file2.label = file2.filename

  mainWindow.loadURL(winURL)
  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.webContents.send('file1', file1)
    mainWindow.webContents.send('file2', file2)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
