const IDENT_START = /[A-Za-z_$]/;
const IDENT_PART = /[A-Za-z0-9_$]/;

function skipIgnorable(input: string, index: number) {
    while (index < input.length) {
        if (/\s/.test(input[index])) {
            index++;
            continue;
        }

        if (input[index] === "/" && input[index + 1] === "/") {
            index += 2;
            while (index < input.length && input[index] !== "\n") index++;
            continue;
        }

        if (input[index] === "/" && input[index + 1] === "*") {
            index += 2;
            while (index < input.length && !(input[index] === "*" && input[index + 1] === "/")) index++;
            index = Math.min(index + 2, input.length);
            continue;
        }

        break;
    }

    return index;
}

/**
 * Converts common JavaScript object-literal syntax (single-quoted strings,
 * unquoted keys, trailing commas, comments) into strict JSON.
 */
function toStrictJson(input: string): string {
    let output = "";
    let i = 0;

    while (i < input.length) {
        const char = input[i];

        // Line comment
        if (char === "/" && input[i + 1] === "/") {
            i += 2;
            while (i < input.length && input[i] !== "\n") i++;
            continue;
        }

        // Block comment
        if (char === "/" && input[i + 1] === "*") {
            i += 2;
            while (i < input.length && !(input[i] === "*" && input[i + 1] === "/")) i++;
            i += 2;
            continue;
        }

        // Double-quoted string: already valid JSON, copy it verbatim.
        if (char === '"') {
            output += char;
            i++;
            while (i < input.length) {
                const current = input[i];
                if (current === "\\") {
                    output += current + (input[i + 1] ?? "");
                    i += 2;
                } else if (current === '"') {
                    output += current;
                    i++;
                    break;
                } else {
                    output += current;
                    i++;
                }
            }
            continue;
        }

        // Single-quoted string: convert to a double-quoted JSON string.
        if (char === "'") {
            output += '"';
            i++;
            while (i < input.length) {
                const current = input[i];
                if (current === "\\") {
                    const next = input[i + 1];
                    if (next === "'") {
                        output += "'";
                        i += 2;
                    } else if (next === '"') {
                        output += '\\"';
                        i += 2;
                    } else if (["n", "r", "t", "b", "f", "/", "\\"].includes(next ?? "")) {
                        output += "\\" + next;
                        i += 2;
                    } else if (next === "u") {
                        output += input.slice(i, i + 6);
                        i += 6;
                    } else {
                        output += "\\\\" + (next ?? "");
                        i += 2;
                    }
                } else if (current === '"') {
                    output += '\\"';
                    i++;
                } else if (current === "'") {
                    output += '"';
                    i++;
                    break;
                } else {
                    output += current;
                    i++;
                }
            }
            continue;
        }

        // Drop trailing commas: [1, 2,] -> [1, 2]
        if (char === ",") {
            const nextIndex = skipIgnorable(input, i + 1);
            if (input[nextIndex] === "}" || input[nextIndex] === "]") {
                i++;
                continue;
            }
        }

        // Quote unquoted object keys: { id: 1 } -> { "id": 1 }
        if (char === "{" || char === ",") {
            output += char;
            i++;
            const keyStart = skipIgnorable(input, i);
            if (keyStart < input.length && IDENT_START.test(input[keyStart])) {
                let keyEnd = keyStart;
                while (keyEnd < input.length && IDENT_PART.test(input[keyEnd])) keyEnd++;
                const key = input.slice(keyStart, keyEnd);
                const afterKey = skipIgnorable(input, keyEnd);
                if (input[afterKey] === ":") {
                    output += `"${key}"`;
                    i = keyEnd;
                }
            }
            continue;
        }

        output += char;
        i++;
    }

    return output;
}

/**
 * Parses JSON, falling back to a lenient parser that accepts common
 * JavaScript object-literal syntax. Always returns a value that can be
 * safely sent to an API as JSON.
 */
export function parseJsonLoose(text: string): unknown {
    const trimmed = text.trim(); // Trim whitespace to avoid JSON.parse errors on empty strings.

    try {
        return JSON.parse(trimmed);
    } catch (strictError) {
        try {
            return JSON.parse(toStrictJson(trimmed));
        } catch {
            // Surface the original JSON.parse error, which has a useful position.
            throw strictError;
        }
    }
}
