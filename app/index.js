import React from 'react';
import {render} from 'react-dom';
import App from './App'
import Watcher from './Watcher'
import Settings from './Settings'
import Trader from './Trader'

const watcher = new Watcher()
const settings = new Settings()
const trader = new Trader(watcher, settings)

render(<App watcher={watcher} settings={settings} trader={trader} />, document.getElementById('root'));
