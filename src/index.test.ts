import { describe, expect, test } from "bun:test";

import { Data } from "./index.js";
import { ObjectParser } from "./lib/object-parser.js";

describe(Data.name, () => {
	class MyData extends Data<ObjectParser> {
		get name() {
			return this.parser.string("name");
		}

		get emailHost() {
			return this.parser.string("email").split("@").at(1);
		}
	}

	test("#toJSON()", () => {
		let data = new MyData(
			new ObjectParser({ name: "Alice", email: "alice@company.com" }),
		);

		expect(data.toJSON()).toEqual({ name: "Alice", emailHost: "company.com" });
	});

	test("#name", () => {
		let data = new MyData(
			new ObjectParser({ name: "Alice", email: "alice@company.com" }),
		);

		expect(data.name).toBe("Alice");
	});

	test("#emailHost", () => {
		let data = new MyData(
			new ObjectParser({ name: "Alice", email: "alice@company.com" }),
		);

		expect(data.emailHost).toBe("company.com");
	});
});
