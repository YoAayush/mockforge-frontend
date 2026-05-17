'use client'

import { Save, Shield, Bell, Key, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProject } from '@/lib/projectProvider'
import { useUser } from '@/lib/userProvider'
import axios from 'axios'
import { useState } from 'react'

export default function SettingsPage() {

    const { projectData } = useProject();
    const { session } = useUser();

    const [projectName, setProjectName] = useState(projectData?.name || "");
    const [projectDescription, setProjectDescription] = useState(projectData?.description || "");

    const UpdateSettings = async () => {
        try {
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectData?.id}`, {
                name: projectName,
                description: projectDescription,
            }, {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`
                }
            });

            if (res.status === 200) {
                alert("Project settings updated successfully!");
            } else {
                alert("Failed to update project settings. Please try again.");
            }
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    function copyToClipboard(text: string | undefined) {
        if (text) {
            navigator.clipboard.writeText(text);
            alert("Copied to clipboard!");
        }
    }

    function maskApiKey(
        key: string | undefined,
        options?: {
            prefixLength?: number;
            suffixLength?: number;
            maskChar?: string;
        }
    ) {
        if (!key) return "";

        const prefixLength = options?.prefixLength ?? 4; // e.g. "sk_live"
        const suffixLength = options?.suffixLength ?? 2;
        const maskChar = options?.maskChar ?? "•";

        if (key.length <= prefixLength + suffixLength) {
            return key; // too short to mask properly
        }

        const prefix = key.slice(0, prefixLength);
        const suffix = key.slice(-suffixLength);
        const masked = maskChar.repeat(12); // fixed length for UI consistency

        return `${prefix}_${masked}${suffix}`;
    }

    return (
        <div className="min-h-screen bg-primary text-primary">

            {/* Header */}
            <div className="border-b border-default px-8 py-6 bg-secondary">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-secondary">
                    Manage your project settings and preferences
                </p>
            </div>

            {/* Content */}
            <div className="p-8 max-w-2xl">

                {/* General Settings */}
                <div className="bg-secondary border border-default rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                        <Shield className="w-5 h-5 text-accent" />
                        General Settings
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Project Name
                            </label>
                            <input
                                type="text"
                                defaultValue={`${projectName}`}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full bg-primary border border-default rounded px-3 py-2 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Project ID
                            </label>

                            <div className="bg-tertiary border border-border rounded px-3 py-2 text-secondary text-sm font-mono flex items-center justify-between gap-4">
                                {`${projectData?.id}`}

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="text-secondary hover:bg-tertiary hover:text-primary flex gap-2"
                                    onClick={() => copyToClipboard(projectData?.id)}
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy ID
                                </Button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Description
                            </label>
                            <textarea
                                defaultValue={`${projectDescription}`}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                rows={3}
                                className="w-full bg-primary border border-default rounded px-3 py-2 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                            />
                        </div>
                    </div>
                </div>

                {/* API Keys */}
                <div className="bg-secondary border border-default rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                        <Key className="w-5 h-5 text-accent" />
                        API Keys
                    </h2>

                    <div className="space-y-3">
                        <div className="bg-tertiary p-4 rounded border border-default flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-primary">
                                    Authorization Bearer Key
                                </p>
                                <p className="text-xs text-tertiary font-mono">
                                    {maskApiKey(session?.access_token)}
                                </p>
                            </div>

                            <Button
                                variant="secondary"
                                size="sm"
                                className="text-secondary hover:bg-[rgb(var(--bg-tertiary))] hover:text-primary flex gap-2"
                                onClick={() => copyToClipboard(session?.access_token)}
                            >
                                <Copy className="w-4 h-4" />
                                Copy Key
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <Button
                    className="w-full bg-[rgb(var(--accent))] hover:opacity-90 text-white flex gap-2 justify-center"
                    onClick={UpdateSettings}
                >
                    <Save className="w-4 h-4" />
                    Save Settings
                </Button>
            </div>
        </div>
    )
}
