import React, { useState } from 'react';
import { UmlClass } from '../types/uml';
import './ClassSelector.css';

interface ClassSelectorProps {
  classes: UmlClass[];
  onAddClass: (classItem: UmlClass) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ classes, onAddClass }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter classes based on search term
  const filteredClasses = classes.filter(classItem => 
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="class-selector">
      <h3>Available Classes</h3>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="class-list">
        {filteredClasses.map(classItem => (
          <div key={classItem.id} className="class-item">
            <span>{classItem.name}</span>
            <button 
              onClick={() => onAddClass(classItem)}
              className="add-button"
            >
              Add
            </button>
          </div>
        ))}
        {filteredClasses.length === 0 && (
          <div className="no-classes">No matching classes found</div>
        )}
      </div>
    </div>
  );
};

export default ClassSelector;
