# UML Diagram Editor

A React-based UML class diagram editor that allows you to create, edit, and maintain UML diagrams based on imported JSON data.

## Features

- Import UML class definitions from JSON files
- Create empty diagrams
- Select and add UML classes to diagrams
- Visualize class attributes
- Display relationships between classes
- Move elements around while maintaining relationships
- Save and load diagram layouts
- Reload updated UML model data while preserving layouts

## Technologies Used

- React
- TypeScript
- React Flow (for diagram visualization)
- File-Saver (for exporting diagrams)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Usage

1. Launch the application
2. Upload a JSON file containing UML class definitions
3. Use the class selector to add classes to your diagram
4. Arrange the classes by dragging them around
5. Save your diagram for later use
6. Export the diagram layout to share with others

## JSON Format

The application expects the following JSON structure:

```json
{
  "umlModel": {
    "classes": [
      {
        "id": "unique-id",
        "name": "ClassName",
        "owner": "Owner",
        "attributes": [
          {
            "id": "attr-id",
            "name": "attributeName",
            "multiplicity": "1",
            "datatype": "String",
            "format": "regex-pattern",
            "example": "Example"
          }
        ]
      }
    ],
    "relations": [
      {
        "id": "relation-id",
        "name": "relationName",
        "type": "association",
        "source": "source-class-id",
        "target": "target-class-id",
        "sourceMultiplicity": "0..*",
        "targetMultiplicity": "1"
      }
    ]
  }
}
```
