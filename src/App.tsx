import React, { ReactElement } from 'react';
import './App.css';
import { RedDialog } from './RedDialog';
import { BlueDialog } from './BlueDialog';
import { Spawner } from './Spawner';
import { WindowManager } from './WindowManager';

function App() {
  const windows = new Map<string, (key: string) => ReactElement>([
    [
      'red',
      (instanceKey: string) => <RedDialog instanceKey={instanceKey}/>
    ],
    [
      'blue',
      (instanceKey: string) => <BlueDialog instanceKey={instanceKey}/>
    ],
  ]);

  return (
    <div className="App">
      <WindowManager windows={windows}>
        <Spawner></Spawner> 
        <span style={{ fontSize: '32px' }}>Lorem ipsum and so on, and so forth...</span>
      </WindowManager>
    </div>
  );
}

export default App;
