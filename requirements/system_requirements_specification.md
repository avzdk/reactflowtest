# System Requirements Specification

## 1. Introduction

### 1.1 Purpose
This document describes the system requirements for a UML diagram management tool that allows users to create, modify, and maintain UML diagrams based on class models exported from another system in JSON format.

### 1.2 Scope
The system will allow users to import JSON data containing UML class definitions and their relationships, visualize these classes in UML diagrams, manipulate the diagrams visually, and save/load diagram layouts while keeping the underlying data model updated.

### 1.3 Definitions and Acronyms
- **UML**: Unified Modeling Language
- **JSON**: JavaScript Object Notation
- **React Flow**: A library for building node-based interactive diagrams

## 2. Functional Requirements

### 2.1 Data Import and Management
- **REQ-IMP-1**: The system shall allow users to import JSON files containing UML class definitions and relationships.
- **REQ-IMP-2**: The system shall parse and validate the imported JSON structure according to the expected format.
- **REQ-IMP-3**: The system shall allow re-importing updated JSON files to refresh the data model while preserving diagram layouts.

### 2.2 Diagram Creation
- **REQ-DIA-1**: The system shall allow users to create new, empty diagrams.
- **REQ-DIA-2**: The system shall provide a mechanism to select specific UML classes from the imported data to add to the diagram.
- **REQ-DIA-3**: The system shall automatically display class attributes when a class is added to the diagram.
- **REQ-DIA-4**: The system shall automatically visualize relationships between classes present in the diagram.

### 2.3 Diagram Manipulation
- **REQ-MAN-1**: The system shall allow users to move class elements around the diagram canvas.
- **REQ-MAN-2**: The system shall maintain relationship connections between classes when they are moved.
- **REQ-MAN-3**: The system shall allow users to reorganize the diagram layout without affecting the underlying data model.

### 2.4 Persistence
- **REQ-PER-1**: The system shall save diagram layouts, including the position of all elements.
- **REQ-PER-2**: The system shall load previously saved diagrams with their exact layouts.
- **REQ-PER-3**: The system shall detect and apply changes in the underlying data model when a diagram is loaded and the JSON data has been updated.

## 3. Non-Functional Requirements

### 3.1 Usability
- **REQ-USA-1**: The system shall provide a simple, intuitive user interface for diagram manipulation.
- **REQ-USA-2**: The system shall provide visual feedback during diagram element interaction.
- **REQ-USA-3**: The system shall display UML classes and relationships in standard UML notation.


## 4. Technical Requirements

### 4.1 Frontend
- **REQ-TECH-1**: The frontend shall be developed using React.
- **REQ-TECH-2**: The diagram visualization shall use React Flow library.
- **REQ-TECH-3**: The UI shall be responsive and work on various screen sizes.

### 4.2 Backend (Optional)
- **REQ-TECH-4**: If required, the backend shall be developed using Python.
- **REQ-TECH-5**: The system shall use JSON files for data persistence.

### 4.3 Data Model
- **REQ-DATA-1**: The system shall support the JSON data structure as shown in the example file.
- **REQ-DATA-2**: The system shall handle UML class attributes with their properties (name, multiplicity, datatype, format, example).
- **REQ-DATA-3**: The system shall support various relationship types (association, specialization, etc.) between classes.

## 5. Constraints and Assumptions

### 5.1 Constraints
- The system will only support the specified JSON data format.
- The primary persistence mechanism will be JSON files.

### 5.2 Assumptions
- Users have basic understanding of UML diagrams.
- The input JSON files will conform to the expected structure.
- The application will primarily be used on desktop devices.

## 6. System Architecture

### 6.1 High-Level Architecture
The system will follow a client-centric architecture with optional backend support:
- **Frontend**: React application with React Flow for diagram visualization
- **Data Storage**: JSON files for both data model and diagram layouts
- **Optional Backend**: Python service for advanced data processing if needed

### 6.2 Component Diagram
```
┌───────────────────────────┐
│      React Frontend       │
├───────────────────────────┤
│ ┌─────────────────────┐   │
│ │     React Flow      │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │   JSON Processor    │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │   Layout Manager    │   │
│ └─────────────────────┘   │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│     JSON Storage Files    │
├───────────────────────────┤
│ - Data Model JSON         │
│ - Diagram Layout JSON     │
└───────────────────────────┘
```

## 7. Implementation Plan

### 7.1 Phase 1: Core Functionality
- JSON import and parsing
- Basic diagram creation and class visualization
- Diagram manipulation (moving elements)

### 7.2 Phase 2: Enhanced Features
- Relationship visualization
- Diagram persistence (save/load)
- Data model updates

### 7.3 Phase 3: Refinement (Optional)
- Backend integration if needed
- Advanced UML features
- Performance optimizations
