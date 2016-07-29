import menuBar from 'menubar'
import Path from 'path'
import electronDebug from 'electron-debug'
import electronContextMenu from 'electron-context-menu'

electronContextMenu()
electronDebug({showDevTools: process.env.NODE_ENV === 'development'})

menuBar({
  index: `file://${__dirname}/app/app.html`,
  icon: Path.join(__dirname, 'app/IconTemplate.png'),
  preloadWindow: true,
  alwaysOnTop: process.env.NODE_ENV === 'development',
  width: 1024,
  height: 768
})
