import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import * as arb from "../src/arbitraries";
import type * as IVMS101_2020 from "../src/ivms101_2020";
import * as IVMS101_2023 from "../src/ivms101_2023";
import {
	IVMS101_2020Schema,
	IVMS101_2023Schema,
	IVMS101Schema,
	isValidIVMS101,
	isValidIVMS101_2020,
	isValidIVMS101_2023,
	validateIVMS101,
} from "../src/validator";

describe("IVMS101 Validator", () => {
	// Test data for IVMS101 2020
	const validIVMS101_2020: IVMS101_2020.IVMS101 = {
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
						geographicAddress: [
							{
								addressType: "HOME",
								streetName: "Main St",
								buildingNumber: "123",
								townName: "New York",
								country: "US",
							},
						],
						nationalIdentification: {
							nationalIdentifier: "123456789",
							nationalIdentifierType: "SOCS",
							countryOfIssue: "US",
						},
						dateAndPlaceOfBirth: {
							dateOfBirth: "1990-01-01",
							placeOfBirth: "New York, US",
						},
						countryOfResidence: "US",
					},
				},
			],
			accountNumber: ["ACC001"],
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
						geographicAddress: [
							{
								addressType: "GEOG",
								streetName: "Business Ave",
								buildingNumber: "456",
								townName: "Los Angeles",
								country: "US",
							},
						],
						nationalIdentification: {
							nationalIdentifier: "5493001KJTIIGC8Y1R12",
							nationalIdentifierType: "LEIX",
						},
						countryOfRegistration: "US",
					},
				},
			],
			accountNumber: ["ACC002"],
		},
		originatingVASP: {
			legalPerson: {
				name: {
					nameIdentifier: [
						{
							legalPersonName: "Origin VASP",
							legalPersonNameIdentifierType: "LEGL",
						},
					],
				},
				customerNumber: "VASP001",
			},
		},
		beneficiaryVASP: {
			legalPerson: {
				name: {
					nameIdentifier: [
						{
							legalPersonName: "Beneficiary VASP",
							legalPersonNameIdentifierType: "LEGL",
						},
					],
				},
				customerNumber: "VASP002",
			},
		},
		transferPath: {
			transferPath: [
				{
					intermediaryVASP: {
						legalPerson: {
							name: {
								nameIdentifier: [
									{
										legalPersonName: "Intermediate VASP",
										legalPersonNameIdentifierType: "LEGL",
									},
								],
							},
							customerNumber: "VASP003",
						},
					},
					sequence: 0,
				},
			],
		},
		payloadMetadata: {
			transliterationMethod: ["othr"],
		},
	};

	// Test data for IVMS101 2023
	const validIVMS101_2023: IVMS101_2023.IVMS101 = {
		originator: {
			originatorPerson: [
				{
					naturalPerson: {
						name: {
							nameIdentifier: [
								{
									primaryIdentifier: "Smith",
									secondaryIdentifier: "John",
									naturalPersonNameIdentifierType: "LEGL",
								},
							],
						},
						customerIdentification: "123456",
						geographicAddress: [
							{
								addressType: "HOME",
								streetName: "Main St",
								buildingNumber: "123",
								townName: "New York",
								country: "US",
							},
						],
						nationalIdentification: {
							nationalIdentifier: "123456789",
							nationalIdentifierType: "SOCS",
							countryOfIssue: "US",
						},
						dateAndPlaceOfBirth: {
							dateOfBirth: "1990-01-01",
							placeOfBirth: "New York, US",
						},
						countryOfResidence: "US",
					},
				},
			],
			accountNumber: ["ACC001"],
		},
		beneficiary: {
			beneficiaryPerson: [
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
						customerIdentification: "789012",
						geographicAddress: [
							{
								addressType: "GEOG",
								streetName: "Business Ave",
								buildingNumber: "456",
								townName: "Los Angeles",
								country: "US",
							},
						],
						nationalIdentification: {
							nationalIdentifier: "5493001KJTIIGC8Y1R12",
							nationalIdentifierType: "LEIX",
						},
						countryOfRegistration: "US",
					},
				},
			],
			accountNumber: ["ACC002"],
		},
		originatingVASP: {
			legalPerson: {
				name: {
					nameIdentifier: [
						{
							legalPersonName: "Origin VASP",
							legalPersonNameIdentifierType: "LEGL",
						},
					],
				},
				customerIdentification: "VASP001",
			},
		},
		beneficiaryVASP: {
			legalPerson: {
				name: {
					nameIdentifier: [
						{
							legalPersonName: "Beneficiary VASP",
							legalPersonNameIdentifierType: "LEGL",
						},
					],
				},
				customerIdentification: "VASP002",
			},
		},
		transferPath: {
			transferPath: [
				{
					intermediaryVASP: {
						legalPerson: {
							name: {
								nameIdentifier: [
									{
										legalPersonName: "Intermediate VASP",
										legalPersonNameIdentifierType: "LEGL",
									},
								],
							},
							customerIdentification: "VASP003",
						},
					},
					sequence: 0,
				},
			],
		},
		payloadMetadata: {
			transliterationMethod: ["othr"],
			payloadVersion: IVMS101_2023.PayloadVersionCode.V2023,
		},
	};

	describe("IVMS101_2020Schema", () => {
		it("should validate valid IVMS101 2020 data", () => {
			expect(() => IVMS101_2020Schema.parse(validIVMS101_2020)).not.toThrow();
			const result = IVMS101_2020Schema.safeParse(validIVMS101_2020);
			expect(result.success).toBe(true);
		});

		it("should reject IVMS101 2023 data", () => {
			const result = IVMS101_2020Schema.safeParse(validIVMS101_2023);
			expect(result.success).toBe(false);
		});

		it("should reject invalid data - missing required fields", () => {
			const invalidData = {
				originator: {
					originatorPersons: [],
				},
				// missing beneficiary
			};
			const result = IVMS101_2020Schema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject invalid enum values", () => {
			const invalidData = {
				...validIVMS101_2020,
				originator: {
					...validIVMS101_2020.originator,
					originatorPersons: [
						{
							naturalPerson: {
								name: {
									nameIdentifier: [
										{
											primaryIdentifier: "Smith",
											nameIdentifierType: "INVALID_TYPE",
										},
									],
								},
							},
						},
					],
				},
			};
			const result = IVMS101_2020Schema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should validate minimal required data", () => {
			const minimalData = {
				originator: {
					originatorPersons: [
						{
							naturalPerson: {
								name: {
									nameIdentifier: [
										{
											primaryIdentifier: "Smith",
											nameIdentifierType: "LEGL",
										},
									],
								},
								customerNumber: "CUST001",
							},
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
								customerNumber: "CUST002",
							},
						},
					],
				},
			};
			const result = IVMS101_2020Schema.safeParse(minimalData);
			expect(result.success).toBe(true);
		});
	});

	describe("IVMS101_2023Schema", () => {
		it("should validate valid IVMS101 2023 data", () => {
			expect(() => IVMS101_2023Schema.parse(validIVMS101_2023)).not.toThrow();
			const result = IVMS101_2023Schema.safeParse(validIVMS101_2023);
			expect(result.success).toBe(true);
		});

		it("should reject IVMS101 2020 data", () => {
			const result = IVMS101_2023Schema.safeParse(validIVMS101_2020);
			expect(result.success).toBe(false);
		});

		it("should reject invalid data - wrong field names", () => {
			const invalidData = {
				...validIVMS101_2023,
				originator: {
					originatorPersons: validIVMS101_2023.originator.originatorPerson, // wrong field name
				},
			};
			const result = IVMS101_2023Schema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should validate minimal required data", () => {
			const minimalData = {
				originator: {
					originatorPerson: [
						{
							naturalPerson: {
								name: {
									nameIdentifier: [
										{
											primaryIdentifier: "Smith",
											naturalPersonNameIdentifierType: "LEGL",
										},
									],
								},
								customerIdentification: "CUST001",
							},
						},
					],
				},
				beneficiary: {
					beneficiaryPerson: [
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
								customerIdentification: "CUST002",
							},
						},
					],
				},
				payloadMetadata: {
					payloadVersion: "101.2023",
				},
			};
			const result = IVMS101_2023Schema.safeParse(minimalData);
			expect(result.success).toBe(true);
		});
	});

	describe("IVMS101Schema (Union)", () => {
		it("should validate IVMS101 2020 data", () => {
			const result = IVMS101Schema.safeParse(validIVMS101_2020);
			expect(result.success).toBe(true);
		});

		it("should validate IVMS101 2023 data", () => {
			const result = IVMS101Schema.safeParse(validIVMS101_2023);
			expect(result.success).toBe(true);
		});

		it("should reject completely invalid data", () => {
			const result = IVMS101Schema.safeParse({ invalid: "data" });
			expect(result.success).toBe(false);
		});
	});

	describe("Utility Functions", () => {
		describe("validateIVMS101", () => {
			it("should parse valid IVMS101 2020 data", () => {
				const result = validateIVMS101(validIVMS101_2020);
				expect(result).toEqual(validIVMS101_2020);
			});

			it("should parse valid IVMS101 2023 data", () => {
				const result = validateIVMS101(validIVMS101_2023);
				expect(result).toEqual(validIVMS101_2023);
			});

			it("should throw on invalid data", () => {
				expect(() => validateIVMS101({ invalid: "data" })).toThrow();
			});
		});

		describe("isValidIVMS101_2020", () => {
			it("should return true for valid IVMS101 2020 data", () => {
				expect(isValidIVMS101_2020(validIVMS101_2020)).toBe(true);
			});

			it("should return false for IVMS101 2023 data", () => {
				expect(isValidIVMS101_2020(validIVMS101_2023)).toBe(false);
			});

			it("should return false for invalid data", () => {
				expect(isValidIVMS101_2020({ invalid: "data" })).toBe(false);
			});
		});

		describe("isValidIVMS101_2023", () => {
			it("should return true for valid IVMS101 2023 data", () => {
				expect(isValidIVMS101_2023(validIVMS101_2023)).toBe(true);
			});

			it("should return false for IVMS101 2020 data", () => {
				expect(isValidIVMS101_2023(validIVMS101_2020)).toBe(false);
			});

			it("should return false for invalid data", () => {
				expect(isValidIVMS101_2023({ invalid: "data" })).toBe(false);
			});
		});

		describe("isValidIVMS101", () => {
			it("should return true for valid IVMS101 2020 data", () => {
				expect(isValidIVMS101(validIVMS101_2020)).toBe(true);
			});

			it("should return true for valid IVMS101 2023 data", () => {
				expect(isValidIVMS101(validIVMS101_2023)).toBe(true);
			});

			it("should return false for invalid data", () => {
				expect(isValidIVMS101({ invalid: "data" })).toBe(false);
			});
		});
	});

	describe("Edge Cases and Validation Details", () => {
		it("should validate country codes", () => {
			const dataWithInvalidCountry = {
				...validIVMS101_2020,
				originator: {
					...validIVMS101_2020.originator,
					originatorPersons: [
						{
							naturalPerson: {
								name: {
									nameIdentifier: [
										{
											primaryIdentifier: "Smith",
											nameIdentifierType: "LEGL",
										},
									],
								},
								geographicAddress: [
									{
										addressType: "HOME",
										townName: "Test City",
										country: "ZZ", // Invalid country code
									},
								],
							},
						},
					],
				},
			};
			const result = IVMS101_2020Schema.safeParse(dataWithInvalidCountry);
			expect(result.success).toBe(false);
		});

		it("should validate national identifier types for natural persons", () => {
			const dataWithInvalidNatId = {
				...validIVMS101_2020,
				originator: {
					...validIVMS101_2020.originator,
					originatorPersons: [
						{
							naturalPerson: {
								name: {
									nameIdentifier: [
										{
											primaryIdentifier: "Smith",
											nameIdentifierType: "LEGL",
										},
									],
								},
								nationalIdentification: {
									nationalIdentifier: "123",
									nationalIdentifierType: "LEIX", // Invalid for natural person
									countryOfIssue: "US",
								},
							},
						},
					],
				},
			};
			const result = IVMS101_2020Schema.safeParse(dataWithInvalidNatId);
			expect(result.success).toBe(false);
		});

		it("should validate national identifier types for legal persons", () => {
			const dataWithInvalidNatId = {
				...validIVMS101_2020,
				beneficiary: {
					...validIVMS101_2020.beneficiary,
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
								nationalIdentification: {
									nationalIdentifier: "123",
									nationalIdentifierType: "SOCS", // Invalid for legal person
									countryOfIssue: "US",
								},
							},
						},
					],
				},
			};
			const result = IVMS101_2020Schema.safeParse(dataWithInvalidNatId);
			expect(result.success).toBe(false);
		});

		it("should require at least one person in arrays", () => {
			const dataWithEmptyArray = {
				originator: {
					originatorPersons: [],
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
							},
						},
					],
				},
			};
			const result = IVMS101_2020Schema.safeParse(dataWithEmptyArray);
			expect(result.success).toBe(false);
		});

		it("should validate transfer path sequence numbers", () => {
			const dataWithInvalidSequence = {
				...validIVMS101_2020,
				transferPath: {
					transferPath: [
						{
							intermediaryVASP: {
								legalPerson: {
									name: {
										nameIdentifier: [
											{
												legalPersonName: "Intermediate VASP",
												legalPersonNameIdentifierType: "LEGL",
											},
										],
									},
								},
							},
							sequence: "invalid", // Should be number
						},
					],
				},
			};
			const result = IVMS101_2020Schema.safeParse(dataWithInvalidSequence);
			expect(result.success).toBe(false);
		});
	});
	describe("Property-based Validation Tests using Fast-Check", () => {
		it("should validate all generated IVMS101 2020 structures", () => {
			fc.assert(
				fc.property(arb.ivms101_2020(), (ivms2020) => {
					const result = IVMS101_2020Schema.safeParse(ivms2020);
					expect(result.success).toBe(true);
				}),
			);
		});

		it("should validate all generated IVMS101 2023 structures", () => {
			fc.assert(
				fc.property(arb.ivms101_2023Valid(), (ivms2023) => {
					const result = IVMS101_2023Schema.safeParse(ivms2023);
					expect(result.success).toBe(true);
				}),
			);
		});

		it("should accept all generated data via union schema", () => {
			fc.assert(
				fc.property(arb.ivms101(), (ivms) => {
					const result = IVMS101Schema.safeParse(ivms);
					expect(result.success).toBe(true);
				}),
			);
		});

		it("should validate generated data via utility functions", () => {
			fc.assert(
				fc.property(arb.ivms101_2020(), (ivms2020) => {
					expect(isValidIVMS101_2020(ivms2020)).toBe(true);
					expect(isValidIVMS101(ivms2020)).toBe(true);
					expect(() => validateIVMS101(ivms2020)).not.toThrow();
				}),
			);

			fc.assert(
				fc.property(arb.ivms101_2023Valid(), (ivms2023) => {
					expect(isValidIVMS101_2023(ivms2023)).toBe(true);
					expect(isValidIVMS101(ivms2023)).toBe(true);
					expect(() => validateIVMS101(ivms2023)).not.toThrow();
				}),
			);
		});

		it("should correctly identify version-specific data", () => {
			fc.assert(
				fc.property(arb.ivms101_2020(), (ivms2020) => {
					// 2020 data should validate as 2020 but not as 2023
					expect(isValidIVMS101_2020(ivms2020)).toBe(true);
					expect(isValidIVMS101_2023(ivms2020)).toBe(false);
				}),
			);

			fc.assert(
				fc.property(arb.ivms101_2023Valid(), (ivms2023) => {
					// 2023 data should validate as 2023 but not as 2020
					expect(isValidIVMS101_2023(ivms2023)).toBe(true);
					expect(isValidIVMS101_2020(ivms2023)).toBe(false);
				}),
			);
		});

		it("should validate generated person structures individually", () => {
			fc.assert(
				fc.property(arb.naturalPerson(), (person) => {
					// Natural person should have valid structure
					expect(person.name.nameIdentifier.length).toBeGreaterThan(0);
					person.name.nameIdentifier.forEach((nameId) => {
						expect(nameId.primaryIdentifier.trim().length).toBeGreaterThan(0);
						expect(["ALIA", "BIRT", "MAID", "LEGL", "MISC"]).toContain(
							nameId.nameIdentifierType,
						);
					});
				}),
			);

			fc.assert(
				fc.property(arb.legalPerson(), (person) => {
					// Legal person should have valid structure
					expect(person.name.nameIdentifier.length).toBeGreaterThan(0);
					person.name.nameIdentifier.forEach((nameId) => {
						expect(nameId.legalPersonName.trim().length).toBeGreaterThan(0);
						expect(["LEGL", "SHRT", "TRAD"]).toContain(
							nameId.legalPersonNameIdentifierType,
						);
					});
				}),
			);
		});

		it("should validate generated addresses", () => {
			fc.assert(
				fc.property(arb.address(), (address) => {
					expect(["HOME", "BIZZ", "GEOG"]).toContain(address.addressType);
					expect(address.townName.trim().length).toBeGreaterThan(0);
					expect(address.country.length).toBe(2); // ISO country codes
				}),
			);
		});

		it("should validate national identification structures", () => {
			fc.assert(
				fc.property(arb.naturalPersonNationalIdentification(), (natId) => {
					expect(natId.nationalIdentifier.trim().length).toBeGreaterThan(0);
					const validNaturalPersonTypes = [
						"ARNU",
						"CCPT",
						"DRLC",
						"FIIN",
						"TXID",
						"SOCS",
						"IDCD",
						"MISC",
					];
					expect(validNaturalPersonTypes).toContain(
						natId.nationalIdentifierType,
					);
				}),
			);

			fc.assert(
				fc.property(arb.legalEntityNationalIdentification(), (natId) => {
					expect(natId.nationalIdentifier.trim().length).toBeGreaterThan(0);
					const validLegalEntityTypes = [
						"RAID",
						"FIIN",
						"TXID",
						"LEIX",
						"MISC",
					];
					expect(validLegalEntityTypes).toContain(natId.nationalIdentifierType);
				}),
			);
		});
	});

	describe("Array Bounds Validation", () => {
		// Helper to create minimal valid structures
		const createValidNameId = (): IVMS101_2020.NaturalPersonNameId => ({
			primaryIdentifier: "Doe",
			secondaryIdentifier: "John",
			nameIdentifierType: "LEGL",
		});

		const createValidAddress = (): IVMS101_2020.Address => ({
			addressType: "HOME",
			streetName: "Main St",
			buildingNumber: "123",
			townName: "City",
			country: "US",
		});

		const createValidPerson = (): IVMS101_2020.Person => ({
			naturalPerson: {
				name: { nameIdentifier: [createValidNameId()] },
				customerNumber: "CUST001",
			},
		});

		const createValidIVMS101 = (
			overrides?: Partial<IVMS101_2020.IVMS101>,
		): IVMS101_2020.IVMS101 => ({
			originator: {
				originatorPersons: [createValidPerson()],
			},
			beneficiary: {
				beneficiaryPersons: [createValidPerson()],
			},
			...overrides,
		});

		describe("IVMS101 2020 - Originator/Beneficiary Persons", () => {
			it("should accept exactly 10 originator persons", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: Array(10)
							.fill(null)
							.map(() => createValidPerson()),
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).not.toThrow();
			});

			it("should reject 11 originator persons", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: Array(11)
							.fill(null)
							.map(() => createValidPerson()),
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too big.*10/);
			});

			it("should accept exactly 10 beneficiary persons", () => {
				const data = createValidIVMS101({
					beneficiary: {
						beneficiaryPersons: Array(10)
							.fill(null)
							.map(() => createValidPerson()),
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).not.toThrow();
			});

			it("should reject 11 beneficiary persons", () => {
				const data = createValidIVMS101({
					beneficiary: {
						beneficiaryPersons: Array(11)
							.fill(null)
							.map(() => createValidPerson()),
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too big.*10/);
			});
		});

		describe("IVMS101 2020 - Account Numbers", () => {
			it("should accept exactly 20 originator account numbers", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [createValidPerson()],
						accountNumber: Array(20).fill("0x123"),
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).not.toThrow();
			});

			it("should reject 21 originator account numbers", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [createValidPerson()],
						accountNumber: Array(21).fill("0x123"),
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too big.*20/);
			});

			it("should accept exactly 20 beneficiary account numbers", () => {
				const data = createValidIVMS101({
					beneficiary: {
						beneficiaryPersons: [createValidPerson()],
						accountNumber: Array(20).fill("0x456"),
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).not.toThrow();
			});

			it("should reject 21 beneficiary account numbers", () => {
				const data = createValidIVMS101({
					beneficiary: {
						beneficiaryPersons: [createValidPerson()],
						accountNumber: Array(21).fill("0x456"),
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too big.*20/);
			});
		});

		describe("IVMS101 2020 - Natural Person Name Identifiers", () => {
			it("should accept exactly 5 name identifiers", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [
							{
								naturalPerson: {
									name: {
										nameIdentifier: Array(5)
											.fill(null)
											.map(() => createValidNameId()),
									},
									customerNumber: "CUST001",
								},
							},
						],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).not.toThrow();
			});

			it("should reject 6 name identifiers", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [
							{
								naturalPerson: {
									name: {
										nameIdentifier: Array(6)
											.fill(null)
											.map(() => createValidNameId()),
									},
								},
							},
						],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too big.*5/);
			});

			it("should require at least 1 name identifier", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [
							{
								naturalPerson: {
									name: {
										nameIdentifier: [],
									},
								},
							},
						],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too small.*1/);
			});
		});

		describe("IVMS101 2020 - Legal Person Name Identifiers", () => {
			const createValidLegalNameId = (): IVMS101_2020.LegalPersonNameId => ({
				legalPersonName: "Acme Corp",
				legalPersonNameIdentifierType: "LEGL",
			});

			it("should accept exactly 3 legal person name identifiers", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [
							{
								legalPerson: {
									name: {
										nameIdentifier: Array(3)
											.fill(null)
											.map(() => createValidLegalNameId()),
									},
									customerNumber: "CUST002",
								},
							},
						],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).not.toThrow();
			});

			it("should reject 4 legal person name identifiers", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [
							{
								legalPerson: {
									name: {
										nameIdentifier: Array(4)
											.fill(null)
											.map(() => createValidLegalNameId()),
									},
								},
							},
						],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too big.*3/);
			});
		});

		describe("IVMS101 2020 - Geographic Addresses", () => {
			it("should accept exactly 5 addresses for natural person", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [
							{
								naturalPerson: {
									name: { nameIdentifier: [createValidNameId()] },
									geographicAddress: Array(5)
										.fill(null)
										.map(() => createValidAddress()),
								},
							},
						],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).not.toThrow();
			});

			it("should reject 6 addresses for natural person", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [
							{
								naturalPerson: {
									name: { nameIdentifier: [createValidNameId()] },
									geographicAddress: Array(6)
										.fill(null)
										.map(() => createValidAddress()),
								},
							},
						],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too big.*5/);
			});

			it("should accept exactly 5 addresses for legal person", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [
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
									geographicAddress: Array(5)
										.fill(null)
										.map(() => ({
											addressType: "GEOG",
											streetName: "Business Ave",
											buildingNumber: "456",
											townName: "City",
											country: "US",
										})),
								},
							},
						],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).not.toThrow();
			});

			it("should reject 6 addresses for legal person", () => {
				const data = createValidIVMS101({
					originator: {
						originatorPersons: [
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
									geographicAddress: Array(6)
										.fill(null)
										.map(() => createValidAddress()),
								},
							},
						],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too big.*5/);
			});
		});

		describe("IVMS101 2020 - Transfer Path", () => {
			it("should accept exactly 5 intermediary VASPs", () => {
				const data = createValidIVMS101({
					transferPath: {
						transferPath: Array(5)
							.fill(null)
							.map((_, i) => ({
								intermediaryVASP: createValidPerson(),
								sequence: i,
							})),
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).not.toThrow();
			});

			it("should reject 6 intermediary VASPs", () => {
				const data = createValidIVMS101({
					transferPath: {
						transferPath: Array(6)
							.fill(null)
							.map((_, i) => ({
								intermediaryVASP: createValidPerson(),
								sequence: i + 1,
							})),
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too big.*5/);
			});
		});

		describe("IVMS101 2020 - Transliteration Methods", () => {
			it("should accept exactly 5 transliteration methods", () => {
				const data = createValidIVMS101({
					payloadMetadata: {
						transliterationMethod: ["othr", "arab", "aran", "armn", "cyrl"],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).not.toThrow();
			});

			it("should reject 6 transliteration methods", () => {
				const data = createValidIVMS101({
					payloadMetadata: {
						transliterationMethod: [
							"othr",
							"arab",
							"aran",
							"armn",
							"cyrl",
							"geor",
						],
					},
				});
				expect(() => IVMS101_2020Schema.parse(data)).toThrow(/Too big.*5/);
			});
		});

		describe("IVMS101 2023 - Array Bounds", () => {
			const createValid2023NameId = (): IVMS101_2023.NaturalPersonNameId => ({
				primaryIdentifier: "Doe",
				secondaryIdentifier: "John",
				naturalPersonNameIdentifierType: "LEGL",
			});

			const createValid2023Person = (): IVMS101_2023.Person => ({
				naturalPerson: {
					name: { nameIdentifier: [createValid2023NameId()] },
					customerIdentification: "CUST001",
				},
			});

			const createValid2023IVMS101 = (
				overrides?: Partial<IVMS101_2023.IVMS101>,
			): IVMS101_2023.IVMS101 => ({
				originator: {
					originatorPerson: [createValid2023Person()],
				},
				beneficiary: {
					beneficiaryPerson: [createValid2023Person()],
				},
				payloadMetadata: {
					payloadVersion: IVMS101_2023.PayloadVersionCode.V2023,
				},
				...overrides,
			});

			it("should accept exactly 10 originator persons", () => {
				const data = createValid2023IVMS101({
					originator: {
						originatorPerson: Array(10)
							.fill(null)
							.map(() => createValid2023Person()),
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).not.toThrow();
			});

			it("should reject 11 originator persons", () => {
				const data = createValid2023IVMS101({
					originator: {
						originatorPerson: Array(11)
							.fill(null)
							.map(() => createValid2023Person()),
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).toThrow(/Too big.*10/);
			});

			it("should accept exactly 20 account numbers", () => {
				const data = createValid2023IVMS101({
					originator: {
						originatorPerson: [createValid2023Person()],
						accountNumber: Array(20).fill("0x123"),
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).not.toThrow();
			});

			it("should reject 21 account numbers", () => {
				const data = createValid2023IVMS101({
					originator: {
						originatorPerson: [createValid2023Person()],
						accountNumber: Array(21).fill("0x123"),
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).toThrow(/Too big.*20/);
			});

			it("should accept exactly 5 name identifiers", () => {
				const data = createValid2023IVMS101({
					originator: {
						originatorPerson: [
							{
								naturalPerson: {
									name: {
										nameIdentifier: Array(5)
											.fill(null)
											.map(() => createValid2023NameId()),
									},
									customerIdentification: "CUST001",
								},
							},
						],
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).not.toThrow();
			});

			it("should reject 6 name identifiers", () => {
				const data = createValid2023IVMS101({
					originator: {
						originatorPerson: [
							{
								naturalPerson: {
									name: {
										nameIdentifier: Array(6)
											.fill(null)
											.map(() => createValid2023NameId()),
									},
								},
							},
						],
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).toThrow(/Too big.*5/);
			});

			it("should accept exactly 5 geographic addresses", () => {
				const data = createValid2023IVMS101({
					originator: {
						originatorPerson: [
							{
								naturalPerson: {
									name: { nameIdentifier: [createValid2023NameId()] },
									geographicAddress: Array(5)
										.fill(null)
										.map(() => createValidAddress()),
								},
							},
						],
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).not.toThrow();
			});

			it("should reject 6 geographic addresses", () => {
				const data = createValid2023IVMS101({
					originator: {
						originatorPerson: [
							{
								naturalPerson: {
									name: { nameIdentifier: [createValid2023NameId()] },
									geographicAddress: Array(6)
										.fill(null)
										.map(() => createValidAddress()),
								},
							},
						],
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).toThrow(/Too big.*5/);
			});

			it("should accept exactly 5 intermediary VASPs in transfer path", () => {
				const data = createValid2023IVMS101({
					transferPath: {
						transferPath: Array(5)
							.fill(null)
							.map((_, i) => ({
								intermediaryVASP: createValid2023Person(),
								sequence: i,
							})),
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).not.toThrow();
			});

			it("should reject 6 intermediary VASPs in transfer path", () => {
				const data = createValid2023IVMS101({
					transferPath: {
						transferPath: Array(6)
							.fill(null)
							.map((_, i) => ({
								intermediaryVASP: createValid2023Person(),
								sequence: i + 1,
							})),
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).toThrow(/Too big.*5/);
			});

			it("should accept exactly 5 transliteration methods", () => {
				const data = createValid2023IVMS101({
					payloadMetadata: {
						transliterationMethod: ["othr", "arab", "aran", "armn", "cyrl"],
						payloadVersion: IVMS101_2023.PayloadVersionCode.V2023,
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).not.toThrow();
			});

			it("should reject 6 transliteration methods", () => {
				const data = createValid2023IVMS101({
					payloadMetadata: {
						transliterationMethod: [
							"othr",
							"arab",
							"aran",
							"armn",
							"cyrl",
							"geor",
						],
						payloadVersion: IVMS101_2023.PayloadVersionCode.V2023,
					},
				});
				expect(() => IVMS101_2023Schema.parse(data)).toThrow(/Too big.*5/);
			});
		});
	});
});
