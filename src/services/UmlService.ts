import { UmlData, DiagramState, SavedDiagram } from '../types/uml';

// Service for loading UML data from JSON file
export const loadJsonFile = (file: File): Promise<UmlData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const jsonData = JSON.parse(event.target.result as string) as UmlData;
          // Validate the structure
          if (!jsonData.umlModel || !jsonData.umlModel.classes || !jsonData.umlModel.relations) {
            reject(new Error('Invalid JSON format. Missing required fields.'));
            return;
          }
          resolve(jsonData);
        } else {
          reject(new Error('Failed to read file.'));
        }
      } catch (error) {
        reject(new Error('Invalid JSON format.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
    
    reader.readAsText(file);
  });
};

// Service for saving diagram state to local storage
export const saveDiagram = (name: string, state: DiagramState, modelTimestamp: number): void => {
  try {
    // Get existing diagrams
    const diagramsJson = localStorage.getItem('umlDiagrams');
    let diagrams: SavedDiagram[] = diagramsJson ? JSON.parse(diagramsJson) : [];
    
    // Generate a unique ID
    const id = `diagram_${Date.now()}`;
    
    // Add new diagram
    diagrams.push({
      id,
      name,
      state,
      modelTimestamp
    });
    
    // Save to local storage
    localStorage.setItem('umlDiagrams', JSON.stringify(diagrams));
  } catch (error) {
    console.error('Failed to save diagram:', error);
    throw new Error('Failed to save diagram.');
  }
};

// Service for loading saved diagrams from local storage
export const loadSavedDiagrams = (): SavedDiagram[] => {
  try {
    const diagramsJson = localStorage.getItem('umlDiagrams');
    return diagramsJson ? JSON.parse(diagramsJson) : [];
  } catch (error) {
    console.error('Failed to load saved diagrams:', error);
    return [];
  }
};

// Service for exporting diagram to JSON file
export const exportDiagramToJson = (diagram: SavedDiagram): string => {
  return JSON.stringify(diagram, null, 2);
};

// Service for importing diagram from JSON
export const importDiagramFromJson = (json: string): SavedDiagram => {
  try {
    const diagram = JSON.parse(json) as SavedDiagram;
    if (!diagram.id || !diagram.name || !diagram.state) {
      throw new Error('Invalid diagram format.');
    }
    return diagram;
  } catch (error) {
    console.error('Failed to import diagram:', error);
    throw new Error('Failed to import diagram.');
  }
};
