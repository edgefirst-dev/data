import type { Parser } from "./lib/parser.js";

/**
 * The `Data` class is an abstract representation of a Data Transfer Object
 * (DTO) designed to safely parse and expose data from various structured
 * sources like `FormData`, `URLSearchParams`, or JSON objects.
 *
 * Developers can extend this class to define specific DTOs that map to
 * incoming structured data, providing a type-safe way to access required
 * fields.
 *
 * ### Usage
 * `Data` is designed to be subclassed, where the subclass defines properties
 * that extract specific values from the provided `Parser`. The `Parser` is
 * responsible for retrieving values from the underlying data source (e.g.,
 * `FormData`, JSON).
 *
 * The primary goal is to standardize data access and ensure the presence of
 * required fields via the parser. This pattern is particularly useful in
 * handling form submissions (e.g., in Remix actions) by validating the
 * structure of incoming data against the defined DTO.
 *
 * ### How It Works
 * - Each getter in a subclass uses the provided `Parser` to extract a specific
 *   value from the input.
 * - The parser's methods (like `getString` or `getNumber`) ensure that the data
 *   is present and correctly typed, throwing errors if validation fails.
 * - Optional fields should be handled by checking their existence (e.g., using
 *   `parser.has()`) before accessing the value.
 *
 * @template P The type of the parser that will be used to parse the data.
 * @constructor Accepts a `Parser` which extracts the data from a source object.
 * @method toJSON Returns a JSON representation of the DTO, with all defined getter properties.
 * @example
 * class LoginData extends Data<FormParser> {
 *   get username() {
 *     return this.parser.getString("username"); // Ensures the username is defined and a string
 *   }
 *
 *   get password() {
 *     return this.parser.getString("password"); // Ensures the password is defined and a string
 *   }
 * }
 *
 * let data = new LoginData(new FormParser(formData));
 * data.username; // Access the username safely
 * data.password; // Access the password safely
 */
export abstract class Data<P extends Parser = Parser> {
	constructor(protected parser: P) {}

	/**
	 * Converts the `Data` object into a plain JSON representation, including all
	 * properties defined as getters in the subclass.
	 *
	 * The `toJSON` method dynamically identifies getter properties in the
	 * subclass and collects their values to construct a JSON object. This is
	 * particularly useful when you want to serialize the `Data` object for APIs,
	 * logging, or other use cases requiring JSON format.
	 *
	 * @returns A plain object representing the `Data` instance with all getter properties.
	 *
	 * @example
	 * class LoginData extends Data<FormParser> {
	 *   get username() {
	 *     return this.parser.getString("username");
	 *   }
	 *   get password() {
	 *     return this.parser.getString("password");
	 *   }
	 * }
	 *
	 * const loginData = new LoginData(new FormParser(formData));
	 * console.log(JSON.stringify(loginData.toJSON()));
	 * // Output: { "username": "johndoe", "password": "secret" }
	 */
	toJSON() {
		let proto = Object.getPrototypeOf(this);
		let descriptors = Object.getOwnPropertyDescriptors(proto);
		let keys = Object.keys(descriptors).filter(
			(key) => typeof descriptors[key]?.get === "function",
		);
		return keys.reduce(
			(acc, key) => {
				acc[key] = (this as Record<string, unknown>)[key];
				return acc;
			},
			{} as Record<string, unknown>,
		);
	}
}
