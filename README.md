# IVMS101 TypeScript Library

This library provides TypeScript type definitions and conversion utilities for the IVMS101 (interVASP Messaging Standard) in both its original 2020 version and the updated 2023 version.

## Features

- Type definitions for IVMS101 2020 and 2023 versions
- Conversion functions between 2020 and 2023 formats
- Version detection and automatic conversion
- Runtime validation using Zod schemas

## Installation

```bash
npm install ivms101
```

## Usage

### Importing

```typescript
import { IVMS101, ensureVersion, PayloadVersionCode } from 'ivms101';
```

### Converting between versions

```typescript
import { IVMS101, ensureVersion, PayloadVersionCode } from 'ivms101';

// Assuming you have some IVMS101 data
const ivmsData: IVMS101 = { /* ... */ };

// Convert to 2023 version (default)
const ivms2023 = ensureVersion(ivmsData); // Defaults to 2023 version
// Or explicitly specify version
const ivms2023Explicit = ensureVersion(PayloadVersionCode.V2023, ivmsData);

// Convert to 2020 version
const ivms2020 = ensureVersion(PayloadVersionCode.V2020, ivmsData);
```

### Type Checking

The library provides type definitions for both versions, allowing for type-safe usage in TypeScript projects.

```typescript
import { IVMS101_2020, IVMS101_2023 } from 'ivms101';

function processIVMS101(data: IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101) {
  // Process the data...
}
```

### Runtime Validation

Use Zod schemas for runtime validation of IVMS101 data:

```typescript
import { 
  validateIVMS101, 
  isValidIVMS101, 
  isValidIVMS101_2020, 
  isValidIVMS101_2023,
  IVMS101Schema,
  IVMS101_2020Schema,
  IVMS101_2023Schema 
} from 'ivms101';

// Validate and parse data (throws on invalid data)
const validData = validateIVMS101(unknownData);

// Type guards for version checking
if (isValidIVMS101_2020(data)) {
  // data is now typed as IVMS101_2020.IVMS101
}

if (isValidIVMS101_2023(data)) {
  // data is now typed as IVMS101_2023.IVMS101
}

// Check if data is valid (returns boolean)
const isValid = isValidIVMS101(data);

// Use schemas directly for more control
const result = IVMS101Schema.safeParse(data);
if (result.success) {
  console.log('Valid data:', result.data);
} else {
  console.log('Validation errors:', result.error.issues);
}
```

## API Reference

### `ensureVersion(version?: PayloadVersionCode, data: IVMS101): IVMS101`

Converts the given IVMS101 data to the specified version. Defaults to 2023 version if no version is specified.

### `ivms101_version(data: IVMS101): PayloadVersionCode`

Detects the version of the given IVMS101 data.

### `convertTo2023(data: IVMS101_2020.IVMS101): IVMS101_2023.IVMS101`

Converts IVMS101 2020 data to 2023 format.

### `convertFrom2023(data: IVMS101_2023.IVMS101): IVMS101_2020.IVMS101`

Converts IVMS101 2023 data back to 2020 format.

## Validation API

### `validateIVMS101(data: unknown): IVMS101`

Validates and parses IVMS101 data (either version). Throws a ZodError if validation fails.

### `isValidIVMS101(data: unknown): boolean`

Type guard that returns true if data is valid IVMS101 (either version).

### `isValidIVMS101_2020(data: unknown): boolean`

Type guard that returns true if data is valid IVMS101 2020 format.

### `isValidIVMS101_2023(data: unknown): boolean`

Type guard that returns true if data is valid IVMS101 2023 format.

### Zod Schemas

- `IVMS101Schema` - Union schema for either version
- `IVMS101_2020Schema` - Schema for 2020 version only  
- `IVMS101_2023Schema` - Schema for 2023 version only

These schemas can be used directly with Zod's `.parse()`, `.safeParse()`, and other methods for more advanced validation scenarios.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
