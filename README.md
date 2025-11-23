# IVMS101 TypeScript Library

A TypeScript library providing type definitions, validation, and conversion utilities for the IVMS101 (interVASP Messaging Standard). **Defaults to IVMS101.2023** with full support for legacy 2020 format.

## Features

- 🎯 **2023-first API** - Modern, clean interface defaulting to the latest standard
- ✅ **Runtime validation** - Comprehensive Zod schemas with all 12 IVMS101 constraints
- 🔄 **Version conversion** - Bidirectional, lossless conversion between 2020 and 2023
- 🧪 **Property-based testing** - Fast-check arbitraries for generating compliant test data
- 📦 **Dual format** - CommonJS and ESM builds with full TypeScript support
- 🏗️ **Clean architecture** - Independent type definitions with no circular dependencies

## Installation

```bash
npm install ivms101
```

## Quick Start

### Working with IVMS101.2023 (Default)

```typescript
import { validate, type IVMS101, type NaturalPerson } from 'ivms101';

// The IVMS101 type is IVMS101.2023 by default
const data: IVMS101 = {
  originator: {
    originatorPerson: [{ /* ... */ }]  // Note: singular "Person" in 2023
  },
  beneficiary: {
    beneficiaryPerson: [{ /* ... */ }]
  },
  payloadMetadata: {
    payloadVersion: "101.2023"  // Required in 2023
  }
};

// Validate (defaults to 2023)
const validated = validate(data);

// Or explicitly specify version
const validated2023 = validate(data, { version: '2023' });
```

### Working with Legacy IVMS101 2020

```typescript
import { IVMS101_2020 } from 'ivms101/legacy';
import { validate } from 'ivms101';

const legacy: IVMS101_2020.IVMS101 = {
  originator: {
    originatorPersons: [{ /* ... */ }]  // Note: plural "Persons" in 2020
  },
  beneficiary: {
    beneficiaryPersons: [{ /* ... */ }]
  }
};

// Validate as 2020 format
const validated = validate(legacy, { version: '2020' });
```

### Converting Between Versions

```typescript
import { ensureVersion, ivms101_version, PayloadVersionCode } from 'ivms101';
import { convertTo2023, convertFrom2023 } from 'ivms101/legacy';

// Auto-detect version
const version = ivms101_version(data);

// Convert to 2023 (default)
const data2023 = ensureVersion(data);

// Convert to specific version
const data2020 = ensureVersion(PayloadVersionCode.V2020, data);

// Explicit conversions
const converted2023 = convertTo2023(data2020);
const converted2020 = convertFrom2023(data2023);
```

## API Reference

### Main Exports (2023-first)

```typescript
import {
  // Types (all are IVMS101.2023)
  type IVMS101,              // Main IVMS101 type
  type NaturalPerson,        // Natural person type
  type LegalPerson,          // Legal person type
  type Person,               // Person (natural or legal)
  type Originator,           // Originator type
  type Beneficiary,          // Beneficiary type

  // Enums
  PayloadVersionCode,        // Version codes ("101" | "101.2023")

  // Validation
  validate,                  // validate(data, { version?: '2020' | '2023' })
  IVMS101_2023Schema,        // Zod schema for 2023
  isValidIVMS101_2023,       // Type guard for 2023

  // Utilities
  ensureVersion,             // Convert to specific version (defaults to 2023)
  ivms101_version,           // Detect version

  // Testing
  arbitraries,               // Fast-check arbitraries
  Core,                      // Shared core types
} from 'ivms101';
```

### Legacy Exports (2020 support)

```typescript
import {
  // Types
  IVMS101_2020,              // Namespace with all 2020 types

  // Conversion
  convertTo2023,             // Convert 2020 → 2023
  convertFrom2023,           // Convert 2023 → 2020

  // Validation
  IVMS101_2020Schema,        // Zod schema for 2020
  isValidIVMS101_2020,       // Type guard for 2020
  IVMS101Schema,             // Union schema (2020 | 2023)
  validateIVMS101,           // Validate either version
  isValidIVMS101,            // Type guard for either version
} from 'ivms101/legacy';
```

## Validation

### Basic Validation

