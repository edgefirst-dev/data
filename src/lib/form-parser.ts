import { Parser } from "./parser.js";

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
 * - Methods like `string`, `file`, and `boolean` validate and return the form data in the correct type.
 * - For multiple values (e.g., checkboxes or multi-select fields), `stringArray` and `fileArray` can be used to retrieve arrays of values.
 * - Booleans are specifically treated such that a field with the value `"on"` is considered `true`, and all others are `false`.
 *
 * @extends Parser<FormData>
 * @example
 * let formParser = new FormParser(formData);
 * // Retrieves the "username" field as a string.
 * formParser.string("username");
 * // Returns true if "subscribe" is "on" (checkbox checked).
 * formParser.boolean("subscribe");
 * // Retrieves the "avatar" field as a File object.
 * formParser.file("avatar");
 * // Retrieves multiple "hobbies" values as strings.
 * formParser.stringArray("hobbies");
 */
export class FormParser extends Parser<FormData> {
	/**
	 * Checks if the given key exists in the FormData.
	 *
	 * @param key - The name of the form field.
	 * @returns `true` if the key exists, otherwise `false`.
	 */
	public has(key: string): boolean {
		return this.value.has(key);
	}

	/**
	 * Retrieves the value of the specified form field.
	 *
	 * @param key - The name of the form field.
	 * @throws {Parser.MissingKeyError} If the key is missing from the form data.
	 * @returns The value associated with the key, or throws if it doesn't exist.
	 */
	public get(key: string): unknown {
		let value = this.value.get(key);
		if (!value) throw new Parser.MissingKeyError(key);
		return value;
	}

	/**
	 * Retrieves all values associated with the specified form field as an array.
	 *
	 * @param key - The name of the form field.
	 * @throws {Parser.MissingKeyError} If the key is missing from the form data.
	 * @returns An array of values associated with the key.
	 */
	public getAll(key: string) {
		let list = this.value.getAll(key);
		if (!list) throw new Parser.MissingKeyError(key);
		return list;
	}

	/**
	 * Returns `true` if the value of the specified field is `"on"`, otherwise
	 * `false`.
	 *
	 * @param key - The name of the form field.
	 * @returns A boolean representation of the form field value.
	 */
	public boolean(key: string): boolean {
		if (!this.has(key)) return false;
		let value = this.string(key);
		return value === "on";
	}

	/**
	 * Retrieves the value of the specified form field as a string.
	 *
	 * @param key - The name of the form field.
	 * @throws {Parser.MissingKeyError} If the key is missing from the form data.
	 * @throws {Parser.InvalidTypeError} If the value is not a string.
	 * @returns The string value associated with the key.
	 */
	public string(key: string) {
		let value = this.get(key);
		if (typeof value === "string") return value;
		throw new Parser.InvalidTypeError(key, "string", typeof value);
	}

	/**
	 * Retrieves the value of the specified form field as a `File` object.
	 *
	 * @param key - The name of the form field.
	 * @throws {Parser.MissingKeyError} If the key is missing from the form data.
	 * @throws {Parser.InvalidInstanceOfError} If the value is not a `File` object.
	 * @returns The `File` object associated with the key.
	 */
	public file(key: string): File {
		let value = this.get(key);
		if (value instanceof File) return value;
		throw new Parser.InvalidInstanceOfError(key, "File");
	}

	/**
	 * Retrieves all string values associated with the specified form field as an
	 * array.
	 *
	 * @param key - The name of the form field.
	 * @returns An array of string values associated with the key.
	 */
	public stringArray(key: string) {
		let value = this.getAll(key);
		return value.filter((v) => typeof v === "string");
	}

	/**
	 * Retrieves all `File` objects associated with the specified form field as
	 * an array.
	 *
	 * @param key - The name of the form field.
	 * @returns An array of `File` objects associated with the key.
	 */
	public fileArray(key: string) {
		let value = this.getAll(key);
		return value.filter((v) => v instanceof File);
	}

	/**
	 * Retrieves the value of the specified form field as a number.
	 *
	 * @param key - The name of the form field.
	 * @throws {Parser.MissingKeyError} If the key is missing from the form data.
	 * @throws {Parser.InvalidTypeError} If the value is not a valid number.
	 * @throws {Parser.CoercionError} If the value cannot be coerced to a number.
	 * @returns The number value associated with the key.
	 */
	public number(key: string): number {
		let value = this.get(key);
		if (typeof value === "number") return value;
		if (typeof value === "string") {
			let number = Number(value);
			if (Number.isNaN(number)) throw new Parser.CoercionError(key, "number");
			return number;
		}
		throw new Parser.InvalidTypeError(key, "number", typeof value);
	}
}
