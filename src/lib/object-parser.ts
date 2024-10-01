import { Parser } from "./parser.js";

export namespace ObjectParser {
	export type Key = string | number | symbol;
}

/**
 * The `ObjectParser` is a specialized parser designed to safely access and
 * validate values within a plain JavaScript object. It provides type-safe
 * methods for retrieving values of various types (strings, numbers, arrays,
 * etc.), ensuring that required fields are present and correctly typed.
 *
 * This parser is useful in scenarios where you need to interact with complex
 * objects and ensure the presence and type correctness of specific keys, such
 * as when dealing with parsed JSON or other data structures.
 *
 * ### Usage
 * `ObjectParser` wraps a generic object and provides methods to:
 * - Check if a key exists (`has`).
 * - Retrieve values of specific types (`string`, `number`, `array`, etc.).
 * - Handle complex nested objects by returning new `ObjectParser` instances.
 * - Validate the type or instance of an object field.
 *
 * It also throws custom errors (`MissingKeyError`, `InvalidTypeError`,
 * `InvalidInstanceOfError`) to handle validation issues, making debugging
 * easier.
 *
 * ### How It Works
 * - Methods like `string`, `number`, and `array` enforce the type
 *   correctness of the retrieved values.
 * - For nested objects, the `object` method returns a new `ObjectParser`
 *   instance, allowing safe and structured access to deeply nested data.
 * - The `instanceOf` method ensures that an object is an instance of the
 *   specified constructor, which is useful for retrieving specific types like `Date`.
 *
 * @extends Parser<object>
 *
 * @example
 * let data = {
 *   username: "John",
 *   age: 30,
 *   active: true,
 *   metadata: { role: "admin" }
 * };
 * let parser = new ObjectParser(data);
 *
 * parser.string("username"); // "John"
 * parser.number("age"); // 30
 * parser.getBoolean("active"); // true
 * parser.object("metadata").string("role"); // "admin"
 */
export class ObjectParser extends Parser<object> {
	constructor(data: unknown) {
		if (typeof data !== "object" || data === null) {
			throw new Parser.InvalidTypeError("object", "object", typeof data);
		}

		super(data);
	}

	/**
	 * Checks if the given key exists in the object.
	 *
	 * @param key - The key to check.
	 * @returns `true` if the key exists, otherwise `false`.
	 */
	public has(key: ObjectParser.Key): boolean {
		return key in this.value;
	}

	/**
	 * Retrieves the value associated with the specified key.
	 *
	 * @param key - The key to retrieve the value for.
	 * @throws {Parser.MissingKeyError} If the key is missing.
	 * @returns The value associated with the key.
	 */
	public get<O = unknown>(key: ObjectParser.Key): O {
		if (this.value && typeof this.value === "object" && key in this.value) {
			return (this.value as Record<ObjectParser.Key, unknown>)[key] as O;
		}

		throw new Parser.MissingKeyError(String(key));
	}

	/**
	 * Retrieves the type of the value associated with the specified key.
	 *
	 * @param key - The key to check the type for.
	 * @returns The type of the value as a string (e.g., "string", "number").
	 */
	public typeOf(key: ObjectParser.Key) {
		return typeof this.get(key);
	}

	/**
	 * Retrieves the value associated with the key as a string.
	 *
	 * @param key - The key to retrieve the string value for.
	 * @throws {Parser.InvalidTypeError} If the value is not a string.
	 * @returns The string value.
	 */
	public string(key: ObjectParser.Key): string {
		let value = this.get(key);
		if (typeof value === "string") return value;
		throw new Parser.InvalidTypeError(String(key), "string", typeof value);
	}

	/**
	 * Retrieves the value associated with the key as a number.
	 *
	 * @param key - The key to retrieve the number value for.
	 * @throws {Parser.InvalidTypeError} If the value is not a number.
	 * @returns The number value.
	 */
	public number(key: ObjectParser.Key): number {
		let value = this.get(key);
		if (typeof value === "number") return value;
		throw new Parser.InvalidTypeError(String(key), "number", typeof value);
	}

	/**
	 * Retrieves the value associated with the key as a boolean.
	 *
	 * @param key - The key to retrieve the boolean value for.
	 * @throws {Parser.InvalidTypeError} If the value is not a boolean.
	 * @returns The boolean value.
	 */
	public boolean(key: ObjectParser.Key): boolean {
		let value = this.get(key);
		if (typeof value === "boolean") return value;
		throw new Parser.InvalidTypeError(String(key), "boolean", typeof value);
	}

