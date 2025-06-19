import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import UmlEditor from './components/UmlEditor';
import './App.css';

function App() {
  return (
    <div className="App">
      <ReactFlowProvider>
        <UmlEditor />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
