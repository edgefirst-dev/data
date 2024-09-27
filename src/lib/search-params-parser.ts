import { Parser } from "../parser.js";

/**
 * The `SearchParamsParser` is a specialized parser designed to safely extract
 * and validate values from a `URLSearchParams` object. It simplifies access
 * to URL search parameters in a type-safe manner and offers support for
 * multiple input types (e.g., `URLSearchParams`, `URL`, `Request`, or URL
 * strings).
 *
 * ### Supported Inputs
 * - `URLSearchParams`: Directly parses the given `URLSearchParams` object.
 * - `URL`: Extracts the `searchParams` from the `URL` object.
 * - `Request`: Parses the URL's search parameters from a `Request` object.
 * - `string`: Parses the search parameters from a string representing a URL.
 *
 * @extends Parser<URLSearchParams>
 *
 * @example
 * let url = new URL(request.url);
 * let parser = new SearchParamsParser(url.searchParams);
 * @example
 * let url = new URL(request.url);
 * let parser = new SearchParamsParser(url);
 * @example
 * let parser = new SearchParamsParser(request.url);
 * @example
 * let parser = new SearchParamsParser(request);
 */
export class SearchParamsParser extends Parser<URLSearchParams> {
	constructor(input: string | Request | URL | URLSearchParams) {
		if (typeof input === "string") super(new URL(input).searchParams);
		else if (input instanceof Request) super(new URL(input.url).searchParams);
		else if (input instanceof URL) super(input.searchParams);
		else super(input);
	}

	/**
	 * Check if a key exists in the search params.
	 */
	public has(key: string): boolean {
		return this.value.has(key);
	}

	/**
	 * Access a value from the search params.
	 * @throws {Parser.MissingKeyError} If the key does not exist.
	 */
	public get(key: string) {
		let value = this.value.get(key);
		if (value === null) throw new Parser.MissingKeyError(key);
		return value;
	}
}