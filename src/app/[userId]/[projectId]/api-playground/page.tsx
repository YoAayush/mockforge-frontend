'use client'

import { Play, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { useState } from 'react';

export default function APIPlaygroundPage() {

    const [method, setMethod] = useState("GET");
    const [url, setUrl] = useState("");
    const [headersText, setHeadersText] = useState("");
    const [bodyText, setBodyText] = useState("");

    const [response, setResponse] = useState<any>(null);
    const [status, setStatus] = useState<number | null>(null);
    const [time, setTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    function parseHeaders(headerString: string) {
        const headers: Record<string, string> = {};
        headerString.split("\n").forEach((line) => {
            const [key, ...value] = line.split(":");
            if (key && value.length) {
                headers[key.trim()] = value.join(":").trim();
            }
        });
        return headers;
    }

    async function handleSendRequest() {
        setLoading(true);

        try {
            const headers = parseHeaders(headersText);

            let parsedBody = undefined;

            if (bodyText && method !== "GET") {
                try {
                    parsedBody = JSON.parse(bodyText);
                } catch {
                    alert("Invalid JSON body");
                    setLoading(false);
                    return;
                }
            }

            const start = Date.now();

            const res = await axios({
                method,
                url,
                headers,
                data: parsedBody,
            });

            const end = Date.now();

            setStatus(res.status);
            setResponse(res.data);
            setTime(end - start);
        } catch (error: any) {
            setStatus(error.response?.status || 500);
            setResponse(error.response?.data || error.message);
            setTime(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
            {/* Header */}
            <div className="border-b border-slate-800 px-8 py-6">
                <h1 className="text-3xl font-bold mb-2">API Playground</h1>
                <p className="text-slate-400">Test and debug your API endpoints</p>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="grid grid-cols-2 gap-6">
                    {/* Request Panel */}
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Code className="w-5 h-5" />
                            Request
                        </h2>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Method</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm">
                                    <option>GET</option>
                                    <option>POST</option>
                                    <option>PATCH</option>
                                    <option>DELETE</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">URL</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="/api/mock/..."
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm placeholder-slate-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Headers</label>
                                <textarea
                                    value={headersText}
                                    onChange={(e) => setHeadersText(e.target.value)}
                                    placeholder="Content-Type: application/json"
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm placeholder-slate-500 font-mono text-xs"
                                    rows={4}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Body</label>
                                <textarea
                                    value={bodyText}
                                    onChange={(e) => setBodyText(e.target.value)}
                                    placeholder={'{\n  "email": "test@example.com"\n}'}
                                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-slate-200 text-sm placeholder-slate-500 font-mono text-xs flex-1"
                                    rows={6}
                                />
                            </div>

                            <Button
                                onClick={handleSendRequest}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 flex gap-2">
                                <Play className="w-4 h-4" />
                                Send Request
                            </Button>
                        </div>
                    </div>

                    {/* Response Panel */}
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold mb-4">Response</h2>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 flex-1">
                            <div className="mb-4 pb-4 border-b border-slate-700">
                                <p className="text-sm text-slate-400">
                                    Status:
                                    <span className="text-green-400 font-semibold ml-2">
                                        {status || "-"}
                                    </span>
                                </p>
                                <p className="text-sm text-slate-400">
                                    Time:
                                    <span className="text-slate-300 ml-2">
                                        {time ? `${time}ms` : "-"}
                                    </span>
                                </p>
                            </div>

                            <div className="bg-slate-900/50 rounded p-4 font-mono text-xs text-slate-200 overflow-auto max-h-96">
                                <pre>
                                    {response
                                        ? JSON.stringify(response, null, 2)
                                        : "No response yet"}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
