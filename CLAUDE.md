# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Build**: `npm run build` - Uses tsup to build CommonJS and ESM distributions with TypeScript declarations
- **Test**: `npm run test` - Runs tests using vitest
- **Lint**: `npm run lint` - Runs biome linter
- **Format**: `npm run format` - Formats code using biome
- **Fix**: `npm run fix` - Auto-fixes linting and formatting issues

## Architecture

This is a TypeScript library providing type definitions, validation, and conversion utilities for IVMS101 (interVASP Messaging Standard). The library **defaults to IVMS101.2023** with legacy 2020 support available via submodule import.

### Core Structure

- **`src/core.ts`** - Shared base types, enums, and interfaces used by both versions
- **`src/countries.ts`** - ISO country code definitions
- **`src/ivms101_2023.ts`** - Complete type definitions for IVMS101.2023 (depends only on core)
- **`src/ivms101_2020.ts`** - Complete type definitions for IVMS101 2020 (depends only on core)
- **`src/validator.ts`** - Zod-based validation schemas with all IVMS101 constraints (C1-C12)
- **`src/converter.ts`** - Bidirectional conversion functions between versions
- **`src/arbitraries.ts`** - Fast-check arbitraries for property-based testing
- **`src/index.ts`** - Main entry point (exports 2023 types by default)
- **`src/legacy.ts`** - Legacy entry point (exports 2020 types and converters)

### Dependency Architecture

```
countries.ts (no dependencies)
    ↓
core.ts (depends on: countries.ts)
    ↓
    ├── ivms101_2023.ts (depends only on core.ts)
    └── ivms101_2020.ts (depends only on core.ts)
        ↓
    converter.ts (depends on both version files)
    validator.ts (depends on both version files)
    arbitraries.ts (depends on both version files)
        ↓
    ├── index.ts (main export - 2023 only)
    └── legacy.ts (legacy export - 2020 support)
```

**Key principle**: The 2020 and 2023 type definitions are **completely independent** of each other. Both depend only on shared core types.

### Public API

**Default (2023-first):**
```typescript
import { validate, type IVMS101, type NaturalPerson } from 'ivms101'
// All exports are IVMS101.2023 by default
```

**Legacy (2020 support):**
```typescript
import { IVMS101_2020 } from 'ivms101/legacy'
import { validate } from 'ivms101'
// Access 2020 types and conversion utilities
```

### Key Concepts

**Version Detection**: `ivms101_version()` automatically detects which version based on `payloadMetadata.payloadVersion` field

**Validation**: `validate(data, { version?: '2020' | '2023' })` validates data against the spec (defaults to 2023)

**Conversion**: `ensureVersion(version, data)` converts data to desired version (defaults to 2023)

### Version Differences (2020 → 2023)

Field name changes:
- `originatorPersons` → `originatorPerson` (singular)
- `beneficiaryPersons` → `beneficiaryPerson` (singular)
- `customerNumber` → `customerIdentification` (both person types)
- `nameIdentifierType` → `naturalPersonNameIdentifierType` (natural persons only)

New fields in 2023:
- `payloadMetadata.payloadVersion` (required)

### Validation Constraints

The library implements all 12 IVMS101 specification constraints:
- **C1**: OriginatorInformationNaturalPerson
- **C2**: DateInPast
- **C4**: OriginatorInformationLegalPerson
- **C5**: LegalNamePresentLegalPerson
- **C6**: LegalNamePresentNaturalPerson
- **C8**: ValidAddress
- **C9**: CompleteNationalIdentifierLegalPerson
- **C10**: RegistrationAuthority format
- **C11**: ValidLEI format
- **C12**: sequentialIntegrity (transfer paths)

### Testing

Tests use vitest with property-based testing via fast-check:
- `test/converter.test.ts` - Conversion accuracy and roundtrip tests
- `test/validator.test.ts` - Validation constraint tests
- `test/arbitraries.test.ts` - Arbitrary generator tests
- `test/arbitrary-validation.test.ts` - Comprehensive validation tests

All generated data is 100% IVMS101-compliant.
