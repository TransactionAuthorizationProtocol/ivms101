import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import * as arb from "../src/arbitraries";
import {
	convertFrom2023,
	convertTo2023,
	ensureVersion,
	ivms101_version,
} from "../src/converter";
import type * as IVMS101_2020 from "../src/ivms101_2020";
import * as IVMS101_2023 from "../src/ivms101_2023";

describe("IVMS101 Converter", () => {
	const sampleIVMS101: IVMS101_2020.IVMS101 = {
		originator: {
			originatorPersons: [
				{
					naturalPerson: {
						name: {
							nameIdentifier: [
								{
									primaryIdentifier: "Smith",
									secondaryIdentifier: "John",
									nameIdentifierType: "LEGL",
								},
							],
						},
						customerNumber: "123456",
					},
					accountNumber: ["ACC001"],
				},
			],
		},
		beneficiary: {
			beneficiaryPersons: [
				{
					legalPerson: {
						name: {
							nameIdentifier: [
								{
									legalPersonName: "Acme Corp",
									legalPersonNameIdentifierType: "LEGL",
								},
							],
						},
						customerNumber: "789012",
					},
				},
			],
		},
		payloadMetadata: {
			transliterationMethod: ["othr"],
		},
	};

	it("should have correct version", () => {
		expect(ivms101_version(sampleIVMS101)).toEqual(
			IVMS101_2023.PayloadVersionCode.V2020,
		);
	});

	it("should convert IVMS101 to IVMS101_2023", () => {
		const converted = convertTo2023(sampleIVMS101);

		expect(
			converted.originator.originatorPerson[0].naturalPerson?.name
				.nameIdentifier[0].naturalPersonNameIdentifierType,
		).toBe("LEGL");
		expect(
			converted.originator.originatorPerson[0].naturalPerson
				?.customerIdentification,
		).toBe("123456");
		expect(
			converted.beneficiary.beneficiaryPerson[0].legalPerson
				?.customerIdentification,
		).toBe("789012");
		expect(converted.payloadMetadata?.payloadVersion).toBe("101.2023");

		expect(ivms101_version(converted)).toEqual(
			IVMS101_2023.PayloadVersionCode.V2023,
		);
	});

	it("should convert IVMS101_2023 back to IVMS101", () => {
		const converted = convertTo2023(sampleIVMS101);
		const backConverted = convertFrom2023(converted);

		// Normalize by removing undefined values for comparison
		const normalize = (obj: unknown): unknown => {
			if (obj === null || obj === undefined) return obj;
			if (Array.isArray(obj)) return obj.map(normalize);
			if (typeof obj === "object") {
				const result: Record<string, unknown> = {};
				for (const key in obj) {
					const value = (obj as Record<string, unknown>)[key];
					if (value !== undefined) {
						result[key] = normalize(value);
					}
				}
				return result;
			}
			return obj;
		};

		expect(normalize(backConverted)).toEqual(normalize(sampleIVMS101));
	});

	describe("ensureVersion", () => {
		const v2023 = convertTo2023(sampleIVMS101);

		// Helper to normalize objects for comparison
		const normalize = (obj: unknown): unknown => {
			if (obj === null || obj === undefined) return obj;
			if (Array.isArray(obj)) return obj.map(normalize);
			if (typeof obj === "object") {
				const result: Record<string, unknown> = {};
				for (const key in obj) {
					const value = (obj as Record<string, unknown>)[key];
					if (value !== undefined) {
						result[key] = normalize(value);
					}
				}
				return result;
			}
			return obj;
		};

		it("should ensure correct v2020 for v2020", () => {
			expect(
				ensureVersion(IVMS101_2023.PayloadVersionCode.V2020, sampleIVMS101),
			).toEqual(sampleIVMS101);
		});

		it("should ensure correct v2020 for v2023", () => {
			expect(
				normalize(ensureVersion(IVMS101_2023.PayloadVersionCode.V2020, v2023)),
			).toEqual(normalize(sampleIVMS101));
		});

		it("should ensure correct v2023 for v2020", () => {
			expect(
				ensureVersion(IVMS101_2023.PayloadVersionCode.V2023, sampleIVMS101),
			).toEqual(v2023);
		});

		it("should ensure correct v2020 for v2023", () => {
			expect(
				ensureVersion(IVMS101_2023.PayloadVersionCode.V2023, v2023),
			).toEqual(v2023);
		});

		it("should default to 2023 version when no version is specified", () => {
			expect(ensureVersion(undefined, sampleIVMS101)).toEqual(v2023);
			expect(ensureVersion(undefined, v2023)).toEqual(v2023);
		});
	});

	describe("Property-based Tests using Fast-Check", () => {
		it("should preserve essential data in roundtrip conversions", () => {
			fc.assert(
				fc.property(arb.ivms101_2020(), (original) => {
					const converted2023 = convertTo2023(original);
					const backConverted = convertFrom2023(converted2023);

					// Normalize by removing undefined values and empty objects for comparison
					const normalize = (obj: unknown): unknown => {
						if (obj === null || obj === undefined) return obj;
						if (Array.isArray(obj)) return obj.map(normalize);
						if (typeof obj === "object") {
							const result: Record<string, unknown> = {};
							for (const key in obj) {
								const normalized = normalize(
									(obj as Record<string, unknown>)[key],
								);
								// Only include non-undefined values and non-empty objects
								if (normalized !== undefined) {
									if (
										typeof normalized === "object" &&
										!Array.isArray(normalized) &&
										Object.keys(normalized as object).length === 0
									) {
										// Skip empty objects
										continue;
									}
									result[key] = normalized;
								}
							}
							return result;
						}
						return obj;
					};

					expect(normalize(backConverted)).toEqual(normalize(original));
				}),
			);
		});

		it("should correctly detect versions for generated data", () => {
			fc.assert(
				fc.property(arb.ivms101_2020(), (ivms2020) => {
					expect(ivms101_version(ivms2020)).toBe(
						IVMS101_2023.PayloadVersionCode.V2020,
					);
				}),
			);

			fc.assert(
				fc.property(arb.ivms101_2023Valid(), (ivms2023) => {
					expect(ivms101_version(ivms2023)).toBe(
						IVMS101_2023.PayloadVersionCode.V2023,
					);
				}),
			);
		});

		it("should handle ensureVersion correctly for all generated data", () => {
			fc.assert(
				fc.property(arb.ivms101_2020(), (original) => {
					// Ensure to 2020 format should return original
					expect(
						ensureVersion(IVMS101_2023.PayloadVersionCode.V2020, original),
					).toEqual(original);

					// Ensure to 2023 format should convert
					const as2023 = ensureVersion(
						IVMS101_2023.PayloadVersionCode.V2023,
						original,
					);
					expect(ivms101_version(as2023)).toBe(
						IVMS101_2023.PayloadVersionCode.V2023,
					);

					// Default should convert to 2023
					const defaulted = ensureVersion(undefined, original);
					expect(ivms101_version(defaulted)).toBe(
						IVMS101_2023.PayloadVersionCode.V2023,
					);
				}),
			);
		});

		it("should preserve person data integrity during conversions", () => {
			fc.assert(
				fc.property(arb.ivms101_2020(), (original) => {
					const converted = convertTo2023(original);

					// Check that the number of persons is preserved
					expect(converted.originator.originatorPerson.length).toBe(
						original.originator.originatorPersons.length,
					);
					expect(converted.beneficiary.beneficiaryPerson.length).toBe(
						original.beneficiary.beneficiaryPersons.length,
					);

					// Check that names are preserved
					original.originator.originatorPersons.forEach((person, idx) => {
						if (person.naturalPerson) {
							const convertedPerson =
								converted.originator.originatorPerson[idx].naturalPerson;
							expect(convertedPerson).toBeDefined();
							if (convertedPerson) {
								expect(convertedPerson.name.nameIdentifier.length).toBe(
									person.naturalPerson.name.nameIdentifier.length,
								);
								person.naturalPerson.name.nameIdentifier.forEach(
									(nameId, nameIdx) => {
										const convertedNameId =
											convertedPerson.name.nameIdentifier[nameIdx];
										expect(convertedNameId.primaryIdentifier).toBe(
											nameId.primaryIdentifier,
										);
										expect(convertedNameId.secondaryIdentifier).toBe(
											nameId.secondaryIdentifier,
										);
										expect(
											convertedNameId.naturalPersonNameIdentifierType,
										).toBe(nameId.nameIdentifierType);
									},
								);
							}
						}
					});
				}),
			);
		});
	});
});
