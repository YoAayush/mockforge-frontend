export interface Field {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "email" | "date" | "array" | "object";
  required: boolean;
}

export interface Schema {
  id: string;
  name: string;
  fields: Field[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  schemas: Schema[];
}
