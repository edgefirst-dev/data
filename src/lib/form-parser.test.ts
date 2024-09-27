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

	test("#getString", () => {
		let formData = new FormData();
		formData.set("name", "Alice");

		let parser = new FormParser(formData);

		expect(parser.getString("name")).toBe("Alice");
	});

	test("#getString throw if the key is missing", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		expect(() => parser.getString("name")).toThrow('Key "name" does not exist');
	});

	test("#getString throw if the value is not a string", () => {
		let formData = new FormData();
		formData.set("name", new File([], "file.txt"));

		let parser = new FormParser(formData);

		expect(() => parser.getString("name")).toThrow(
			'Key "name" expected string but got object',
		);
	});

	test("#getBoolean", () => {
		let formData = new FormData();
		formData.set("active", "on");

		let parser = new FormParser(formData);

		expect(parser.getBoolean("active")).toBe(true);
	});

	test("#getBoolean returns false if the key is missing", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		expect(parser.getBoolean("active")).toBe(false);
	});

	test("#getBoolean returns false if the value is not 'on'", () => {
		let formData = new FormData();
		formData.set("active", "off");

		let parser = new FormParser(formData);

		expect(parser.getBoolean("active")).toBe(false);
	});

	test("#getFile", () => {
		let file = new File([], "file.txt");

		let formData = new FormData();
		formData.set("file", file);

		let parser = new FormParser(formData);

		expect(parser.getFile("file")).toEqual(file);
	});

	test("#getFile throws if the key is missing", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		expect(() => parser.getFile("file")).toThrow('Key "file" does not exist');
	});

	test("#getFile throws if the value is not a File", () => {
		let formData = new FormData();
		formData.set("file", "file.txt");

		let parser = new FormParser(formData);

		expect(() => parser.getFile("file")).toThrow(
			'Key "file" expected instance of File',
		);
	});

	test("#getStringArray", () => {
		let formData = new FormData();
		formData.set("names", "Alice");
		formData.append("names", "Bob");

		let parser = new FormParser(formData);

		expect(parser.getStringArray("names")).toEqual(["Alice", "Bob"]);
	});

	test("#getStringArray returns an empty array if the key is missing", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		expect(parser.getStringArray("names")).toEqual([]);
	});

	test("#getStringArray filters out non-string values", () => {
		let formData = new FormData();
		formData.set("names", "Alice");
		formData.append("names", new File([], "file.txt"));

		let parser = new FormParser(formData);

		expect(parser.getStringArray("names")).toEqual(["Alice"]);
	});

	test("#getFileArray", () => {
		let file1 = new File([], "file1.txt");
		let file2 = new File([], "file2.txt");

		let formData = new FormData();
		formData.set("files", file1);
		formData.append("files", file2);

		let parser = new FormParser(formData);

		expect(parser.getFileArray("files")).toEqual([file1, file2]);
	});

	test("#getFileArray returns an empty array if the key is missing", () => {
		let formData = new FormData();
		let parser = new FormParser(formData);

		expect(parser.getFileArray("files")).toEqual([]);
	});

	test("#getFileArray filters out non-File values", () => {
		let file = new File([], "file.txt");

		let formData = new FormData();
		formData.set("files", file);
		formData.append("files", "file.txt");

		let parser = new FormParser(formData);

		expect(parser.getFileArray("files")).toEqual([file]);
	});
});
