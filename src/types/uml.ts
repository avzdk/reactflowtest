export interface UmlAttribute {
  id: string;
  name: string;
  multiplicity: string;
  datatype: string;
  format: string | null;
  example: string;
}

export interface UmlClass {
  id: string;
  name: string;
  owner: string;
  attributes: UmlAttribute[];
}

export interface UmlRelation {
  id: string;
  name: string;
  type: string;
  source: string;
  target: string;
  sourceMultiplicity: string;
  targetMultiplicity: string;
}

export interface UmlModel {
  classes: UmlClass[];
  relations: UmlRelation[];
}

export interface UmlData {
  umlModel: UmlModel;
}

// React Flow specific types
export interface ClassNodeData {
  label: string;
  classData: UmlClass;
}

export interface DiagramState {
  nodes: any[];
  edges: any[];
}

export interface SavedDiagram {
  id: string;
  name: string;
  state: DiagramState;
  modelTimestamp: number;
}
