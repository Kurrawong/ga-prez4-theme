export function toTitleCase(s: string): string {
    return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();
}