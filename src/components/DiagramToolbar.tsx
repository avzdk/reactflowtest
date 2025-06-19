import React, { useState } from 'react';
import { DiagramState, SavedDiagram, UmlData } from '../types/uml';
import { saveDiagram, loadSavedDiagrams, exportDiagramToJson } from '../services/UmlService';
import { saveAs } from 'file-saver';
import FileUploader from './FileUploader';
import './DiagramToolbar.css';

interface DiagramToolbarProps {
  onNewDiagram: () => void;
  onSaveDiagram: (name: string, saveAsNew?: boolean) => void;
  onLoadDiagram: (diagram: SavedDiagram) => void;
  onReloadModel: () => void;
  onReimportData?: (data: UmlData) => void;
  modelLoaded: boolean;
  currentDiagram: SavedDiagram | null;
}

const DiagramToolbar: React.FC<DiagramToolbarProps> = ({ 
  onNewDiagram, 
  onSaveDiagram, 
  onLoadDiagram,
  onReloadModel,
  onReimportData,
  modelLoaded,
  currentDiagram
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showReimportDialog, setShowReimportDialog] = useState(false);
  const [diagramName, setDiagramName] = useState('');
  const [savedDiagrams, setSavedDiagrams] = useState<SavedDiagram[]>([]);

  const handleSaveClick = () => {
    if (currentDiagram) {
      // If we have a current diagram, use its name and update it
      onSaveDiagram(currentDiagram.name, false);
    } else {
      // Otherwise show the save dialog
      setShowSaveDialog(true);
    }
  };

  const handleSaveAsClick = () => {
    setShowSaveAsDialog(true);
    if (currentDiagram) {
      setDiagramName(currentDiagram.name + ' (Copy)');
    }
  };

  const handleSaveConfirm = (saveAsNew: boolean = false) => {
    if (diagramName.trim()) {
      onSaveDiagram(diagramName, saveAsNew);
      setShowSaveDialog(false);
      setShowSaveAsDialog(false);
      setDiagramName('');
    }
  };

  const handleLoadClick = () => {
    // Load saved diagrams from storage
    const diagrams = loadSavedDiagrams();
    setSavedDiagrams(diagrams);
    setShowLoadDialog(true);
  };

  const handleReimportClick = () => {
    setShowReimportDialog(true);
  };

  const handleDataReimported = (data: UmlData) => {
    if (onReimportData) {
      onReimportData(data);
      setShowReimportDialog(false);
    }
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
        Save
      </button>
      <button 
        className="toolbar-button"
        onClick={handleSaveAsClick}
        disabled={!modelLoaded}
      >
        Save As
      </button>
      <button 
        className="toolbar-button"
        onClick={handleLoadClick}
      >
        Load
      </button>
      <button 
        className="toolbar-button"
        onClick={handleReimportClick}
        disabled={!modelLoaded}
      >
        Reimport JSON
      </button>      <button 
        className="toolbar-button"
        onClick={onReloadModel}
        disabled={!modelLoaded}
      >
        Reload Model
      </button>
      
      {currentDiagram && (
        <div className="current-diagram-info">
          Current diagram: <span className="current-diagram-name">{currentDiagram.name}</span>
        </div>
      )}

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
              <button onClick={() => handleSaveConfirm(false)} disabled={!diagramName.trim()}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Save As Dialog */}
      {showSaveAsDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Save Diagram As</h3>
            <input
              type="text"
              placeholder="Diagram name"
              value={diagramName}
              onChange={(e) => setDiagramName(e.target.value)}
              className="dialog-input"
            />
            <div className="dialog-buttons">
              <button onClick={() => setShowSaveAsDialog(false)}>Cancel</button>
              <button onClick={() => handleSaveConfirm(true)} disabled={!diagramName.trim()}>Save As</button>
            </div>
          </div>
        </div>
      )}

      {/* Reimport JSON Dialog */}
      {showReimportDialog && (
        <div className="dialog-overlay">
          <div className="dialog reimport-dialog">
            <h3>Reimport JSON Data</h3>
            <p>Upload a new JSON file to update the data model. The current diagram layout will be preserved.</p>
            <FileUploader onDataLoaded={handleDataReimported} isReimport={true} />
            <div className="dialog-buttons">
              <button onClick={() => setShowReimportDialog(false)}>Cancel</button>
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
