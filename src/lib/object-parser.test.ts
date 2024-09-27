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

	test("#getString", () => {
		let object = { name: "Alice" };

		let parser = new ObjectParser(object);

		expect(parser.getString("name")).toBe("Alice");
	});

	test("#getString throw if the value is not a string", () => {
		let object = { name: 123 };

		let parser = new ObjectParser(object);

		expect(() => parser.getString("name")).toThrow(
			'Key "name" expected string but got number',
		);
	});

	test("#getNumber", () => {
		let object = { age: 20 };

		let parser = new ObjectParser(object);

		expect(parser.getNumber("age")).toBe(20);
	});

	test("#getNumber throw if the value is not a number", () => {
		let object = { age: "twenty" };

		let parser = new ObjectParser(object);

		expect(() => parser.getNumber("age")).toThrow(
			'Key "age" expected number but got string',
		);
	});

	test("#getBoolean", () => {
		let object = { active: true };

		let parser = new ObjectParser(object);

		expect(parser.getBoolean("active")).toBe(true);
	});

	test("#getBoolean throw if the value is not a boolean", () => {
		let object = { active: "true" };

		let parser = new ObjectParser(object);

		expect(() => parser.getBoolean("active")).toThrow(
			'Key "active" expected boolean but got string',
		);
	});

	test("#getObject", () => {
		let object = { user: { name: "Alice" } };

		let parser = new ObjectParser(object);

		expect(parser.getObject("user")).toBeInstanceOf(ObjectParser);
	});

	test("#getObject throw if the value is not an object", () => {
		let object = { user: "Alice" };

		let parser = new ObjectParser(object);

		expect(() => parser.getObject("user")).toThrow(
			'Key "user" expected object but got string',
		);
	});

	test("#getArray", () => {
		let object = { names: ["Alice", "Bob"] };

		let parser = new ObjectParser(object);

		expect(parser.getArray("names")).toEqual(["Alice", "Bob"]);
	});

	test("#getArray throw if the value is not an array", () => {
		let object = { names: "Alice" };

		let parser = new ObjectParser(object);

		expect(() => parser.getArray("names")).toThrow(
			'Key "names" expected array but got string',
		);
	});

	test("#getBigInt", () => {
		let object = { id: BigInt(123) };

		let parser = new ObjectParser(object);

		expect(parser.getBigInt("id")).toBe(BigInt(123));
	});

	test("#getBigInt throw if the value is not a bigint", () => {
		let object = { id: 123 };

		let parser = new ObjectParser(object);

		expect(() => parser.getBigInt("id")).toThrow(
			'Key "id" expected bigint but got number',
		);
	});

	test("#getFunction", () => {
		let object = { greet: () => "Hello" };

		let parser = new ObjectParser(object);

		expect(parser.getFunction("greet")).toBeInstanceOf(Function);
	});

	test("#getFunction throw if the value is not a function", () => {
		let object = { greet: "Hello" };

		let parser = new ObjectParser(object);

		expect(() => parser.getFunction("greet")).toThrow(
			'Key "greet" expected function but got string',
		);
	});

	test("#getSymbol", () => {
		let object = { symbol: Symbol.for("symbol") };

		let parser = new ObjectParser(object);

		expect(parser.getSymbol("symbol")).toBe(Symbol.for("symbol"));
	});

	test("#getSymbol throw if the value is not a symbol", () => {
		let object = { symbol: "symbol" };

		let parser = new ObjectParser(object);

		expect(() => parser.getSymbol("symbol")).toThrow(
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

	test("#getDate", () => {
		let object = { createdAt: new Date() };

		let parser = new ObjectParser(object);

		expect(parser.getDate("createdAt")).toBeInstanceOf(Date);
	});

	test("#getDate throw if the value is not a date", () => {
		let object = { createdAt: "2021-10-20" };

		let parser = new ObjectParser(object);

		expect(() => parser.getDate("createdAt")).toThrow(
			'Key "createdAt" expected instance of Date',
		);
	});

	test("#getInstanceOf", () => {
		let object = { createdAt: new Intl.DateTimeFormat() };

		let parser = new ObjectParser(object);

		expect(
			parser.getInstanceOf("createdAt", Intl.DateTimeFormat),
		).toBeInstanceOf(Intl.DateTimeFormat);

		expect(() => parser.getInstanceOf("createdAt", Array)).toThrow(
			'Key "createdAt" expected instance of Array',
		);
	});

	test("#getInstanceOf throw if the value is not an instance of the constructor", () => {
		let object = { createdAt: new Date() };

		let parser = new ObjectParser(object);

		expect(() =>
			parser.getInstanceOf("createdAt", Intl.DateTimeFormat),
		).toThrow('Key "createdAt" expected instance of DateTimeFormat');
	});
});
