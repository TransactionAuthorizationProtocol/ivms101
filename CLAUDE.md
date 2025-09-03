# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Build**: `npm run build` - Uses tsup to build CommonJS and ESM distributions with TypeScript declarations
- **Test**: `npm run test` - Runs tests using vitest

## Architecture

This is a TypeScript library providing type definitions and conversion utilities for IVMS101 (interVASP Messaging Standard) supporting both 2020 and 2023 versions.

### Core Structure

- **`src/ivms101_2020.ts`** - Complete type definitions for IVMS101 2020 version
- **`src/ivms101_2023.ts`** - Type definitions for IVMS101 2023 version, reusing 2020 types where possible
- **`src/converter.ts`** - Bidirectional conversion functions between versions, version detection, and the main `ensureVersion` utility
- **`src/countries.ts`** - ISO country code definitions
- **`src/index.ts`** - Main entry point exporting unified types and functions

### Key Concepts

The library provides a unified `IVMS101` union type that can represent either version, with:
- **Version Detection**: `ivms101_version()` automatically detects which version based on payload metadata
- **Automatic Conversion**: `ensureVersion()` converts data to desired version (defaults to 2023)
- **Type Safety**: Separate namespaces (`IVMS101_2020`, `IVMS101_2023`) for version-specific work

The 2023 version introduced structural changes:
- `originatorPersons`/`beneficiaryPersons` arrays became singular `originatorPerson`/`beneficiaryPerson`
- `customerNumber` renamed to `customerIdentification` for both natural and legal persons
- `nameIdentifierType` renamed to `naturalPersonNameIdentifierType` for natural person names
- Added `payloadVersion` field to payload metadata

### Testing

Tests use vitest and are located in `test/converter.test.ts`, focusing on conversion accuracy between versions.