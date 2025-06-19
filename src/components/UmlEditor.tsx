import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';

import { UmlData, UmlClass, UmlRelation, SavedDiagram } from '../types/uml';
import { saveDiagram } from '../services/UmlService';
import ClassNode from './ClassNode';
import ClassSelector from './ClassSelector';
import DiagramToolbar from './DiagramToolbar';
import FileUploader from './FileUploader';
import './UmlEditor.css';

// Define node types
const nodeTypes = {
  classNode: ClassNode
};

const UmlEditor: React.FC = () => {
  // State for the React Flow diagram
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // State for UML model data
  const [umlData, setUmlData] = useState<UmlData | null>(null);
  const [modelTimestamp, setModelTimestamp] = useState<number>(0);
  
  // Reference to track which classes have been added to the diagram
  const addedClassesRef = useRef<Set<string>>(new Set());
  
  // Load UML data from JSON file
  const handleDataLoaded = (data: UmlData) => {
    setUmlData(data);
    setModelTimestamp(Date.now());
    // Reset diagram when new data is loaded
    setNodes([]);
    setEdges([]);
    addedClassesRef.current = new Set();
  };

  // Create a node for a UML class
  const createClassNode = (classItem: UmlClass, position = { x: 100, y: 100 }) => {
    return {
      id: classItem.id,
      type: 'classNode',
      data: {
        label: classItem.name,
        classData: classItem
      },
      position
    };
  };

  // Create edges for relationships between classes
  const createRelationEdges = (relations: UmlRelation[], addedClassIds: Set<string>) => {
    return relations
      .filter(relation => 
        addedClassIds.has(relation.source) && 
        addedClassIds.has(relation.target)
      )
      .map(relation => {
        // Style based on relation type
        let edgeType: any = {
          type: 'default',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          }
        };
        
        // For inheritance/specialization
        if (relation.type === 'specialization') {
          edgeType = {
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#ffffff',
            },
            style: {
              strokeWidth: 2,
            }
          };
        }
        
        return {
          id: relation.id,
          source: relation.source,
          target: relation.target,
          label: relation.name,
          labelStyle: { fill: '#666', fontWeight: 500 },
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
          labelBgStyle: { fill: 'white', color: '#666', fillOpacity: 0.8 },
          animated: false,
          ...edgeType
        };
      });
  };

  // Add a class to the diagram
  const handleAddClass = (classItem: UmlClass) => {
    if (!umlData || addedClassesRef.current.has(classItem.id)) return;
    
    // Add to tracking set
    addedClassesRef.current.add(classItem.id);
    
    // Calculate position (simple grid layout for demonstration)
    const nodeCount = nodes.length;
    const position = {
      x: 100 + (nodeCount % 3) * 300,
      y: 100 + Math.floor(nodeCount / 3) * 250
    };
    
    // Create and add the node
    const newNode = createClassNode(classItem, position);
    setNodes(prevNodes => [...prevNodes, newNode]);
    
    // Update edges for relationships
    if (umlData.umlModel.relations) {
      const newEdges = createRelationEdges(
        umlData.umlModel.relations,
        addedClassesRef.current
      );
      
      // Only add new edges
      const existingEdgeIds = new Set(edges.map(edge => edge.id));
      const edgesToAdd = newEdges.filter(edge => !existingEdgeIds.has(edge.id));
      
      if (edgesToAdd.length > 0) {
        setEdges(prevEdges => [...prevEdges, ...edgesToAdd]);
      }
    }
  };

  // Handle edge connections
  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge({
      ...connection,
      type: ConnectionLineType.SmoothStep,
      animated: false
    }, eds));
  }, [setEdges]);

  // New diagram handler
  const handleNewDiagram = () => {
    setNodes([]);
    setEdges([]);
    addedClassesRef.current = new Set();
  };

  // Save diagram handler
  const handleSaveDiagram = (name: string) => {
    saveDiagram(
      name,
      { nodes, edges },
      modelTimestamp
    );
  };

  // Load diagram handler
  const handleLoadDiagram = (diagram: SavedDiagram) => {
    if (!umlData) return;
    
    // Reset added classes tracking
    addedClassesRef.current = new Set();
    
    // Restore nodes and edges
    setNodes(diagram.state.nodes);
    setEdges(diagram.state.edges);
    
    // Update tracking set based on loaded nodes
    diagram.state.nodes.forEach(node => {
      addedClassesRef.current.add(node.id);
    });
  };

  // Reload model handler (keeps layout but updates data)
  const handleReloadModel = () => {
    if (!umlData) return;
    
    // Keep track of existing node positions
    const nodePositions = nodes.reduce((acc, node) => {
      acc[node.id] = node.position;
      return acc;
    }, {} as Record<string, { x: number, y: number }>);
    
    // Recreate nodes with updated class data but keep positions
    const updatedNodes = Array.from(addedClassesRef.current).map(classId => {
      const classItem = umlData.umlModel.classes.find(c => c.id === classId);
      if (!classItem) return null;
      
      return createClassNode(
        classItem,
        nodePositions[classId] || { x: 100, y: 100 }
      );
    }).filter(Boolean) as Node[];
    
    // Update edges
    const updatedEdges = createRelationEdges(
      umlData.umlModel.relations,
      addedClassesRef.current
    );
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setModelTimestamp(Date.now());
  };

  return (
    <div className="uml-editor">
      <DiagramToolbar
        onNewDiagram={handleNewDiagram}
        onSaveDiagram={handleSaveDiagram}
        onLoadDiagram={handleLoadDiagram}
        onReloadModel={handleReloadModel}
        modelLoaded={!!umlData}
      />
      
      <div className="editor-content">
        {!umlData ? (
          <div className="upload-container">
            <h2>UML Diagram Editor</h2>
            <p>Please upload a JSON file with UML class definitions to get started.</p>
            <FileUploader onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="diagram-container">
            <div className="class-selector-container">
              <ClassSelector 
                classes={umlData.umlModel.classes} 
                onAddClass={handleAddClass} 
              />
            </div>
            
            <div className="react-flow-container">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
              >
                <Controls />
                <Background color="#aaa" gap={16} />
              </ReactFlow>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UmlEditor;
