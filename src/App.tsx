import React, { ReactElement } from 'react';
import './App.css';
import { RedDialog } from './RedDialog';
import { BlueDialog } from './BlueDialog';
import { Spawner } from './Spawner';
import { window, WindowManager } from './WindowManager';

function App() {
  const windows = new Map<string, window>([
    [
      'red',
      {
        body: (instanceKey: string) => <RedDialog instanceKey={instanceKey}/>,
        header: (instanceKey: string) => <span>The red dialog: {instanceKey}</span>,
      },
    ],
    [
      'blue',
      {
        body:  (instanceKey: string) => <BlueDialog instanceKey={instanceKey}/>,
        header: (instanceKey: string) => <span>Some title: {instanceKey}</span>,
      },
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
