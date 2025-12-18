
import React, { useState, useCallback } from 'react';
import Scene from './components/Scene';
import UI from './components/UI';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.CHAOS);

  const toggleState = useCallback(() => {
    setTreeState(prev => (prev === TreeState.CHAOS ? TreeState.FORMED : TreeState.CHAOS));
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#010a01] select-none">
      <Scene state={treeState} />
      <UI state={treeState} onToggle={toggleState} />
    </div>
  );
};

export default App;
