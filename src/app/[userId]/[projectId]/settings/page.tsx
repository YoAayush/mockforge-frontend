'use client'

import { Save, Shield, Bell, Key } from 'lucide-react'
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
            const res = await axios.patch(`http://localhost:3000/api/v1/projects/${projectData?.id}`, {
                name: projectName,
                description: projectDescription,
                visibility: projectData?.visibility
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-6">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-slate-400">Manage your project settings and preferences</p>
            </div>

            {/* Content */}
            <div className="p-8 max-w-2xl">
                {/* General Settings */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        General Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                            <input
                                type="text"
                                defaultValue={`${projectName}`}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Project ID</label>
                            <div className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-400 text-sm font-mono">
                                {`${projectData?.id}`}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                            <textarea
                                defaultValue={`${projectDescription}`}
                                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm"
                                rows={3}
                                onChange={(e) => setProjectDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* API Keys */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        API Keys
                    </h2>
                    <div className="space-y-3">
                        <div className="bg-slate-900/50 p-4 rounded border border-slate-700 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-200">Production Key</p>
                                <p className="text-xs text-slate-500 font-mono">sk_live_••••••••••••••••</p>
                            </div>
                            <Button variant="outline" className="border-slate-600 text-slate-600 hover:bg-slate-700 hover:text-white">
                                Regenerate
                            </Button>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded border border-slate-700 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-200">Development Key</p>
                                <p className="text-xs text-slate-500 font-mono">sk_test_••••••••••••••••</p>
                            </div>
                            <Button variant="outline" className="border-slate-600 text-slate-600 hover:bg-slate-700 hover:text-white">
                                Regenerate
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Notifications - later implementation */}
                {/* <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notifications
                    </h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                            <span className="text-sm text-slate-300">Email on API errors</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                            <span className="text-sm text-slate-300">Weekly usage report</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded" />
                            <span className="text-sm text-slate-300">New feature announcements</span>
                        </label>
                    </div>
                </div> */}

                {/* Save Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 flex gap-2 justify-center" onClick={UpdateSettings}>
                    <Save className="w-4 h-4" />
                    Save Settings
                </Button>
            </div>
        </div>
    )
}
