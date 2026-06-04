"use client";

import { useState, useEffect, useContext } from "react";
import { Copy, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "./landing-page-components/header";
import axios from "axios";
import { UserContext } from "@/lib/userProvider";
import { Schema } from "@/lib/types";
import { toast } from "sonner";

function getMethodColor(method: string): string {
  switch (method) {
    case "GET":
      return "bg-blue-900/40 text-blue-400 border-blue-700/50";
    case "POST":
      return "bg-emerald-900/40 text-emerald-400 border-emerald-700/50";
    case "PUT":
      return "bg-amber-900/40 text-amber-400 border-amber-700/50";
    case "DELETE":
      return "bg-red-900/40 text-red-400 border-red-700/50";
    default:
      return "bg-slate-900/40 text-slate-400 border-slate-700/50";
  }
}

interface SchemaCardProps {
  schema: Schema;
  isExpanded: boolean;
  onToggle: () => void;
  // setAlert: (show: boolean) => void;
}

function SchemaCard({
  schema,
  isExpanded,
  onToggle,
  // setAlert,
}: SchemaCardProps) {
  const endpoints = [
    {
      id: `${schema.name}-get-all`,
      method: "GET",
      path: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/public-mock/${schema.name}`,
      description: "Get all User records",
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      id: `${schema.name}-get-one`,
      method: "GET",
      path: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/public-mock/${schema.name}/{id}`,
      description: "Get a single User record by ID",
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      id: `${schema.name}-create`,
      method: "POST",
      path: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/public-mock/${schema.name}`,
      description: "Create a new User record",
      color: "bg-green-500/20 text-green-400",
    },
    {
      id: `${schema.name}-update`,
      method: "PATCH",
      path: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/public-mock/${schema.name}/{id}`,
      description: "Update an existing User record",
      color: "bg-yellow-500/20 text-yellow-400",
    },
    {
      id: `${schema.name}-delete`,
      method: "DELETE",
      path: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/public-mock/${schema.name}/{id}`,
      description: "Delete a User record",
      color: "bg-red-500/20 text-red-400",
    },
  ];

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied Successfully", {
      description: "The endpoint URL has been copied to your clipboard.",
      action: {
        label: "Close",
        onClick: () => console.log("Close toast"),
      },
    });
    // setAlert(true);
    // setTimeout(() => setAlert(false), 3000);
  }

  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden bg-tertiary hover:border-slate-600 transition-all duration-300">
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-start justify-between hover:bg-slate-900/50 transition-colors"
      >
        <div className="flex-1 text-left">
          <h3 className="text-lg font-bold text-white mb-1">{schema.name}</h3>
          {/* <p className="text-sm text-slate-400 mb-3">{schema.description}</p> */}
          {/* <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>By {schema.author}</span>
            <span>•</span>
            <span>{schema.downloads} downloads</span>
            <span>•</span>
            <span>{schema.endpoints.length} endpoints</span>
          </div> */}
        </div>
        <div
          className={`ml-4 transition-transform duration-300 flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>
      </button>

      {isExpanded && (
        <div className="flex flex-row gap-2 p-2">
          {/* Endpoints List */}
          <div className="w-full border-t border-slate-700/30 bg-secondary p-4 space-y-3 rounded-2xl">
            {endpoints.map((endpoint, idx) => (
              <div
                key={idx}
                className="group bg-tertiary border border-slate-700/50 hover:border-slate-600 rounded-lg p-4 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 flex items-start gap-8">
                    {/* Method Badge */}
                    <div
                      className={`w-20 inline-flex items-center justify-center px-2.5 py-1 rounded text-xs font-bold border ${getMethodColor(endpoint.method)} flex-shrink-0`}
                    >
                      {endpoint.method}
                    </div>

                    {/* Endpoint Details */}
                    <div className="flex-col min-w-0">
                      <p className="font-mono text-sm text-primary break-all mb-1">
                        {endpoint.path}
                      </p>
                      <p className="text-xs text-slate-500">
                        {endpoint.description}
                      </p>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="cursor-pointer border-default text-secondary hover:bg-[rgb(var(--bg-tertiary))] hover:text-primary flex gap-2 shrink-0"
                    onClick={() => {
                      copyToClipboard(endpoint.path);
                      // setAlert(true);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    Copy URL
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* schema fields json */}
          <div className="w-100 border-t border-slate-700/30 bg-secondary p-4 rounded-2xl">
            <p>
              <span className="font-bold text-primary">Schema Fields:</span>
            </p>
            <pre className="text-xs text-slate-300 overflow-x-auto">
              {JSON.stringify(
                schema.fields.map((field: { name: string; type: string }) => ({
                  name: field.name,
                  type: field.type,
                })),
                null,
                2,
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export function PublicMockPage() {
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(
    new Set(),
  );
  const { session } = useContext(UserContext);
  // const [showAlert, setShowAlert] = useState(false);

  // Public schemas that are shared
  const [PUBLIC_SCHEMAS, setPublicSchemas] = useState<Schema[]>([]);
  // console.log("Public Schemas:", PUBLIC_SCHEMAS);

  useEffect(() => {
    const fetchPublicSchemas = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/schemas/public-schemas`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      );
      setPublicSchemas(response.data.schemas);
    };

    fetchPublicSchemas();
  }, [session?.access_token]);

  const toggleSchema = (schemaId: string) => {
    const newExpanded = new Set(expandedSchemas);
    if (newExpanded.has(schemaId)) {
      newExpanded.delete(schemaId);
    } else {
      newExpanded.add(schemaId);
    }
    setExpandedSchemas(newExpanded);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="mx-auto">
        {/* Page Header */}
        <div className="mb-12 border-b border-default bg-secondary/40 px-8 py-12">
          <div className="mx-auto max-w-6xl">
            <h1 className="mb-3 text-4xl font-bold text-primary">
              Public Mock APIs
            </h1>

            <p className="text-lg text-secondary">
              Browse and use community-shared mock API schemas
            </p>

            <p className="mt-1 text-secondary">
              Select a schema to view all available endpoints and copy
              integration code
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mb-12 grid max-w-6xl grid-cols-1 gap-4 px-8 md:grid-cols-3">
          <div className="rounded-xl border border-default bg-secondary p-6 shadow-sm">
            <p className="mb-2 text-sm font-medium text-secondary">
              Total Schemas
            </p>

            <p className="text-3xl font-bold text-primary">
              {PUBLIC_SCHEMAS.length}
            </p>
          </div>

          {/* <div className="rounded-xl border border-default bg-secondary p-6 shadow-sm">
            <p className="mb-2 text-sm font-medium text-secondary">
              Total Downloads
            </p>

            <p className="text-3xl font-bold text-primary">
              {PUBLIC_SCHEMAS.reduce(
                (sum, s) => sum + s.downloads,
                0,
              ).toLocaleString()}
            </p>
          </div> */}

          <div className="rounded-xl border border-default bg-secondary p-6 shadow-sm">
            <p className="mb-2 text-sm font-medium text-secondary">
              Total Endpoints
            </p>

            <p className="text-3xl font-bold text-primary">
              {Number(PUBLIC_SCHEMAS?.length) * 5}
            </p>
          </div>
        </div>

        {/* Schemas Grid */}
        <div className="mx-auto max-w-6xl space-y-4 px-8 min-h-[300px]">
          {PUBLIC_SCHEMAS.map((schema) => (
            <SchemaCard
              key={schema.id}
              schema={schema}
              isExpanded={expandedSchemas.has(schema.id)}
              onToggle={() => toggleSchema(schema.id)}
              // setAlert={setShowAlert}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mx-auto mt-10 text-center border-t border-default px-8 py-8">
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} MockForge. Built for developers.
          </p>
        </div>
      </main>
    </div>
  );
}
