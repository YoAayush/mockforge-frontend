'use client'

import { Copy, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from '@/lib/userProvider'
import { useProject } from '@/lib/projectProvider'
import { Schema } from '@/lib/types'
// import { usePathname } from 'next/navigation'

export default function APIEndpointsPage() {
    // const pathname = usePathname();
    // console.log(pathname);
    const { projectId } = useParams();
    const { session } = useContext(UserContext);
    const { projectData } = useProject();
    const [schemas, setSchemas] = useState<Schema[]>([]);
    const [selectedSchemaId, setSelectedSchemaId] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function FetchSchema() {
            try {
                const response = await axios.get(`${`${process.env.NEXT_PUBLIC_API_URL}/schemas/all/${projectId}`}`, {
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`,
                    },
                });
                // console.log('Fetched schemas:', response.data);
                setSchemas(response.data.schemas);
                setSelectedSchemaId(response.data.schemas[0]?.id); // Select the first schema by default
            } catch (error) {
                console.error('Error fetching schemas:', error);
            }
        }
        FetchSchema();
    }, [projectId, session?.access_token]);

    const endpoints = schemas
        .filter((schema) => schema.id === selectedSchemaId)
        .flatMap((schema) => {
            const name = schema.name;

            return [
                {
                    id: `${name}-get-all`,
                    method: "GET",
                    path: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/mock/${projectData?.id}/${name}`,
                    description: 'Get all User records',
                    color: 'bg-blue-500/20 text-blue-400',
                },
                {
                    id: `${name}-get-one`,
                    method: "GET",
                    path: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/mock/${projectData?.id}/${name}/{id}`,
                    description: 'Get a single User record by ID',
                    color: 'bg-blue-500/20 text-blue-400',
                },
                {
                    id: `${name}-create`,
                    method: "POST",
                    path: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/mock/${projectData?.id}/${name}`,
                    description: 'Create a new User record',
                    color: 'bg-green-500/20 text-green-400',
                },
                {
                    id: `${name}-update`,
                    method: "PATCH",
                    path: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/mock/${projectData?.id}/${name}/{id}`,
                    description: 'Update an existing User record',
                    color: 'bg-yellow-500/20 text-yellow-400',
                },
                {
                    id: `${name}-delete`,
                    method: "DELETE",
                    path: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/mock/${projectData?.id}/${name}/{id}`,
                    description: 'Delete a User record',
                    color: 'bg-red-500/20 text-red-400',
                },
            ];
        });

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    }

    return (
        <div className="min-h-screen bg-primary text-primary">

            {/* Header */}
            <div className="border-b border-default px-8 py-6 bg-secondary">
                <h1 className="text-3xl font-bold mb-2">API Endpoints</h1>
                <p className="text-secondary">
                    Auto-generated REST endpoints for your schemas
                </p>
            </div>

            {/* Schema Select */}
            <div className="ml-6 mt-4 max-w-md">
                <label className="block text-sm font-semibold text-secondary mb-3">
                    Select Schema
                </label>

                <Select value={selectedSchemaId} onValueChange={setSelectedSchemaId}>
                    <SelectTrigger className="bg-secondary border border-default text-primary hover:bg-tertiary focus:ring-[rgb(var(--accent))]">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent className="bg-secondary border border-default">
                        {schemas.map((schema) => (
                            <SelectItem key={schema.id} value={schema.id}>
                                {schema.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="space-y-4">
                    {endpoints.map((endpoint) => (
                        <div
                            key={endpoint.id}
                            className="bg-secondary border border-default rounded-lg p-6 hover:bg-tertiary transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">

                                <div className="flex items-start gap-8 flex-1">

                                    {/* Method Badge */}
                                    <span className={`w-22 py-1 rounded font-mono text-xs text-center font-semibold ${endpoint.color}`}>
                                        {endpoint.method}
                                    </span>

                                    {/* Endpoint Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-sm text-primary break-all">
                                            {endpoint.path}
                                        </p>

                                        <p className="text-sm text-secondary mt-1">
                                            {endpoint.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Copy Button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-default text-secondary hover:bg-[rgb(var(--bg-tertiary))] hover:text-primary flex gap-2 shrink-0"
                                    onClick={() => copyToClipboard(endpoint.path)}
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy URL
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
