# @edgefirst-dev/data

A TypeScript utility library for safely parsing and handling structured data from various sources such as `FormData`, `URLSearchParams`, JSON objects, and more. The `Data` class provides a structured way to define Data Transfer Objects (DTOs), while specialized parsers allow for type-safe access to form fields, URL search parameters, and generic objects.

## Installation

```sh
bun add @edgefirst-dev/data
```

## Usage

### Importing

To use the `Data` class, import it from the package root:

```ts
import { Data } from "@edgefirst-dev/data";
```

To use the `Parser` base class or one of the specialized parsers (`FormParser`, `SearchParamsParser`, `ObjectParser`), import them from the `parser` module:

```ts
import {
  Parser,
  FormParser,
  SearchParamsParser,
  ObjectParser,
} from "@edgefirst-dev/data/parser";
```

## Data Class

The `Data` class is designed to define a set of properties that can be parsed from a source like `FormData`, `URLSearchParams`, or a JSON object. You subclass `Data` to define specific DTOs, using a parser to extract and validate values.

### Example

```ts
import { Data } from "@edgefirst-dev/data";
import { FormParser } from "@edgefirst-dev/data/parser";

class LoginData extends Data<FormParser> {
  get username() {
    return this.parser.string("username");
  }

  get password() {
    return this.parser.string("password");
  }
}

const formData = new FormData();
formData.append("username", "johndoe");
formData.append("password", "secret");

const loginData = new LoginData(new FormParser(formData));

console.log(loginData.username); // "johndoe"
console.log(loginData.password); // "secret"
```

## Parser Classes

### Parser Base Class

The `Parser` class is an abstract base class designed for parsing and validating data from structured sources. Specialized parsers extend this class to handle specific data types, ensuring type-safe access to required fields.

### FormParser

`FormParser` is a specialized parser that wraps `FormData` and provides methods to access form fields in a safe and type-validated way.

#### Example

```ts
import { FormParser } from "@edgefirst-dev/data/parser";

const formData = new FormData();
formData.append("username", "johndoe");

const parser = new FormParser(formData);

console.log(parser.string("username")); // "johndoe"
```

### SearchParamsParser

`SearchParamsParser` extracts and validates URL query parameters from a `URLSearchParams` object, `URL`, `Request`, or URL string.

#### Example

```ts
import { SearchParamsParser } from "@edgefirst-dev/data/parser";

const url = new URL("https://example.com/?search=query");
const parser = new SearchParamsParser(url);

console.log(parser.get("search")); // "query"
```

### ObjectParser

`ObjectParser` safely accesses and validates values within a plain JavaScript object, ensuring type correctness for the retrieved values.

#### Example

```ts
import { ObjectParser } from "@edgefirst-dev/data/parser";

const data = { name: "Alice", age: 30 };
const parser = new ObjectParser(data);

console.log(parser.string("name")); // "Alice"
console.log(parser.number("age")); // 30
```

## Error Handling

All parser classes throw specialized errors when validation fails:

- `Parser.MissingKeyError`: Thrown when a required key is missing.
- `Parser.InvalidTypeError`: Thrown when a value is not of the expected type.
- `Parser.InvalidInstanceOfError`: Thrown when a value is not an instance of the expected class.
- `Parser.CoercionError`: Thrown when a value cannot be coerced to the expected type.

And each one extends the base `Parser.Error` class, so you can catch all parser errors with a single `instanceof` condition.

### Example

```ts
import { ObjectParser } from "@edgefirst-dev/data/parser";

try {
  const data = { name: "Alice", age: 30 };
  const parser = new ObjectParser(data);
  console.log(parser.string("email")); // Throws Parser.MissingKeyError
} catch (error) {
  if (error instanceof Parser.MissingKeyError) {
    // Handle missing key error
  }
  if (error instanceof Parser.Error) {
    // Handle other parser errors
  }
  throw error; // Re-throw unexpected errors
}
```

## License

See [LICENSE](./LICENSE)

## Author

- [Sergio Xalambrí](https://sergiodxa.com)
