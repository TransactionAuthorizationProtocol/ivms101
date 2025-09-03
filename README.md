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

## Property-Based Testing with Fast-Check Arbitraries

This library includes comprehensive [fast-check](https://github.com/dubzzz/fast-check) arbitraries for generating valid IVMS101 data structures for property-based testing. These arbitraries can generate realistic test data for both IVMS101 2020 and 2023 versions.

### Installation for Testing

```bash
npm install --save-dev fast-check
```

### Basic Usage

```typescript
import { arbitraries } from 'ivms101';
import * as fc from 'fast-check';

// Generate random IVMS101 2020 data samples
const samples2020 = fc.sample(arbitraries.ivms101_2020(), 5);

// Generate random IVMS101 2023 data samples  
const samples2023 = fc.sample(arbitraries.ivms101_2023Valid(), 5);

// Generate random natural person data
const personSamples = fc.sample(arbitraries.naturalPerson(), 10);
```

### Property-Based Testing Examples

```typescript
import { arbitraries } from 'ivms101';
import * as fc from 'fast-check';
import { convertTo2023, convertFrom2023, validateIVMS101 } from 'ivms101';

describe('IVMS101 Property Tests', () => {
  it('should validate all generated IVMS101 data', () => {
    fc.assert(fc.property(arbitraries.ivms101_2020(), (data) => {
      // All generated data should pass validation
      expect(() => validateIVMS101(data)).not.toThrow();
    }));
  });

  it('should preserve data through roundtrip conversion', () => {
    fc.assert(fc.property(arbitraries.ivms101_2020(), (original) => {
      const converted = convertTo2023(original);
      const backConverted = convertFrom2023(converted);
      
      // Essential data should be preserved
      expect(backConverted.originator.originatorPersons.length)
        .toBe(original.originator.originatorPersons.length);
    }));
  });

  it('should generate valid person names', () => {
    fc.assert(fc.property(arbitraries.naturalPerson(), (person) => {
      // All generated persons should have at least one name
      expect(person.name.length).toBeGreaterThan(0);
      
      // Names should not be empty strings
      person.name.forEach(nameId => {
        expect(nameId.primaryIdentifier.trim().length).toBeGreaterThan(0);
      });
    }));
  });
});
```

### Available Arbitraries

#### Basic Types
- `naturalPersonNameTypeCode()` - Generate name type codes for natural persons
- `legalPersonNameTypeCode()` - Generate name type codes for legal persons  
- `addressTypeCode()` - Generate address type codes
- `countryCode()` - Generate ISO country codes
- `nationalIdentifierTypeCode()` - Generate national identifier types
- `transliterationMethodCode()` - Generate transliteration method codes

#### String Types
- `personName()` - Generate realistic person names
- `identifier()` - Generate identifiers (customer numbers, etc.)
- `addressComponent()` - Generate address components
- `date()` - Generate valid date strings (YYYY-MM-DD format)

#### Structured Types
- `naturalPersonNameId()` - Generate natural person name objects
- `legalPersonNameId()` - Generate legal person name objects
- `address()` - Generate complete address objects
- `naturalPersonNationalIdentification()` - Generate national ID for natural persons
- `legalEntityNationalIdentification()` - Generate national ID for legal entities

#### Person Types
- `naturalPerson()` - Generate complete natural person objects
- `legalPerson()` - Generate complete legal person objects  
- `person()` - Generate person objects (either natural or legal)
- `naturalPerson2023()` - Generate 2023-format natural persons
- `legalPerson2023()` - Generate 2023-format legal persons
- `person2023()` - Generate 2023-format person objects

#### Complete Structures
- `originator()` - Generate originator objects (2020 format)
- `beneficiary()` - Generate beneficiary objects (2020 format)
- `originator2023()` - Generate originator objects (2023 format)  
- `beneficiary2023()` - Generate beneficiary objects (2023 format)
- `transferPath()` - Generate transfer path objects
- `payloadMetadata()` - Generate payload metadata (2020 format)
- `payloadMetadata2023()` - Generate payload metadata (2023 format)

#### Full IVMS101 Objects
- `ivms101_2020()` - Generate complete IVMS101 2020 objects
- `ivms101_2023()` - Generate complete IVMS101 2023 objects
- `ivms101_2023Valid()` - Generate 2023 objects with guaranteed version detection
- `ivms101()` - Generate either 2020 or 2023 objects randomly

### Advanced Testing Patterns

#### Testing Conversion Logic
```typescript
fc.assert(fc.property(arbitraries.ivms101_2020(), (data2020) => {
  const converted2023 = convertTo2023(data2020);
  
  // Field name changes should be handled correctly
  expect(converted2023.originator.originatorPerson).toBeDefined();
  expect((converted2023.originator as any).originatorPersons).toBeUndefined();
  
  // Data should be preserved
  expect(converted2023.originator.originatorPerson.length)
    .toBe(data2020.originator.originatorPersons.length);
}));
```

#### Testing Business Rules
```typescript
fc.assert(fc.property(arbitraries.naturalPerson(), (person) => {
  // Business rule: persons must have valid identification
  if (person.nationalIdentification) {
    const validTypes = ["ARNU", "CCPT", "DRLC", "FIIN", "TXID", "SOCS", "IDCD", "MISC"];
    expect(validTypes).toContain(person.nationalIdentification.nationalIdentifierType);
  }
}));
```

#### Testing Data Serialization
```typescript
fc.assert(fc.property(arbitraries.ivms101_2020(), (data) => {
  // Test JSON serialization roundtrip
  const serialized = JSON.stringify(data);
  const deserialized = JSON.parse(serialized);
  
  expect(deserialized).toEqual(data);
}));
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
