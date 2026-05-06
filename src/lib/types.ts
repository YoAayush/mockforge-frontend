export interface Field {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "email" | "date" | "array" | "object";
  required: boolean;
}

// export interface Schema {
//   id: string;
//   name: string;
//   fields: Field[];
//   createdAt: string;
// }

// export interface Project {
//   id: string;
//   name: string;
//   description: string;
//   isPublic: boolean;
//   createdAt: string;
//   schemas: Schema[];
// }

// ENUMS

export type SchemaVisibility = "PRIVATE" | "PUBLIC";

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "uuid"
  | "email"
  | "date"
  | "enum"
  | "phone";

// =========================
// CORE MODELS
// =========================

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;

  userId: string;

  schemaLimit: number;

  createdAt: string;

  // relations
  schemas: Schema[];
}

// =========================
// SCHEMA
// =========================

export interface Schema {
  id: string;
  name: string;
  version: number;
  visibility: SchemaVisibility;

  seed: number;
  defaultCount: number;
  recordLimit: number;

  projectId: string;

  createdAt: string;
  updatedAt: string;

  // relations
  fields: SchemaField[];
  records: RecordType[];

  _count: {
    records: number;
  };
}

// =========================
// SCHEMA FIELD
// =========================

export interface SchemaField {
  id: string;

  name: string;
  type: FieldType;

  faker: string | null; // e.g. "internet.email"
  format: string | null; // e.g. "+91##########"

  schemaId: string;

  createdAt: string | Date;
}

// =========================
// RECORD
// =========================

export interface RecordType {
  id: string;

  data: Record<string, any>; // JSON from Prisma

  schemaId: string;

  createdAt: string;
  updatedAt: string;
}
