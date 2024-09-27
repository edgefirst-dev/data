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
 * - Retrieve values of specific types (`getString`, `getNumber`, `getArray`, etc.).
 * - Handle complex nested objects by returning new `ObjectParser` instances.
 * - Validate the type or instance of an object field.
 *
 * It also throws custom errors (`MissingKeyError`, `InvalidTypeError`,
 * `InvalidInstanceOfError`) to handle validation issues, making debugging
 * easier.
 *
 * ### How It Works
 * - Methods like `getString`, `getNumber`, and `getArray` enforce the type
 *   correctness of the retrieved values.
 * - For nested objects, the `getObject` method returns a new `ObjectParser`
 *   instance, allowing safe and structured access to deeply nested data.
 * - The `getInstanceOf` method ensures that an object is an instance of the
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
 * parser.getString("username"); // "John"
 * parser.getNumber("age"); // 30
 * parser.getBoolean("active"); // true
 * parser.getObject("metadata").getString("role"); // "admin"
 */
export class ObjectParser extends Parser<object> {
	constructor(data: unknown) {
		if (typeof data !== "object" || data === null) {
			throw new Parser.InvalidTypeError("object", "object", typeof data);
		}

		super(data);
	}

	public has(key: ObjectParser.Key): boolean {
		return key in this.value;
	}

	public get<O = unknown>(key: ObjectParser.Key): O {
		if (this.value && typeof this.value === "object" && key in this.value) {
			return (this.value as Record<ObjectParser.Key, unknown>)[key] as O;
		}

		throw new Parser.MissingKeyError(String(key));
	}

	public typeOf(key: ObjectParser.Key) {
		return typeof this.get(key);
	}

	public getString(key: ObjectParser.Key): string {
		let value = this.get(key);
		if (typeof value === "string") return value;
		throw new Parser.InvalidTypeError(String(key), "string", typeof value);
	}

	public getNumber(key: ObjectParser.Key): number {
		let value = this.get(key);
		if (typeof value === "number") return value;
		throw new Parser.InvalidTypeError(String(key), "number", typeof value);
	}

	public getBoolean(key: ObjectParser.Key): boolean {
		let value = this.get(key);
		if (typeof value === "boolean") return value;
		throw new Parser.InvalidTypeError(String(key), "boolean", typeof value);
	}

	public getObject(key: ObjectParser.Key): ObjectParser {
		let value = this.get(key);
		if (typeof value === "object" && value !== null) {
			return new ObjectParser(value);
		}
		throw new Parser.InvalidTypeError(String(key), "object", typeof value);
	}

	public getArray(key: ObjectParser.Key) {
		let value = this.get(key);
		if (Array.isArray(value)) return value;
		throw new Parser.InvalidTypeError(String(key), "array", typeof value);
	}

	public getBigInt(key: ObjectParser.Key): bigint {
		let value = this.get(key);
		if (typeof value === "bigint") return value;
		throw new Parser.InvalidTypeError(String(key), "bigint", typeof value);
	}

	// biome-ignore lint/complexity/noBannedTypes: We need to use that type
	public getFunction(key: ObjectParser.Key): Function {
		let value = this.get(key);
		if (typeof value === "function") return value;
		throw new Parser.InvalidTypeError(String(key), "function", typeof value);
	}

	public getSymbol(key: ObjectParser.Key): symbol {
		let value = this.get(key);
		if (typeof value === "symbol") return value;
		throw new Parser.InvalidTypeError(String(key), "symbol", typeof value);
	}

	public isNull(key: ObjectParser.Key): boolean {
		return this.get(key) === null;
	}

	public isUndefined(key: ObjectParser.Key): boolean {
		return this.get(key) === undefined;
	}

	public getDate(key: ObjectParser.Key): Date {
		return this.getInstanceOf(key, Date);
	}

	/**
	 * Access a value from the object as an instance of the provided constructor.
	 * @throws {Parser.InvalidInstanceOfError} If the value is not an instance of the provided constructor.
	 */
	public getInstanceOf<I>(
		key: ObjectParser.Key,
		// biome-ignore lint/suspicious/noExplicitAny: This is needed
		ctor: new (...args: any[]) => I,
	): I {
		let value = this.get(key);
		if (value instanceof ctor) return value;
		throw new Parser.InvalidInstanceOfError(String(key), ctor.name);
	}
}
