import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagInputProps {
    value?: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export function TagInput({ value = [], onChange, placeholder = "Type and press Enter..." }: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (inputValue.trim()) {
                if (!value.includes(inputValue.trim())) {
                    onChange([...value, inputValue.trim()]);
                }
                setInputValue("");
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1 text-sm">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive focus:outline-none"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        if (inputValue.trim()) {
                            if (!value.includes(inputValue.trim())) {
                                onChange([...value, inputValue.trim()]);
                            }
                            setInputValue("");
                        }
                    }}
                >
                    Add
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">Press Enter or click Add to insert value.</p>
        </div>
    );
}
