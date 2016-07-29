import menuBar from 'menubar'
import Path from 'path'

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')({showDevTools: true}) // eslint-disable-line global-require
}

menuBar({
  index: `file://${__dirname}/app/app.html`,
  icon: Path.join(__dirname, 'app/IconTemplate.png'),
  preloadWindow: true,
  width: 800,
  height: 600
})
