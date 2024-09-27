import { describe, expect, test } from "bun:test";

import { SearchParamsParser } from "./search-params-parser.js";

describe(SearchParamsParser.name, () => {
	test("#constructor accepts URLSearchParams", () => {
		let searchParams = new URLSearchParams("name=Alice");

		let parser = new SearchParamsParser(searchParams);

		expect(parser).toBeInstanceOf(SearchParamsParser);
	});

	test("#constructor accepts a URL", () => {
		let url = new URL("http://example.com?name=Alice");

		let parser = new SearchParamsParser(url);

		expect(parser).toBeInstanceOf(SearchParamsParser);
	});

	test("#constructor accepts a string", () => {
		let parser = new SearchParamsParser("http://example.com?name=Alice");

		expect(parser).toBeInstanceOf(SearchParamsParser);
	});

	test("#constructor accepts a Request", () => {
		let request = new Request("http://example.com?name=Alice");

		let parser = new SearchParamsParser(request);

		expect(parser).toBeInstanceOf(SearchParamsParser);
	});

	test("#has", () => {
		let searchParams = new URLSearchParams("name=Alice");

		let parser = new SearchParamsParser(searchParams);

		expect(parser.has("name")).toBe(true);
		expect(parser.has("age")).toBe(false);
	});

	test("#get", () => {
		let searchParams = new URLSearchParams("name=Alice");

		let parser = new SearchParamsParser(searchParams);

		expect(parser.get("name")).toBe("Alice");
	});

	test("#get throw if the key is missing", () => {
		let searchParams = new URLSearchParams();

		let parser = new SearchParamsParser(searchParams);

		expect(() => parser.get("name")).toThrow('Key "name" does not exist');
	});
});