	/**
	 * Retrieves the value associated with the key as an `ObjectParser` for nested object access.
	 *
	 * @param key - The key to retrieve the object value for.
	 * @throws {Parser.InvalidTypeError} If the value is not an object.
	 * @returns A new `ObjectParser` instance for the nested object.
	 */
	public object(key: ObjectParser.Key): ObjectParser {
		let value = this.get(key);
		if (typeof value === "object" && value !== null) {
			return new ObjectParser(value);
		}
		throw new Parser.InvalidTypeError(String(key), "object", typeof value);
	}

	/**
	 * Retrieves the value associated with the key as an array.
	 *
	 * @param key - The key to retrieve the array for.
	 * @throws {Parser.InvalidTypeError} If the value is not an array.
	 * @returns The array value.
	 */
	public array(key: ObjectParser.Key) {
		let value = this.get(key);
		if (Array.isArray(value)) return value;
		throw new Parser.InvalidTypeError(String(key), "array", typeof value);
	}

	/**
	 * Retrieves the value associated with the key as a `bigint`.
	 *
	 * @param key - The key to retrieve the bigint value for.
	 * @throws {Parser.InvalidTypeError} If the value is not a `bigint`.
	 * @returns The `bigint` value.
	 */
	public bigint(key: ObjectParser.Key): bigint {
		let value = this.get(key);
		if (typeof value === "bigint") return value;
		throw new Parser.InvalidTypeError(String(key), "bigint", typeof value);
	}

	/**
	 * Retrieves the value associated with the key as a function.
	 *
	 * @param key - The key to retrieve the function for.
	 * @throws {Parser.InvalidTypeError} If the value is not a function.
	 * @returns The function value.
	 */
	// biome-ignore lint/complexity/noBannedTypes: We need to use that type
	public function(key: ObjectParser.Key): Function {
		let value = this.get(key);
		if (typeof value === "function") return value;
		throw new Parser.InvalidTypeError(String(key), "function", typeof value);
	}

	/**
	 * Retrieves the value associated with the key as a symbol.
	 *
	 * @param key - The key to retrieve the symbol for.
	 * @throws {Parser.InvalidTypeError} If the value is not a symbol.
	 * @returns The symbol value.
	 */
	public symbol(key: ObjectParser.Key): symbol {
		let value = this.get(key);
		if (typeof value === "symbol") return value;
		throw new Parser.InvalidTypeError(String(key), "symbol", typeof value);
	}

	/**
	 * Checks if the value associated with the key is `null`.
	 *
	 * @param key - The key to check.
	 * @returns `true` if the value is `null`, otherwise `false`.
	 */
	public isNull(key: ObjectParser.Key): boolean {
		return this.get(key) === null;
	}

	/**
	 * Checks if the value associated with the key is `undefined`.
	 *
	 * @param key - The key to check.
	 * @returns `true` if the value is `undefined`, otherwise `false`.
	 */
	public isUndefined(key: ObjectParser.Key): boolean {
		return this.get(key) === undefined;
	}

	/**
	 * Retrieves the value associated with the key as a `Date` object.
	 *
	 * @param key - The key to retrieve the `Date` for.
	 * @throws {Parser.InvalidInstanceOfError} If the value is not a `Date` instance.
	 * @returns The `Date` value.
	 */
	public date(key: ObjectParser.Key): Date {
		return this.instanceOf(key, Date);
	}

	/**
	 * Access a value from the object as an instance of the provided constructor.
	 *
	 * @param key - The key to retrieve the instance for.
	 * @param ctor - The constructor function to check the instance against.
	 * @throws {Parser.InvalidInstanceOfError} If the value is not an instance of the provided constructor.
	 * @returns The value as an instance of the provided constructor.
	 */
	public instanceOf<I>(
		key: ObjectParser.Key,
		// biome-ignore lint/suspicious/noExplicitAny: This is needed
		ctor: new (...args: any[]) => I,
	): I {
		let value = this.get(key);
		if (value instanceof ctor) return value;
		throw new Parser.InvalidInstanceOfError(String(key), ctor.name);
	}
}
