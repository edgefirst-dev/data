/**
 * The `Parser` class is an abstract base class designed to safely extract and
 * validate values from various structured data sources (e.g., `FormData`,
 * `URLSearchParams`, or JSON objects). It provides a set of methods to
 * access the data in a type-safe manner, ensuring that required fields are
 * present and correctly typed.
 *
 * ### Usage
 * Developers can extend the `Parser` class to create custom parsers
 * (e.g., `FormParser`, `SearchParamsParser`, `ObjectParser`) that are tailored
 * to specific data sources. Each subclass defines methods for accessing and
 * validating fields in a predictable and error-safe way.
 *
 * The primary goal is to wrap incoming data in a structured format, allowing
 * downstream consumers (like DTOs in a `Data` class) to retrieve specific
 * values without directly accessing the raw data, reducing the risk of runtime
 * errors.
 *
 * ### How It Works
 * - The `Parser` operates on a generic `value`, which can be any structured
 *   data object.
 * - Methods in subclasses are responsible for checking the existence and
 *   type of specific fields before returning their values.
 * - If a required field is missing or of an invalid type, the parser throws
 *   appropriate errors (`MissingKeyError`, `InvalidTypeError`, etc.).
 *
 * ### Error Handling
 * The `Parser` class provides several custom error types:
 * - `MissingKeyError`: Thrown when a required key is not present in the data.
 * - `InvalidTypeError`: Thrown when the type of a value does not match the expected type.
 * - `InvalidInstanceOfError`: Thrown when a value is not an instance of the expected class.
 *
 * These errors are intended to simplify debugging and ensure strict validation
 * of incoming data, which is especially useful in scenarios like form
 * submissions or query parameter parsing.
 *
 * @template T - The type of the value that the parser is operating on.
 * @constructor Accepts the value (structured data) to be parsed and validated.
 *
 * @example
 * class MyParser extends Parser<SomeValue> {
 *   public get<K extends keyof SomeValue>(key: string): SomeValue[K] {
 *     if (!(key in this.value)) throw new Parser.MissingKeyError(key);
 *     return this.value[key];
 *   }
 * }
 *
 * let parser = new MyParser(someValue);
 * parser.get("key"); // Ensure the key exists and return the value safely.
 */
export abstract class Parser<T = unknown> {
	constructor(protected value: T) {}
}

export namespace Parser {
	/**
	 * The `MissingKeyError` is thrown when an attempt is made to access a key
	 * that does not exist in the parsed data.
	 *
	 * This error is commonly used in parsers to indicate that a required field
	 * is missing from the underlying data source.
	 *
	 * @example
	 * throw new Parser.MissingKeyError("username");
	 * // Error: Key "username" does not exist
	 */
	export class MissingKeyError extends ReferenceError {
		override name = "MissingKeyError";

		/**
		 * Constructs a new `MissingKeyError` with the specified key name.
		 * @param key - The name of the missing key.
		 */
		constructor(key: string) {
			super(`Key "${key}" does not exist`);
		}
	}

	/**
	 * The `InvalidTypeError` is thrown when a value associated with a key
	 * is not of the expected type.
	 *
	 * This error helps enforce type safety in parsers by signaling when the
	 * actual type of a value differs from the expected type.
	 *
	 * @example
	 * throw new Parser.InvalidTypeError("age", "number", typeof value);
	 * // Error: Key "age" expected number but got string
	 */
	export class InvalidTypeError extends TypeError {
		override name = "InvalidTypeError";

		/**
		 * Constructs a new `InvalidTypeError` with the specified key, expected
		 * type, and actual type.
		 *
		 * @param key - The name of the key with the invalid type.
		 * @param expected - The expected type of the value.
		 * @param actual - The actual type of the value.
		 */
		constructor(key: string, expected: string, actual: string) {
			super(`Key "${key}" expected ${expected} but got ${actual}`);
		}
	}

	/**
	 * The `InvalidInstanceOfError` is thrown when a value associated with a key
	 * is not an instance of the expected class or constructor.
	 *
	 * This error is useful when checking for object instances (e.g., `Date`,
	 * `File`) and enforcing that the value matches the expected class.
	 *
	 * @example
	 * throw new Parser.InvalidInstanceOfError("createdAt", "Date");
	 * // Error: Key "createdAt" expected instance of Date
	 */
	export class InvalidInstanceOfError extends Error {
		override name = "InvalidInstanceOfError";

		/**
		 * Constructs a new `InvalidInstanceOfError` with the specified key and
		 * expected instance type.
		 *
		 * @param key - The name of the key with the invalid instance.
		 * @param expected - The expected class or constructor name.
		 */
		constructor(key: string, expected: string) {
			super(`Key "${key}" expected instance of ${expected}`);
		}
	}
}
