import type {PrezNode} from "prez-lib";

export function toTitleCase(s: string): string {
    return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();
}

export const statusColourMap: Record<string, string> = {
    "https://linked.data.gov.au/def/reg-statuses/accepted": "#1bc13f",
    "https://linked.data.gov.au/def/reg-statuses/addition": "#4ac11b",
    "https://linked.data.gov.au/def/reg-statuses/deprecated": "#a86a0d",
    "https://linked.data.gov.au/def/reg-statuses/experimental": "#eae72c",
    "https://linked.data.gov.au/def/reg-statuses/invalid": "#ea3c2c",
    "https://linked.data.gov.au/def/reg-statuses/notAccepted": "#ea9e2c",
    "https://linked.data.gov.au/def/reg-statuses/original": "#38a30e",
    "https://linked.data.gov.au/def/reg-statuses/reserved": "#9b8d79",
    "https://linked.data.gov.au/def/reg-statuses/retired": "#ad5b24",
    "https://linked.data.gov.au/def/reg-statuses/stable": "#2e8c09",
    "https://linked.data.gov.au/def/reg-statuses/submitted": "#248bad",
    "https://linked.data.gov.au/def/reg-statuses/superseded": "#ad7624",
    "https://linked.data.gov.au/def/reg-statuses/unstable": "#678c09",
    "https://linked.data.gov.au/def/reg-statuses/valid": "#36a80d",
};

/**
 * Sorts PrezNode objects by label, then by IRI
 *
 * @param a
 * @param b
 * @returns order score
 */
export function sortNodesByLabel(a: PrezNode, b: PrezNode): number {
    if (a.label && b.label) {
        return a.label.value.localeCompare(b.label.value);
    } else if (a.label) {
        return -1;
    } else if (b.label) {
        return 1;
    } else {
        return a.value.localeCompare(b.value);
    }
}

export function isMarkdownDetected(content: string): boolean {
    const markdownPatterns = [
        /^#{1,6}\s+/m,                  // Headings (#, ##, ###, etc.)
        /\*\*[^*]+\*\*/s,               // Bold (**text**)
        /_[^_]+_/s,                     // Italic (_text_)
        /\*[^*]+\*/s,                   // Italic (*text*)
        /\[[^\]]+\]\([^)]+\)/s,         // Links [text](url)
        /^[-*+]\s+/m,                   // Unordered lists (-, *, +)
        /^\d+\.\s+/m,                   // Ordered lists (1., 2., etc.)
        /`[^`]+`/s,                     // Inline code (`code`)
        /^```[^]*?^```/ms,              // Code blocks (```...```)
        /!\[.*?\]\(.*?\)/s              // Images ![alt text](URL)
    ];
    return markdownPatterns.some((pattern) => pattern.test(content));
}

export function isHtmlDetected(content: string): boolean {
    if (typeof DOMParser !== "undefined") {
        // DOMParser approach (for browser environments)
        const doc = new DOMParser().parseFromString(content, 'text/html');
        return Array.from(doc.body.childNodes).some(node => node.nodeType === 1); // Checks for element nodes
    } else {
        // Fallback regex approach (for non-browser environments)
        const htmlRegex = /<\/?[a-z][\s\S]*>/i;
        return htmlRegex.test(content);
    }
}
