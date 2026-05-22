'use client'

import { Play, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

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
        const toastId = toast.loading("Sending request...");
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
            console.log(res);

            const end = Date.now();

            if (res.data.data.status >= 200 && res.data.data.status < 300) {
                toast.success("Request successful!", {
                    description: `Status code: ${res.data.data.status}`,
                });
            } else {
                toast.error("Request failed!", {
                    description: `Status code: ${res.data.data.status}`,
                });
            }

            setStatus(res.data.data.status);
            setResponse(res.data.data);
            setTime(end - start);
        } catch (error: any) {
            toast.error("Request failed!", {
                description: error.response?.data?.message || error.message,
            });
            console.error(error);
            setStatus(error.response?.status || 500);
            setResponse(error.response?.data || error.message);
            setTime(null);
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    }

    return (
        <div className="min-h-screen bg-primary text-primary">

            {/* Header */}
            <div className="border-b border-default px-8 py-6 bg-secondary">
                <h1 className="text-3xl font-bold mb-2">API Playground</h1>
                <p className="text-secondary">
                    Test and debug your API endpoints
                </p>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="grid grid-cols-2 gap-6">

                    {/* Request Panel */}
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
                            <Code className="w-5 h-5 text-accent" />
                            Request
                        </h2>

                        <div className="bg-secondary border border-default rounded-lg p-6 flex-1 flex flex-col">

                            {/* Method */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Method
                                </label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full bg-primary border border-default rounded px-3 py-2 text-primary text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                                >
                                    <option>GET</option>
                                    <option>POST</option>
                                    <option>PATCH</option>
                                    <option>DELETE</option>
                                </select>
                            </div>

                            {/* URL */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    URL
                                </label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="/api/mock/..."
                                    className="w-full bg-primary border border-default rounded px-3 py-2 text-primary text-sm placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                                />
                            </div>

                            {/* Headers */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Headers
                                </label>
                                <textarea
                                    value={headersText}
                                    onChange={(e) => setHeadersText(e.target.value)}
                                    placeholder="Content-Type: application/json"
                                    className="w-full bg-primary border border-default rounded px-3 py-2 text-primary text-sm placeholder:text-tertiary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                                    rows={4}
                                />
                            </div>

                            {/* Body */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-secondary mb-2">
                                    Body
                                </label>
                                <textarea
                                    value={bodyText}
                                    onChange={(e) => setBodyText(e.target.value)}
                                    placeholder={'{\n  "email": "test@example.com"\n}'}
                                    className="w-full bg-primary border border-default rounded px-3 py-2 text-primary text-sm placeholder:text-tertiary font-mono text-xs flex-1 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                                    rows={6}
                                />
                            </div>

                            {/* Button */}
                            <Button
                                onClick={handleSendRequest}
                                disabled={loading}
                                className="w-full bg-[rgb(var(--accent))] hover:opacity-90 text-white flex gap-2"
                            >
                                <Play className="w-4 h-4" />
                                Send Request
                            </Button>
                        </div>
                    </div>

                    {/* Response Panel */}
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold mb-4 text-primary">
                            Response
                        </h2>

                        <div className="bg-secondary border border-default rounded-lg p-6 flex-1">

                            {/* Meta Info */}
                            <div className="mb-4 pb-4 border-b border-default">
                                <p className="text-sm text-secondary">
                                    Status:
                                    <span className="text-accent font-semibold ml-2">
                                        {status || "-"}
                                    </span>
                                </p>

                                <p className="text-sm text-secondary">
                                    Time:
                                    <span className="text-primary ml-2">
                                        {time ? `${time}ms` : "-"}
                                    </span>
                                </p>
                            </div>

                            {/* Response Body */}
                            <div className="bg-tertiary rounded p-4 font-mono text-xs text-primary overflow-auto max-h-96">
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
