const menuBar = require('menubar')
const Path = require('path')
const electronDebug = require('electron-debug')
const electronContextMenu = require('electron-context-menu')
const sourceMapSupport = require('source-map-support')

sourceMapSupport.install()
electronContextMenu()
electronDebug({ showDevTools: process.env.NODE_ENV === 'development' })

menuBar({
  index: `file://${__dirname}/main.html`,
  icon: Path.join(__dirname, 'IconTemplate.png'),
  preloadWindow: true,
  alwaysOnTop: process.env.NODE_ENV === 'development',
  width: 1024,
  height: 768
})