```typescript
import { validate } from 'ivms101';

// Validate with default version (2023)
try {
  const validated = validate(unknownData);
  console.log('Valid IVMS101.2023 data:', validated);
} catch (error) {
  console.error('Validation failed:', error.message);
}

// Validate specific version
const validated2020 = validate(data, { version: '2020' });
```

### Type Guards

```typescript
import { isValidIVMS101_2023 } from 'ivms101';
import { isValidIVMS101_2020, isValidIVMS101 } from 'ivms101/legacy';

// Check if data is valid 2023 format
if (isValidIVMS101_2023(data)) {
  // TypeScript knows data is IVMS101_2023.IVMS101
  console.log(data.originator.originatorPerson);
}

// Check if data is valid 2020 format
if (isValidIVMS101_2020(data)) {
  // TypeScript knows data is IVMS101_2020.IVMS101
  console.log(data.originator.originatorPersons);
}

// Check if data is either version
if (isValidIVMS101(data)) {
  console.log('Valid IVMS101 data (either version)');
}
```

### Schema Validation

```typescript
import { IVMS101_2023Schema } from 'ivms101';
import { IVMS101_2020Schema, IVMS101Schema } from 'ivms101/legacy';

// Safe parsing (doesn't throw)
const result = IVMS101_2023Schema.safeParse(data);
if (result.success) {
  console.log('Valid data:', result.data);
} else {
  console.log('Validation errors:', result.error.issues);
}

// Parse (throws on invalid data)
const validated = IVMS101_2023Schema.parse(data);

// Union schema for either version
const validatedAny = IVMS101Schema.parse(data);
```

## Version Differences

The 2023 version introduced several breaking changes from 2020:

| Aspect | IVMS101 2020 | IVMS101.2023 |
|--------|--------------|--------------|
| Originator field | `originatorPersons` (plural) | `originatorPerson` (singular) |
| Beneficiary field | `beneficiaryPersons` (plural) | `beneficiaryPerson` (singular) |
| Customer ID (both person types) | `customerNumber` | `customerIdentification` |
| Natural person name field | `nameIdentifierType` | `naturalPersonNameIdentifierType` |
| Payload version field | Optional | Required (`payloadMetadata.payloadVersion`) |

### Migration Example

```typescript
// 2020 format
const data2020 = {
  originator: {
    originatorPersons: [{
      naturalPerson: {
        customerNumber: "12345",
        name: {
          nameIdentifier: [{
            primaryIdentifier: "Doe",
            secondaryIdentifier: "John",
            nameIdentifierType: "LEGL"
          }]
        }
      }
    }]
  },
  // ... rest of structure
};

// 2023 format (after conversion)
const data2023 = {
  originator: {
    originatorPerson: [{
      naturalPerson: {
        customerIdentification: "12345",
        name: {
          nameIdentifier: [{
            primaryIdentifier: "Doe",
            secondaryIdentifier: "John",
            naturalPersonNameIdentifierType: "LEGL"
          }]
        }
      }
    }]
  },
  payloadMetadata: {
    payloadVersion: "101.2023"
  }
  // ... rest of structure
};
```

## Property-Based Testing

