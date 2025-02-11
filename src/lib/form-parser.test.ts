import { describe, expect, test } from "bun:test";

import { FormParser } from "./form-parser.js";

describe(FormParser.name, () => {
	test("#constructor accepts a FormData", () => {
		let formData = new FormData();
		formData.set("name", "Alice");

		let parser = new FormParser(formData);

		expect(parser).toBeInstanceOf(FormParser);
	});

	test("#has", () => {
		let formData = new FormData();
		formData.set("name", "Alice");

		let parser = new FormParser(formData);

		expect(parser.has("name")).toBe(true);
		expect(parser.has("age")).toBe(false);
	});

	test("#string", () => {
		let formData = new FormData();
		formData.set("name", "Alice");

		let parser = new FormParser(formData);

		expect(parser.string("name")).toBe("Alice");
	});

	test("#string throw if the key is missing", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		expect(() => parser.string("name")).toThrow('Key "name" does not exist');
	});

	test("#string throw if the value is not a string", () => {
		let formData = new FormData();
		formData.set("name", new File([], "file.txt"));

		let parser = new FormParser(formData);

		expect(() => parser.string("name")).toThrow(
			'Key "name" expected string but got object',
		);
	});

	test("#boolean", () => {
		let formData = new FormData();
		formData.set("active", "on");

		let parser = new FormParser(formData);

		expect(parser.boolean("active")).toBe(true);
	});

	test("#boolean returns false if the key is missing", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		expect(parser.boolean("active")).toBe(false);
	});

	test("#boolean returns false if the value is not 'on'", () => {
		let formData = new FormData();
		formData.set("active", "off");

		let parser = new FormParser(formData);

		expect(parser.boolean("active")).toBe(false);
	});

	test("#file", () => {
		let file = new File([], "file.txt");

		let formData = new FormData();
		formData.set("file", file);

		let parser = new FormParser(formData);

		expect(parser.file("file")).toEqual(file);
	});

	test("#file throws if the key is missing", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		expect(() => parser.file("file")).toThrow('Key "file" does not exist');
	});

	test("#file throws if the value is not a File", () => {
		let formData = new FormData();
		formData.set("file", "file.txt");

		let parser = new FormParser(formData);

		expect(() => parser.file("file")).toThrow(
			'Key "file" expected instance of File',
		);
	});

	test("#stringArray", () => {
		let formData = new FormData();
		formData.set("names", "Alice");
		formData.append("names", "Bob");

		let parser = new FormParser(formData);

		expect(parser.stringArray("names")).toEqual(["Alice", "Bob"]);
	});

	test("#stringArray returns an empty array if the key is missing", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		expect(parser.stringArray("names")).toEqual([]);
	});

	test("#stringArray filters out non-string values", () => {
		let formData = new FormData();
		formData.set("names", "Alice");
		formData.append("names", new File([], "file.txt"));

		let parser = new FormParser(formData);

		expect(parser.stringArray("names")).toEqual(["Alice"]);
	});

	test("#fileArray", () => {
		let file1 = new File([], "file1.txt");
		let file2 = new File([], "file2.txt");

		let formData = new FormData();
		formData.set("files", file1);
		formData.append("files", file2);

		let parser = new FormParser(formData);

		expect(parser.fileArray("files")).toEqual([file1, file2]);
	});

	test("#fileArray returns an empty array if the key is missing", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		expect(parser.fileArray("files")).toEqual([]);
	});

	test("#fileArray filters out non-File values", () => {
		let file = new File([], "file.txt");

		let formData = new FormData();
		formData.set("files", file);
		formData.append("files", "file.txt");

		let parser = new FormParser(formData);

		expect(parser.fileArray("files")).toEqual([file]);
	});

	test("#number", () => {
		let formData = new FormData();
		formData.set("age", "25");

		let parser = new FormParser(formData);

		expect(parser.number("age")).toBe(25);
	});

	test("#number throws if the value can't be parsed as a number", () => {
		let formData = new FormData();
		formData.set("age", "twenty-five");

		let parser = new FormParser(formData);

		expect(() => parser.number("age")).toThrow(
			`Key "age" could not be coerced to number`,
		);
	});

	test("#set sets the value of a form field", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		parser.set("name", "Alice");
		parser.set("age", "25");

		expect(formData.get("name")).toBe("Alice");
		expect(formData.get("age")).toBe("25");
	});
});
