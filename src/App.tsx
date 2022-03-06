import React from 'react';
import { Spawner } from './Spawner';
import { WindowManager } from './WindowManager/WindowManager';

import './App.css';

function App() {
  return (
    <div className="App">
      <WindowManager>
        <Spawner></Spawner> 
        <span style={{ fontSize: '32px' }}>Lorem ipsum and so on, and so forth...</span>
      </WindowManager>
    </div>
  );
}

export default App;
