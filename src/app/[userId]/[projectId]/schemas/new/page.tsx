'use client'

import { useContext, useState } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { SchemaField } from '@/lib/types'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/lib/userProvider'
import { usePathname } from 'next/navigation'

export default function EditSchemaPage() {
    const [activeTab, setActiveTab] = useState<'form' | 'json'>('form')
    const [schemaName, setSchemaName] = useState('User')
    const [fields, setFields] = useState<SchemaField[]>([])
    const { userId, projectId } = useParams() as { userId: string; projectId: string }
    const router = useRouter();
    const { session } = useContext(UserContext);
    const pathname = usePathname();
    // console.log('Current path:', pathname);

    function generateJSON() {
        return JSON.stringify(
            {
                name: schemaName,
                fields: fields.reduce((acc, field) => {
                    acc[field.name] = {
                        type: field.type,
                        faker_type: field.faker === 'None' ? null : field.faker,
                        // enum_values: null
                    }
                    return acc
                }, {} as Record<string, any>)
            },
            null,
            2
        )
    }

    const [jsonContent, setJsonContent] = useState(generateJSON())

    const handleAddField = () => {
        const newField: SchemaField = {
            id: Date.now().toString(),
            name: 'new_field',
            type: 'string',
            faker: 'None',
            format: null,
            schemaId: '',
            createdAt: new Date().toISOString()
        }
        const updatedFields = [...fields, newField]
        setFields(updatedFields)
        // Auto-update JSON
        const updatedJson = JSON.stringify(
            {
                name: schemaName,
                fields: updatedFields.reduce((acc, field) => {
                    acc[field.name] = {
                        type: field.type,
                        faker_type: field.faker === 'None' ? null : field.faker,
                        // enum_values: null
                    }
                    return acc
                }, {} as Record<string, any>)
            },
            null,
            2
        )
        setJsonContent(updatedJson)
    }

    const handleDeleteField = (id: string) => {
        const updatedFields = fields.filter(f => f.id !== id)
        setFields(updatedFields)
        // Auto-update JSON
        const updatedJson = JSON.stringify(
            {
                name: schemaName,
                fields: updatedFields.reduce((acc, field) => {
                    acc[field.name] = {
                        type: field.type,
                        faker_type: field.faker === 'None' ? null : field.faker,
                        // enum_values: null
                    }
                    return acc
                }, {} as Record<string, any>)
            },
            null,
            2
        )
        setJsonContent(updatedJson)
    }

    const handleFieldChange = (id: string, key: string, value: string | null) => {
        const updatedFields = fields.map(f =>
            f.id === id ? { ...f, [key]: value } : f
        )
        setFields(updatedFields)
        // Auto-update JSON when in form mode
        if (activeTab === 'form') {
            const updatedJson = JSON.stringify(
                {
                    name: schemaName,
                    fields: updatedFields.reduce((acc, field) => {
                        acc[field.name] = {
                            type: field.type,
                            faker_type: field.faker === 'None' ? null : field.faker,
                            // enum_values: null
                        }
                        return acc
                    }, {} as Record<string, any>)
                },
                null,
                2
            )
            setJsonContent(updatedJson)
        }
    }

    const handleSyncToJSON = () => {
        setJsonContent(generateJSON())
        setActiveTab('json')
    }

    const handleSyncFromJSON = () => {
        try {
            const parsed = JSON.parse(jsonContent)
            setSchemaName(parsed.name)
            const newFields: SchemaField[] = Object.entries(parsed.fields).map(([name, config]: [string, any]) => ({
                id: Date.now().toString() + Math.random(),
                name,
                type: config.type || 'string',
                faker: config.faker_type || 'None',
                format: config.format || null,
                schemaId: '',
                createdAt: new Date().toISOString()
            }))
            setFields(newFields)
            setActiveTab('form')
        } catch (error) {
            alert('Invalid JSON format')
        }
    }

    const handleSubmitSchema = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/v1/schemas/add', {
                name: schemaName,
                projectId,
                fields: fields.map(field => ({
                    ...field,
                    faker: field.faker === 'None' ? null : field.faker,
                    format: field.format || null
                }))
            }, {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                },
            })
            console.log('Schema created:', res.data);
            setTimeout(() => {
                router.push(`/${userId}/${projectId}/schemas`)
            }, 500);
        } catch (error) {
            return console.error('Error creating schema:', error);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-6 flex items-center gap-4">
                <Link href={`/${userId}/${projectId}/dashboard`} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Dashboard
                </Link>
                <h1 className="text-3xl font-bold">Edit Schema</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-800 px-8 py-4 flex gap-4">
                <button
                    onClick={() => setActiveTab('form')}
                    className={`px-4 py-2 rounded font-medium transition-colors ${activeTab === 'form'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    Form Builder
                </button>
                <button
                    onClick={() => setActiveTab('json')}
                    className={`px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors ${activeTab === 'json'
                        ? 'bg-slate-700 text-white border border-slate-600'
                        : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    <span className="text-xs">&lt;&gt;</span>
                    JSON Editor
                </button>
            </div>

            {/* Content */}
            <div className="p-8">
                {activeTab === 'form' ? (
                    <div className="space-y-6">
                        {/* Schema Name */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <label className="block text-sm font-medium text-slate-300 mb-3">Schema Name</label>
                            <input
                                type="text"
                                value={schemaName}
                                onChange={(e) => {
                                    setSchemaName(e.target.value)
                                    // Auto-update JSON when schema name changes
                                    const updatedJson = JSON.stringify(
                                        {
                                            name: e.target.value,
                                            fields: fields.reduce((acc, field) => {
                                                acc[field.name] = {
                                                    type: field.type,
                                                    faker_type: field.faker === 'None' ? null : field.faker,
                                                    // enum_values: null
                                                }
                                                return acc
                                            }, {} as Record<string, any>)
                                        },
                                        null,
                                        2
                                    )
                                    setJsonContent(updatedJson)
                                }}
                                className="w-full bg-slate-900 border border-slate-600 rounded px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Fields */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
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
                                {fields.map((field) => (
                                    <div key={field.id} className="flex gap-4 items-end p-4 bg-slate-900/50 rounded border border-slate-700">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-slate-400 mb-1">Field Name</label>
                                            <input
                                                type="text"
                                                value={field.name}
                                                onChange={(e) => handleFieldChange(field.id, 'name', e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                                            <select
                                                value={field.type}
                                                onChange={(e) => handleFieldChange(field.id, 'type', e.target.value)}
                                                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                                            >
                                                <option>string</option>
                                                <option>email</option>
                                                <option>number</option>
                                                <option>boolean</option>
                                                <option>date</option>
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-slate-400 mb-1">Faker Generator (Optional)</label>
                                            <select
                                                value={field.faker ?? 'None'}
                                                onChange={(e) => handleFieldChange(field.id, 'faker', e.target.value || null)}
                                                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">None</option>
                                                <option value="person.fullName">Full Name</option>
                                                <option value="internet.email">Email</option>
                                                <option value="phone.number">Phone Number</option>
                                                <option value="location.streetAddress">Address</option>
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
                            <button className="px-6 py-2 rounded border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors font-medium">
                                Cancel
                            </button>
                            <button
                                onClick={handleSyncToJSON}
                                className="px-6 py-2 rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors font-medium"
                            >
                                Sync to JSON
                            </button>
                            <button className="px-6 py-2 rounded bg-white text-slate-900 hover:bg-slate-100 transition-colors font-semibold" onClick={handleSubmitSchema}>
                                Submit Schema
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* JSON Editor */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                            <label className="block text-sm font-medium text-slate-300 mb-3">JSON Schema Definition</label>
                            <textarea
                                value={jsonContent}
                                onChange={(e) => setJsonContent(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded px-4 py-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-blue-500 h-96 resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button className="px-6 py-2 rounded border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors font-medium">
                                Cancel
                            </button>
                            <button
                                onClick={handleSyncFromJSON}
                                className="px-6 py-2 rounded bg-white text-slate-900 hover:bg-slate-100 transition-colors font-semibold"
                            >
                                Sync from JSON
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
