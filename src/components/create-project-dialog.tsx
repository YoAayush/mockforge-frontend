"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { useMockForge } from "@/lib/context";
import axios from "axios";
import { UserContext } from "../lib/userProvider";
import { useContext } from "react";

interface CreateProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateProjectDialog({ open, onOpenChange, onSuccess }: CreateProjectDialogProps) {
    // const { addProject } = useMockForge();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { session } = useContext(UserContext);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setIsLoading(true);
        try {
            // addProject(name, description, false);
            const response = await axios.post("http://localhost:3000/api/v1/projects/create", {
                name, description
            },
                {
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`
                    }
                }
            )
            console.log(response);
            setName("");
            setDescription("");
            onOpenChange(false);
            onSuccess?.();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-neutral-900 border-neutral-800">
                <DialogHeader>
                    <DialogTitle className="text-white">Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-neutral-200">Project Name</label>
                        <Input
                            placeholder="My API Project"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-neutral-200">Description</label>
                        <Textarea
                            placeholder="Project description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                            rows={3}
                        />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-neutral-800 rounded-lg">
                        <input
                            type="checkbox"
                            id="public"
                            className="cursor-pointer"
                        />
                        <label htmlFor="public" className="text-sm text-neutral-200 cursor-pointer flex-1">
                            Public Project
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-neutral-400"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!name.trim() || isLoading}
                        className="bg-white text-black hover:bg-neutral-100"
                    >
                        {isLoading ? "Creating..." : "Create Project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
