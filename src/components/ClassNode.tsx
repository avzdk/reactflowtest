import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ClassNodeData } from '../types/uml';
import './ClassNode.css';

const ClassNode: React.FC<NodeProps<ClassNodeData>> = ({ data }) => {
  const { classData } = data;
  
  return (
    <div className="class-node">
      <Handle type="target" position={Position.Top} />
      
      <div className="class-header">
        <strong>{classData.name}</strong>
      </div>
      
      <div className="class-attributes">
        {classData.attributes.map((attr) => (
          <div key={attr.id} className="attribute">
            <span className="attribute-name">{attr.name}</span>
            <span className="attribute-type">: {attr.datatype}</span>
            {attr.multiplicity !== '1' && (
              <span className="attribute-multiplicity">[{attr.multiplicity}]</span>
            )}
          </div>
        ))}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(ClassNode);
