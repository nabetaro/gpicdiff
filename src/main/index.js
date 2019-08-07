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
  file1.label = cli.flags.labelPath1 || file1.filename
  file2.label = cli.flags.labelPath2 || file2.filename
  let fileSet = {
    file1: file1,
    file2: file2
  }

  mainWindow.loadURL(winURL)
  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.webContents.send('clear')
    mainWindow.webContents.send('fileSet', fileSet)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

const appLock = app.requestSingleInstanceLock()

if (!appLock) {

} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
  app.on('ready', createWindow)
}

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
