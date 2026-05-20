"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Schema } from "@/lib/types";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserContext } from "@/lib/userProvider";
import Loader from "@/components/Loader";
import { useProject } from "@/lib/projectProvider";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SchemasPage() {
  const { userId, projectId }: { userId: string; projectId: string } =
    useParams();
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const router = useRouter();
  const { session } = useContext(UserContext);
  const { projectSchemas, refetchSchemas } = useProject();
  // const [editingId, setEditingId] = useState<string | null>(null);
  // const [editName, setEditName] = useState('');
  // const [editFields, setEditFields] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function FetchSchema() {
      try {
        setLoading(true);
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/schemas/all/${projectId}`, {
        //     headers: {
        //         Authorization: `Bearer ${session?.access_token}`,
        //     },
        // });
        // console.log('Fetched schemas:', response.data);
        setSchemas(projectSchemas || []);
      } catch (error) {
        console.error("Error fetching schemas:", error);
      } finally {
        setLoading(false);
      }
    }
    FetchSchema();
  }, [projectId, session?.access_token]);

  const handleNewSchema = () => {
    router.push(`/${userId}/${projectId}/schemas/new`);
  };

  const handleDeleteSchema = async (id: string) => {
    const toastId = toast.loading("Deleting schema...");
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/schemas/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      toast.success("Schema deleted successfully");
      setSchemas(schemas.filter((s) => s.id !== id));
      await refetchSchemas();
      // alert("Schema deleted successfully");
    } catch (error) {
      console.error("Error deleting schema:", error);
      toast.error("Failed to delete schema. Please try again.");
      // alert("Failed to delete schema. Please try again.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  // const handleEditSchema = (schema: typeof schemas[0]) => {
  //     setEditingId(schema.id)
  //     setEditName(schema.name)
  //     // setEditFields(schema.fields)
  // }

  // const handleSaveEdit = () => {
  //     setSchemas(schemas.map(s =>
  //         s.id === editingId
  //             ? { ...s, name: editName, fields: s.fields.slice(0, editFields) }
  //             : s
  //     ))
  //     setEditingId(null)
  // }

  // const handleCancelEdit = () => {
  //     setEditingId(null)
  //     window.alert("Note: Field edits are not saved in this demo. Only the name change is reflected in the table.") // Remove this line when field editing is implemented
  // }

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-primary">Schemas</h1>
          <p className="text-secondary">
            Define data models for your mock APIs
          </p>
        </div>
        <Button
          onClick={handleNewSchema}
          className="bg-blue-600 hover:bg-blue-700 flex gap-2 px-4"
        >
          <Plus className="w-4 h-4" />
          New Schema
        </Button>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="bg-slate-800/50 border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">
                  Model Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">
                  Fields
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {schemas?.map((schema) => (
                <tr
                  key={schema.id}
                  className="bg-secondary hover:bg-[rgb(var(--bg-tertiary))] transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-secondary">
                    {schema.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {schema.fields.length} fields
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {schema.visibility}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    {" "}
                    {new Date(schema.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button variant="outline" className="p-2 rounded" asChild>
                        <Link
                          href={`/${userId}/${projectId}/schemas/${schema.id}`}
                          className="p-2 rounded text-accent hover:bg-tertiary hover:text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </Button>

                      {/* <button
                        onClick={() => handleDeleteSchema(schema.id)}
                        className="p-2 rounded text-[rgb(var(--text-secondary))] hover:text-red-500 hover:bg-[rgb(var(--bg-tertiary))] transition-colors"
                      >
                        <Trash2 className="w-4 h-4 " color="red" />
                      </button> */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="p-2 rounded text-[rgb(var(--text-secondary))] hover:text-red-500 hover:bg-[rgb(var(--bg-tertiary))] transition-colors"
                          >
                            <Trash2 className="w-4 h-4 " color="red" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-800 border border-slate-700 rounded-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this schema?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. All associated mock
                              API endpoints using this schema will also be
                              deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-700 text-slate-300 hover:bg-slate-600">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSchema(schema.id)}
                              className="!bg-red-500 text-white hover:!bg-red-600"
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {/* {editingId !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white">Edit Schema</h2>
                            <button
                                onClick={handleCancelEdit}
                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Schema Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Number of Fields</label>
                                <input
                                    type="number"
                                    value={editFields}
                                    onChange={(e) => setEditFields(parseInt(e.target.value) || 0)}
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    onClick={handleSaveEdit}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    onClick={handleCancelEdit}
                                    variant="outline"
                                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
    </div>
  );
}
