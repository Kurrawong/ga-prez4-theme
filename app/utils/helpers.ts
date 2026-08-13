import type {SPARQLResultsJSON} from "~/utils/types";

export async function sparqlQuery(url: string, query: string): Promise<Record<string, any>[]> {
    const r = await $fetch<SPARQLResultsJSON>(url, {
        headers: {
            "Accept": "application/sparql-results+json",
            "Content-Type": "application/sparql-query",
        },
        query: {
            query,
        },
    });
    return r.results?.bindings.map(result => {
        return Object.keys(result).reduce((obj, key) => {
            if (result[key]) {
                obj[key] = result[key].value;
            }
            return obj;
        }, {} as Record<string, any>);
    }) || [];
}
