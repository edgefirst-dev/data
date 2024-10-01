import { describe, expect, test } from "bun:test";

import { ObjectParser } from "./object-parser.js";

describe(ObjectParser.name, () => {
	test("#constructor accepts an object", () => {
		let object = { name: "Alice" };

		let parser = new ObjectParser(object);

		expect(parser).toBeInstanceOf(ObjectParser);
	});

	test("#has", () => {
		let object = { name: "Alice" };

		let parser = new ObjectParser(object);

		expect(parser.has("name")).toBe(true);
		expect(parser.has("age")).toBe(false);
	});

	test("#get throw if the key is missing", () => {
		let object = {};

		let parser = new ObjectParser(object);

		expect(() => parser.get("name")).toThrow('Key "name" does not exist');
	});

	test("#typeOf", () => {
		let object = {
			name: "Alice",
			age: 20,
			active: true,
		};

		let parser = new ObjectParser(object);

		expect(parser.typeOf("name")).toBe("string");
		expect(parser.typeOf("age")).toBe("number");
		expect(parser.typeOf("active")).toBe("boolean");
	});

	test("#string", () => {
		let object = { name: "Alice" };

		let parser = new ObjectParser(object);

		expect(parser.string("name")).toBe("Alice");
	});

	test("#string throw if the value is not a string", () => {
		let object = { name: 123 };

		let parser = new ObjectParser(object);

		expect(() => parser.string("name")).toThrow(
			'Key "name" expected string but got number',
		);
	});

	test("#number", () => {
		let object = { age: 20 };

		let parser = new ObjectParser(object);

		expect(parser.number("age")).toBe(20);
	});

	test("#number throw if the value is not a number", () => {
		let object = { age: "twenty" };

		let parser = new ObjectParser(object);

		expect(() => parser.number("age")).toThrow(
			'Key "age" expected number but got string',
		);
	});

	test("#boolean", () => {
		let object = { active: true };

		let parser = new ObjectParser(object);

		expect(parser.boolean("active")).toBe(true);
	});

	test("#boolean throw if the value is not a boolean", () => {
		let object = { active: "true" };

		let parser = new ObjectParser(object);

		expect(() => parser.boolean("active")).toThrow(
			'Key "active" expected boolean but got string',
		);
	});

	test("#object", () => {
		let object = { user: { name: "Alice" } };

		let parser = new ObjectParser(object);

		expect(parser.object("user")).toBeInstanceOf(ObjectParser);
	});

	test("#object throw if the value is not an object", () => {
		let object = { user: "Alice" };

		let parser = new ObjectParser(object);

		expect(() => parser.object("user")).toThrow(
			'Key "user" expected object but got string',
		);
	});

	test("#array", () => {
		let object = { names: ["Alice", "Bob"] };

		let parser = new ObjectParser(object);

		expect(parser.array("names")).toEqual(["Alice", "Bob"]);
	});

	test("#array throw if the value is not an array", () => {
		let object = { names: "Alice" };

		let parser = new ObjectParser(object);

		expect(() => parser.array("names")).toThrow(
			'Key "names" expected array but got string',
		);
	});

	test("#bigint", () => {
		let object = { id: BigInt(123) };

		let parser = new ObjectParser(object);

		expect(parser.bigint("id")).toBe(BigInt(123));
	});

	test("#bigint throw if the value is not a bigint", () => {
		let object = { id: 123 };

		let parser = new ObjectParser(object);

		expect(() => parser.bigint("id")).toThrow(
			'Key "id" expected bigint but got number',
		);
	});

	test("#function", () => {
		let object = { greet: () => "Hello" };

		let parser = new ObjectParser(object);

		expect(parser.function("greet")).toBeInstanceOf(Function);
	});

	test("#function throw if the value is not a function", () => {
		let object = { greet: "Hello" };

		let parser = new ObjectParser(object);

		expect(() => parser.function("greet")).toThrow(
			'Key "greet" expected function but got string',
		);
	});

	test("#symbol", () => {
		let object = { symbol: Symbol.for("symbol") };

		let parser = new ObjectParser(object);

		expect(parser.symbol("symbol")).toBe(Symbol.for("symbol"));
	});

	test("#symbol throw if the value is not a symbol", () => {
		let object = { symbol: "symbol" };

		let parser = new ObjectParser(object);

		expect(() => parser.symbol("symbol")).toThrow(
			'Key "symbol" expected symbol but got string',
		);
	});

	test("#isNull", () => {
		let object = { name: null };

		let parser = new ObjectParser(object);

		expect(parser.isNull("name")).toBe(true);
	});

	test("#isNull returns false if the key is not null", () => {
		let object = { name: "Alice" };

		let parser = new ObjectParser(object);

		expect(parser.isNull("name")).toBe(false);
	});

	test("#isUndefined", () => {
		let object = { name: undefined };

		let parser = new ObjectParser(object);

		expect(parser.isUndefined("name")).toBe(true);
	});

	test("#isUndefined returns false if the key is not undefined", () => {
		let object = { name: "Alice" };

		let parser = new ObjectParser(object);

		expect(parser.isUndefined("name")).toBe(false);
	});

	test("#date", () => {
		let object = { createdAt: new Date() };

		let parser = new ObjectParser(object);

		expect(parser.date("createdAt")).toBeInstanceOf(Date);
	});

	test("#date throw if the value is not a date", () => {
		let object = { createdAt: "2021-10-20" };

		let parser = new ObjectParser(object);

		expect(() => parser.date("createdAt")).toThrow(
			'Key "createdAt" expected instance of Date',
		);
	});

	test("#instanceOf", () => {
		let object = { createdAt: new Intl.DateTimeFormat() };

		let parser = new ObjectParser(object);

		expect(parser.instanceOf("createdAt", Intl.DateTimeFormat)).toBeInstanceOf(
			Intl.DateTimeFormat,
		);

		expect(() => parser.instanceOf("createdAt", Array)).toThrow(
			'Key "createdAt" expected instance of Array',
		);
	});

	test("#instanceOf throw if the value is not an instance of the constructor", () => {
		let object = { createdAt: new Date() };

		let parser = new ObjectParser(object);

		expect(() => parser.instanceOf("createdAt", Intl.DateTimeFormat)).toThrow(
			'Key "createdAt" expected instance of DateTimeFormat',
		);
	});
});
