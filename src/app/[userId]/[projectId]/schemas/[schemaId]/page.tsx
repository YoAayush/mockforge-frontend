"use client";

import { useContext, useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { SchemaField } from "@/lib/types";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { UserContext } from "@/lib/userProvider";
import Loader from "@/components/Loader";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useProject } from "@/lib/projectProvider";

export default function EditSchemaPage() {
  const [activeTab, setActiveTab] = useState<"form" | "json">("form");
  const [schema, setSchema] = useState({
    name: "Enter schema name",
    visibility: "",
    defaultCount: 0,
  });
  const [fields, setFields] = useState<SchemaField[]>([]);
  const { userId, projectId } = useParams() as {
    userId: string;
    projectId: string;
  };
  const { schemaId } = useParams() as { schemaId: string };
  const { session } = useContext(UserContext);
  const router = useRouter();
  const { refetchSchemas } = useProject();

  // fetch existing schema data and populate state here (omitted for brevity)
  useEffect(() => {
    if (!schemaId || !session?.access_token) return;

    const fetchSchema = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/schemas/${schemaId}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        );

        // console.log("Fetched schema data:", response.data);

        setSchema({
          name: response.data.name,
          visibility: response.data.visibility,
          defaultCount: response.data.defaultCount,
        });

        setFields(response.data.fields);
      } catch (err) {
        console.error("Error fetching schema:", err);
      }
    };

    fetchSchema();
  }, [schemaId, session]);

  // console.log(fields)

  function generateJSON() {
    return JSON.stringify(
      {
        name: schema.name,
        visibility: schema.visibility,
        defaultCount: schema.defaultCount,
        fields: fields.map((field) => ({
          name: field.name,
          type: field.type,
          faker: field.faker === "None" ? null : field.faker,
          format: field.format || null,
        })),
      },
      null,
      2,
    );
  }

  const [jsonContent, setJsonContent] = useState(generateJSON());
  // console.log("Current JSON content:", jsonContent);

  const handleAddField = () => {
    const newField: SchemaField = {
      id: Date.now().toString(),
      name: "new_field",
      type: "string",
      faker: "None",
      format: null,
      schemaId: schemaId,
      createdAt: new Date().toISOString(),
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    // Auto-update JSON
    const updatedJson = JSON.stringify(
      {
        name: schema.name,
        visibility: schema.visibility,
        fields: fields.map((field) => ({
          name: field.name,
          type: field.type,
          faker: field.faker === "None" ? null : field.faker,
          format: field.format || null,
        })),
      },
      null,
      2,
    );
    setJsonContent(updatedJson);
  };

  const handleDeleteField = (id: string) => {
    const updatedFields = fields.filter((f) => f.id !== id);
    setFields(updatedFields);
    // Auto-update JSON
    const updatedJson = JSON.stringify(
      {
        name: schema.name,
        visibility: schema.visibility,
        fields: fields.map((field) => ({
          name: field.name,
          type: field.type,
          faker: field.faker === "None" ? null : field.faker,
          format: field.format || null,
        })),
      },
      null,
      2,
    );
    setJsonContent(updatedJson);
  };

  const handleFieldChange = (id: string, key: string, value: string) => {
    const updatedFields = fields.map((f) =>
      f.id === id ? { ...f, [key]: value } : f,
    );
    setFields(updatedFields);
    // Auto-update JSON when in form mode
    if (activeTab === "form") {
      const updatedJson = JSON.stringify(
        {
          name: schema.name,
          visibility: schema.visibility,
          fields: fields.map((field) => ({
            name: field.name,
            type: field.type,
            faker: field.faker === "None" ? null : field.faker,
            format: field.format || null,
          })),
        },
        null,
        2,
      );
      setJsonContent(updatedJson);
    }
  };

  const handleSyncToJSON = () => {
    setJsonContent(generateJSON());
    setActiveTab("json");
  };

  const handleSyncFromJSON = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setSchema({
        name: parsed.name,
        visibility: parsed.visibility,
        defaultCount: parsed.defaultCount,
      });
      const newFields: SchemaField[] = parsed.fields.map(
        (field: any) => ({
          id: Date.now().toString() + Math.random(),
          name: field.name,
          type: field.type || "string",
          faker: field.faker || "None",
          format: field.format || null,
          schemaId: schemaId,
          createdAt: new Date().toISOString(),
        }),
      );
      setFields(newFields);
      setActiveTab("form");
    } catch (error) {
      alert("Invalid JSON format");
    }
  };

  const handleCancel = () => {
    if (
      confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost.",
      )
    ) {
      router.push(`/${userId}/${projectId}/schemas`);
    }
  };

  const handleUpdateSchema = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/schemas/${schemaId}`,
        {
          name: schema.name,
          visibility: schema.visibility,
          defaultCount: schema.defaultCount,
          // default_count: 10, // You can make this dynamic if needed
          fields: fields.map((field) => ({
            name: field.name,
            type: field.type,
            faker: field.faker === "None" ? null : field.faker,
            format: field.format || null,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      );

      console.log("Update response:", response.data);
      alert("Schema updated successfully!");
      await refetchSchemas();
      router.push(`/${userId}/${projectId}/schemas`);
    } catch (error) {
      console.error("Error updating schema:", error);
      alert("Failed to update schema. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-default px-8 py-6 flex items-center gap-4 bg-secondary">
        <Link
          href={`/${userId}/${projectId}/dashboard`}
          className="flex items-center gap-2 text-accent hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Edit Schema</h1>
      </div>

      <>
        {/* Main Content */}
        {!schema.name ||
          (fields.length === 0 && (
            <>
              {/* <p>Loading fields...</p> */}
              <Loader message="Loading data..." />
            </>
          ))}
        <main>
          {/* Tabs */}
          <div className="border-b border-slate-800 px-8 py-4 flex gap-4">
            <button
              onClick={() => setActiveTab("form")}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                activeTab === "form"
                  ? "bg-tertiary text-primary"
                  : "text-secondary hover:text-primary hover:bg-tertiary"
              }`}
            >
              Form Builder
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors ${
                activeTab === "json"
                  ? "bg-tertiary text-primary border border-default"
                  : "text-secondary hover:text-primary hover:bg-tertiary"
              }`}
            >
              <span className="text-xs">&lt;&gt;</span>
              JSON Editor
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === "form" ? (
              <div className="space-y-6">
                <div className="flex-col items-center space-y-6">
                  {/* Schema Name */}
                  <div className="bg-secondary border border-border rounded-lg p-6">
                    <label className="block text-sm font-medium text-secondary mb-3">
                      Schema Name
                    </label>
                    <input
                      type="text"
                      value={schema.name}
                      onChange={(e) => {
                        setSchema({ ...schema, name: e.target.value });
                        // Auto-update JSON when schema name changes
                        // const updatedJson = JSON.stringify(
                        //   {
                        //     name: e.target.value,
                        //     visibility: schema.visibility,
                        //     fields: fields.reduce(
                        //       (acc, field) => {
                        //         acc[field.name] = {
                        //           type: field.type,
                        //           faker_type:
                        //             field.faker === "None" ? null : field.faker,
                        //           // enum_values: null
                        //         };
                        //         return acc;
                        //       },
                        //       {} as Record<string, any>,
                        //     ),
                        //   },
                        //   null,
                        //   2,
                        // );
                        // setJsonContent(updatedJson);
                      }}
                      className="w-100 bg-primary border border-default rounded px-4 py-2 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                    />
                  </div>

                  {/* Schema Status */}
                  <div className="bg-secondary border border-border rounded-lg px-4 py-3 flex items-center gap-4">
                    <span className="px-2 flex items-center gap-4">
                      <Label className="text-sm text-secondary">
                        Schema Visibility:
                      </Label>

                      {/* selection of visibility options */}
                      <RadioGroup
                        key={schema.visibility} // force re-render when visibility changes
                        value={schema.visibility}
                        onValueChange={(value: "PUBLIC" | "PRIVATE") => {
                          console.log("Visibility changed to:", value);
                          setSchema((prev) => ({
                            ...prev,
                            visibility: value,
                          }));
                        }}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="PUBLIC" id="public" />
                          <Label
                            htmlFor="public"
                            className="text-xs text-green-500 font-medium"
                          >
                            PUBLIC
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="PRIVATE" id="private" />
                          <Label
                            htmlFor="private"
                            className="text-xs text-red-500 font-medium"
                          >
                            PRIVATE
                          </Label>
                        </div>
                      </RadioGroup>
                    </span>
                    <span className="ml-10 flex items-center gap-4 text-secondary text-sm">
                      <Label className="text-sm text-secondary">
                        Enter Record Generation Count:
                      </Label>
                      <input
                        type="text"
                        value={schema.defaultCount}
                        onChange={(e) => {
                          setSchema({
                            ...schema,
                            defaultCount: parseInt(e.target.value) || 0,
                          });
                        }}
                        className="w-100 bg-primary border border-default rounded px-4 py-2 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                      />
                      (max record limit is 20)
                    </span>
                  </div>
                </div>

                {/* Fields */}
                <div className="bg-secondary border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Fields</h2>
                    <button
                      onClick={handleAddField}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Field
                    </button>
                  </div>

                  <div className="space-y-4">
                    {fields?.map((field) => (
                      <div
                        key={field.id}
                        className="flex gap-4 items-end p-4 bg-tertiary rounded border border-border"
                      >
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Field Name
                          </label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) =>
                              handleFieldChange(
                                field.id,
                                "name",
                                e.target.value,
                              )
                            }
                            className="w-full bg-primary border border-default rounded px-4 py-2 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Type
                          </label>
                          <select
                            value={field.type}
                            onChange={(e) =>
                              handleFieldChange(
                                field.id,
                                "type",
                                e.target.value,
                              )
                            }
                            className="w-full bg-primary border border-default rounded px-4 py-2 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                          >
                            <option>string</option>
                            <option>email</option>
                            <option>number</option>
                            <option>boolean</option>
                            <option>date</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-400 mb-1">
                            Faker Generator (Optional)
                          </label>
                          <select
                            value={field.faker || "None"}
                            onChange={(e) =>
                              handleFieldChange(
                                field.id,
                                "faker",
                                e.target.value,
                              )
                            }
                            className="w-full bg-primary border border-default rounded px-4 py-2 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                          >
                            <option>None</option>
                            <option>Name</option>
                            <option>Email</option>
                            <option>Phone</option>
                            <option>Address</option>
                          </select>
                        </div>
                        <button
                          onClick={() => handleDeleteField(field.id)}
                          className="p-2 hover:bg-slate-700 rounded text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    className="px-6 py-2 rounded border border-default text-secondary hover:bg-tertiary transition-colors font-medium"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSyncToJSON}
                    className="px-6 py-2 rounded bg-tertiary text-primary hover:bg-secondary transition-colors font-medium"
                  >
                    Sync to JSON
                  </button>
                  <button
                    className="px-6 py-2 rounded bg-[rgb(var(--accent))] text-white hover:opacity-90 transition-colors font-semibold"
                    onClick={(e) => handleUpdateSchema(e)}
                  >
                    Update Schema
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* JSON Editor */}
                <div className="bg-secondary border border-border rounded-lg p-6">
                  <label className="block text-sm font-medium text-primary mb-3">
                    JSON Schema Definition
                  </label>
                  <textarea
                    value={jsonContent}
                    onChange={(e) => setJsonContent(e.target.value)}
                    className="w-full bg-tertiary border border-default rounded px-4 py-3 text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] h-96 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button className="px-6 py-2 rounded border border-border text-secondary hover:bg-[rgb(var(--bg-tertiary))] transition-colors font-medium">
                    Cancel
                  </button>
                  <button
                    onClick={handleSyncFromJSON}
                    className="px-6 py-2 rounded border border-border text-primary hover:bg-[rgb(var(--bg-tertiary))] transition-colors font-semibold"
                  >
                    Sync from JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </>
    </div>
  );
}
