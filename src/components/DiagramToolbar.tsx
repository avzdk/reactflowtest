import React, { useState } from 'react';
import { DiagramState, SavedDiagram } from '../types/uml';
import { saveDiagram, loadSavedDiagrams, exportDiagramToJson } from '../services/UmlService';
import { saveAs } from 'file-saver';
import './DiagramToolbar.css';

interface DiagramToolbarProps {
  onNewDiagram: () => void;
  onSaveDiagram: (name: string) => void;
  onLoadDiagram: (diagram: SavedDiagram) => void;
  onReloadModel: () => void;
  modelLoaded: boolean;
}

const DiagramToolbar: React.FC<DiagramToolbarProps> = ({ 
  onNewDiagram, 
  onSaveDiagram, 
  onLoadDiagram,
  onReloadModel,
  modelLoaded
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [diagramName, setDiagramName] = useState('');
  const [savedDiagrams, setSavedDiagrams] = useState<SavedDiagram[]>([]);

  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = () => {
    if (diagramName.trim()) {
      onSaveDiagram(diagramName);
      setShowSaveDialog(false);
      setDiagramName('');
    }
  };

  const handleLoadClick = () => {
    // Load saved diagrams from storage
    const diagrams = loadSavedDiagrams();
    setSavedDiagrams(diagrams);
    setShowLoadDialog(true);
  };

  const handleLoadDiagram = (diagram: SavedDiagram) => {
    onLoadDiagram(diagram);
    setShowLoadDialog(false);
  };

  const handleExportDiagram = (diagram: SavedDiagram) => {
    const jsonStr = exportDiagramToJson(diagram);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    saveAs(blob, `${diagram.name}.json`);
  };

  return (
    <div className="diagram-toolbar">
      <button 
        className="toolbar-button"
        onClick={onNewDiagram}
      >
        New Diagram
      </button>
      <button 
        className="toolbar-button"
        onClick={handleSaveClick}
        disabled={!modelLoaded}
      >
        Save Diagram
      </button>
      <button 
        className="toolbar-button"
        onClick={handleLoadClick}
      >
        Load Diagram
      </button>
      <button 
        className="toolbar-button"
        onClick={onReloadModel}
        disabled={!modelLoaded}
      >
        Reload Model
      </button>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Save Diagram</h3>
            <input
              type="text"
              placeholder="Diagram name"
              value={diagramName}
              onChange={(e) => setDiagramName(e.target.value)}
              className="dialog-input"
            />
            <div className="dialog-buttons">
              <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
              <button onClick={handleSaveConfirm} disabled={!diagramName.trim()}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Load Diagram</h3>
            <div className="diagrams-list">
              {savedDiagrams.length > 0 ? (
                savedDiagrams.map((diagram) => (
                  <div key={diagram.id} className="saved-diagram-item">
                    <span>{diagram.name}</span>
                    <div className="diagram-actions">
                      <button onClick={() => handleLoadDiagram(diagram)}>Load</button>
                      <button onClick={() => handleExportDiagram(diagram)}>Export</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-diagrams">No saved diagrams found</div>
              )}
            </div>
            <div className="dialog-buttons">
              <button onClick={() => setShowLoadDialog(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagramToolbar;
