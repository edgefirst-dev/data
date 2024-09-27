import { Parser } from "../parser.js";

/**
 * The `FormParser` is a specialized parser designed to safely extract and
 * validate values from a `FormData` object. It provides methods to retrieve
 * form fields in a type-safe manner, ensuring that required fields are present
 * and properly typed.
 *
 * This parser is particularly useful when handling form submissions, such as
 * in a Remix action, where structured validation of form data is necessary.
 *
 * ### Usage
 * `FormParser` wraps the `FormData` object and provides methods to:
 * - Check for the presence of form fields (`has`).
 * - Retrieve values as strings, files, booleans, or arrays of these types.
 * - Ensure that required fields are present, throwing errors if they are missing or of the wrong type.
 *
 * The parser uses custom error types (`MissingKeyError`, `InvalidTypeError`,
 * `InvalidInstanceOfError`) to simplify debugging and enforce validation rules.
 *
 * ### How It Works
 * - Methods like `getString`, `getFile`, and `getBoolean` validate and return the form data in the correct type.
 * - For multiple values (e.g., checkboxes or multi-select fields), `getStringArray` and `getFileArray` can be used to retrieve arrays of values.
 * - Booleans are specifically treated such that a field with the value `"on"` is considered `true`, and all others are `false`.
 *
 * @extends Parser<FormData>
 * @example
 * let formParser = new FormParser(formData);
 * // Retrieves the "username" field as a string.
 * formParser.getString("username");
 * // Returns true if "subscribe" is "on" (checkbox checked).
 * formParser.getBoolean("subscribe");
 * // Retrieves the "avatar" field as a File object.
 * formParser.getFile("avatar");
 * // Retrieves multiple "hobbies" values as strings.
 * formParser.getStringArray("hobbies");
 */
export class FormParser extends Parser<FormData> {
	public has(key: string): boolean {
		return this.value.has(key);
	}

	public get(key: string): unknown {
		let value = this.value.get(key);
		if (!value) throw new Parser.MissingKeyError(key);
		return value;
	}

	public getAll(key: string) {
		let list = this.value.getAll(key);
		if (!list) throw new Parser.MissingKeyError(key);
		return list;
	}

	/**
	 * Returns `true` if the value is `"on"`, otherwise `false`.
	 */
	public getBoolean(key: string): boolean {
		if (!this.has(key)) return false;
		let value = this.getString(key);
		return value === "on";
	}

	public getString(key: string): string {
		let value = this.get(key);
		if (typeof value === "string") return value;
		throw new Parser.InvalidTypeError(key, "string", typeof value);
	}

	public getFile(key: string): File {
		let value = this.get(key);
		if (value instanceof File) return value;
		throw new Parser.InvalidInstanceOfError(key, "File");
	}

	public getStringArray(key: string) {
		let value = this.getAll(key);
		return value.filter((v) => typeof v === "string");
	}

	public getFileArray(key: string) {
		let value = this.getAll(key);
		return value.filter((v) => v instanceof File);
	}
}