The library includes comprehensive [fast-check](https://github.com/dubzzz/fast-check) arbitraries for generating valid IVMS101 test data.

### Installation

```bash
npm install --save-dev fast-check
```

### Basic Usage

```typescript
import { arbitraries } from 'ivms101';
import * as fc from 'fast-check';

// Generate sample data
const samples2023 = fc.sample(arbitraries.ivms101_2023Valid(), 5);
const samples2020 = fc.sample(arbitraries.ivms101_2020(), 5);
const personSamples = fc.sample(arbitraries.naturalPerson(), 10);
```

### Property-Based Tests

```typescript
import { arbitraries } from 'ivms101';
import { validate } from 'ivms101';
import { convertTo2023, convertFrom2023 } from 'ivms101/legacy';
import * as fc from 'fast-check';

describe('IVMS101 Properties', () => {
  it('all generated 2023 data should be valid', () => {
    fc.assert(fc.property(arbitraries.ivms101_2023Valid(), (data) => {
      expect(() => validate(data)).not.toThrow();
    }));
  });

  it('should preserve data through roundtrip conversion', () => {
    fc.assert(fc.property(arbitraries.ivms101_2020(), (original) => {
      const converted = convertTo2023(original);
      const backConverted = convertFrom2023(converted);

      expect(backConverted.originator.originatorPersons.length)
        .toBe(original.originator.originatorPersons.length);
    }));
  });
});
```

### Available Arbitraries

#### Complete Structures
- `ivms101_2020()` - Generate IVMS101 2020 objects
- `ivms101_2023()` - Generate IVMS101 2023 objects
- `ivms101_2023Valid()` - Generate 2023 with guaranteed version field
- `ivms101()` - Generate either version randomly

#### Person Types
- `naturalPerson()` - Natural person (2020 format)
- `legalPerson()` - Legal person (2020 format)
- `person()` - Either natural or legal (2020)
- `naturalPerson2023()` - Natural person (2023 format)
- `legalPerson2023()` - Legal person (2023 format)
- `person2023()` - Either natural or legal (2023)

#### Components
- `naturalPersonNameId()` - Name identifier for natural persons
- `legalPersonNameId()` - Name identifier for legal persons
- `address()` - Complete address objects
- `naturalPersonNationalIdentification()` - National ID for natural persons
- `legalEntityNationalIdentification()` - National ID for legal entities

#### Enums & Codes
- `naturalPersonNameTypeCode()` - Name type codes
- `legalPersonNameTypeCode()` - Legal person name codes
- `addressTypeCode()` - Address type codes
- `countryCode()` - ISO country codes
- `nationalIdentifierTypeCode()` - National ID type codes
- `transliterationMethodCode()` - Transliteration codes

## Validation Constraints

The library implements all 12 IVMS101 specification constraints:

- **C1**: OriginatorInformationNaturalPerson - Must have address, customer ID, national ID, or date of birth
- **C2**: DateInPast - Birth date must be historic
- **C4**: OriginatorInformationLegalPerson - Must have address, customer ID, or national ID
- **C5**: LegalNamePresentLegalPerson - Must have at least one LEGL name type
- **C6**: LegalNamePresentNaturalPerson - Must have at least one LEGL name type
- **C8**: ValidAddress - Must have addressLine OR structured address
- **C9**: CompleteNationalIdentifierLegalPerson - Complex LEI/registrationAuthority rules
- **C10**: RegistrationAuthority format - Must match `RA[0-9]{6}`
- **C11**: ValidLEI format - Must be 20-character alphanumeric
- **C12**: sequentialIntegrity - Transfer path sequences must be sequential starting at 0

## Array Size Limits

The library enforces these limits during validation:

| Field | Maximum | Rationale |
|-------|---------|-----------|
| Originator/Beneficiary Persons | 10 | Joint accounts + margin |
| Account Numbers | 20 | Multiple corporate wallets |
| Name Identifiers (Natural) | 5 | Multiple name variants |
| Name Identifiers (Legal) | 3 | Aligns with type codes |
| Geographic Addresses | 5 | Multiple addresses |
| Transfer Path | 5 | Intermediary VASP chain |
| Transliteration Methods | 5 | Character set conversions |

## Architecture

The library follows a clean, layered architecture:

```
countries.ts ← core.ts ← ivms101_2023.ts (independent)
                      ← ivms101_2020.ts (independent)
                      ← validator.ts
                      ← converter.ts
                      ← arbitraries.ts
                      ← index.ts (2023 exports)
                      ← legacy.ts (2020 exports)
```

**Key principle**: The 2020 and 2023 type definitions are completely independent, both depending only on shared core types.

## TypeScript Support

This library is written in TypeScript and provides complete type definitions:

```typescript
import type {
  IVMS101,
  NaturalPerson,
  LegalPerson,
  Person,
  Originator,
  Beneficiary,
} from 'ivms101';

import type { IVMS101_2020 } from 'ivms101/legacy';

// Full type safety for both versions
function processData(data: IVMS101) {
  // TypeScript knows this is 2023 format
  console.log(data.originator.originatorPerson); // ✓
}

function processLegacy(data: IVMS101_2020.IVMS101) {
  // TypeScript knows this is 2020 format
  console.log(data.originator.originatorPersons); // ✓
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Related Standards

- [IVMS101 Specification](https://intervasp.org/)
- [FATF Travel Rule](https://www.fatf-gafi.org/)
