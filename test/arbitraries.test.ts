import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as IVMS101_2020 from "../src/ivms101_2020";
import * as IVMS101_2023 from "../src/ivms101_2023";
import { convertTo2023, convertFrom2023, ivms101_version } from "../src/converter";
import * as arb from "../src/arbitraries";

describe("IVMS101 Fast-Check Property-Based Tests", () => {
  describe("Basic Type Generation", () => {
    it("should generate valid natural person name types", () => {
      fc.assert(fc.property(arb.naturalPersonNameTypeCode(), (nameType) => {
        const validTypes: IVMS101_2020.NaturalPersonNameTypeCode[] = ["ALIA", "BIRT", "MAID", "LEGL", "MISC"];
        expect(validTypes).toContain(nameType);
      }));
    });

    it("should generate valid legal person name types", () => {
      fc.assert(fc.property(arb.legalPersonNameTypeCode(), (nameType) => {
        const validTypes: IVMS101_2020.LegalPersonNameTypeCode[] = ["LEGL", "SHRT", "TRAD"];
        expect(validTypes).toContain(nameType);
      }));
    });

    it("should generate valid address types", () => {
      fc.assert(fc.property(arb.addressTypeCode(), (addressType) => {
        const validTypes: IVMS101_2020.AddressTypeCode[] = ["HOME", "BIZZ", "GEOG"];
        expect(validTypes).toContain(addressType);
      }));
    });
  });

  describe("Structure Generation", () => {
    it("should generate valid natural person name IDs", () => {
      fc.assert(fc.property(arb.naturalPersonNameId(), (nameId) => {
        expect(nameId.primaryIdentifier).toBeTypeOf("string");
        expect(nameId.primaryIdentifier.length).toBeGreaterThan(0);
        expect(["ALIA", "BIRT", "MAID", "LEGL", "MISC"]).toContain(nameId.nameIdentifierType);
        if (nameId.secondaryIdentifier !== undefined) {
          expect(nameId.secondaryIdentifier).toBeTypeOf("string");
        }
      }));
    });

    it("should generate valid legal person name IDs", () => {
      fc.assert(fc.property(arb.legalPersonNameId(), (nameId) => {
        expect(nameId.legalPersonName).toBeTypeOf("string");
        expect(nameId.legalPersonName.length).toBeGreaterThan(0);
        expect(["LEGL", "SHRT", "TRAD"]).toContain(nameId.legalPersonNameIdentifierType);
      }));
    });

    it("should generate valid addresses", () => {
      fc.assert(fc.property(arb.address(), (address) => {
        expect(["HOME", "BIZZ", "GEOG"]).toContain(address.addressType);
        expect(address.townName).toBeTypeOf("string");
        expect(address.townName.length).toBeGreaterThan(0);
        expect(address.country).toBeTypeOf("string");
        expect(address.country.length).toBe(2); // ISO country codes are 2 chars
      }));
    });
  });

  describe("Person Generation", () => {
    it("should generate valid natural persons", () => {
      fc.assert(fc.property(arb.naturalPerson(), (person) => {
        expect(person.name).toHaveProperty("nameIdentifier");
        expect(Array.isArray(person.name.nameIdentifier)).toBe(true);
        expect(person.name.nameIdentifier.length).toBeGreaterThan(0);
        person.name.nameIdentifier.forEach(nameId => {
          expect(nameId.primaryIdentifier).toBeTypeOf("string");
          expect(nameId.primaryIdentifier.length).toBeGreaterThan(0);
        });
      }));
    });

    it("should generate valid legal persons", () => {
      fc.assert(fc.property(arb.legalPerson(), (person) => {
        expect(person.name).toHaveProperty("nameIdentifier");
        expect(Array.isArray(person.name.nameIdentifier)).toBe(true);
        expect(person.name.nameIdentifier.length).toBeGreaterThan(0);
        person.name.nameIdentifier.forEach(nameId => {
          expect(nameId.legalPersonName).toBeTypeOf("string");
          expect(nameId.legalPersonName.length).toBeGreaterThan(0);
        });
      }));
    });

    it("should generate valid person objects (natural XOR legal)", () => {
      fc.assert(fc.property(arb.person(), (person) => {
        const hasNatural = person.naturalPerson !== undefined;
        const hasLegal = person.legalPerson !== undefined;
        
        // Exactly one should be defined (XOR)
        expect(hasNatural !== hasLegal).toBe(true);
      }));
    });
  });

  describe("IVMS101 Structure Generation", () => {
    it("should generate valid IVMS101 2020 structures", () => {
      fc.assert(fc.property(arb.ivms101_2020(), (ivms) => {
        // Check required fields
        expect(ivms.originator).toBeDefined();
        expect(ivms.beneficiary).toBeDefined();
        
        // Check originator structure
        expect(Array.isArray(ivms.originator.originatorPersons)).toBe(true);
        expect(ivms.originator.originatorPersons.length).toBeGreaterThan(0);
        
        // Check beneficiary structure
        expect(Array.isArray(ivms.beneficiary.beneficiaryPersons)).toBe(true);
        expect(ivms.beneficiary.beneficiaryPersons.length).toBeGreaterThan(0);
        
        // Verify version detection works
        const version = ivms101_version(ivms);
        expect(version).toBe(IVMS101_2023.PayloadVersionCode.V2020);
      }));
    });
  });

  describe("Conversion Property Tests", () => {
    it("should roundtrip conversion preserve essential data", () => {
      fc.assert(fc.property(arb.ivms101_2020(), (original) => {
        const converted2023 = convertTo2023(original);
        const backConverted = convertFrom2023(converted2023);

        // Normalize objects by removing undefined values and empty objects for comparison
        // This is necessary because TypeScript/JavaScript don't distinguish between
        // missing properties and properties with undefined values in object spreading
        const normalize = (obj: any): any => {
          if (obj === null || obj === undefined) return obj;
          if (Array.isArray(obj)) return obj.map(normalize);
          if (typeof obj === 'object') {
            const result: any = {};
            for (const key in obj) {
              const normalized = normalize(obj[key]);
              // Only include non-undefined values and non-empty objects
              if (normalized !== undefined) {
                if (typeof normalized === 'object' && !Array.isArray(normalized) && Object.keys(normalized).length === 0) {
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

        // Version detection should work correctly
        expect(ivms101_version(original)).toBe(IVMS101_2023.PayloadVersionCode.V2020);
        expect(ivms101_version(converted2023)).toBe(IVMS101_2023.PayloadVersionCode.V2023);
      }));
    });

    it("should preserve person names in conversion", () => {
      fc.assert(fc.property(arb.ivms101_2020(), (original) => {
        const converted2023 = convertTo2023(original);
        
        // Check originator names are preserved
        original.originator.originatorPersons.forEach((person, idx) => {
          if (person.naturalPerson) {
            person.naturalPerson.name.nameIdentifier.forEach((nameId, nameIdx) => {
              const convertedName = converted2023.originator.originatorPerson[idx].naturalPerson?.name.nameIdentifier[nameIdx];
              expect(convertedName?.primaryIdentifier).toBe(nameId.primaryIdentifier);
              expect(convertedName?.secondaryIdentifier).toBe(nameId.secondaryIdentifier);
              // Note: nameIdentifierType becomes naturalPersonNameIdentifierType in 2023
              expect(convertedName?.naturalPersonNameIdentifierType).toBe(nameId.nameIdentifierType);
            });
          }
        });
      }));
    });

    it("should handle customer number to customer identification conversion", () => {
      fc.assert(fc.property(arb.ivms101_2020(), (original) => {
        const converted2023 = convertTo2023(original);
        
        // Check that customerNumber becomes customerIdentification
        original.originator.originatorPersons.forEach((person, idx) => {
          if (person.naturalPerson?.customerNumber) {
            expect(converted2023.originator.originatorPerson[idx].naturalPerson?.customerIdentification)
              .toBe(person.naturalPerson.customerNumber);
          }
          if (person.legalPerson?.customerNumber) {
            expect(converted2023.originator.originatorPerson[idx].legalPerson?.customerIdentification)
              .toBe(person.legalPerson.customerNumber);
          }
        });
      }));
    });
  });

  describe("IVMS101 2023 Structure Generation", () => {
    it("should generate valid IVMS101 2023 structures", () => {
      fc.assert(fc.property(arb.ivms101_2023Valid(), (ivms) => {
        // Check required fields
        expect(ivms.originator).toBeDefined();
        expect(ivms.beneficiary).toBeDefined();
        
        // Check originator structure (note: different field name)
        expect(Array.isArray(ivms.originator.originatorPerson)).toBe(true);
        expect(ivms.originator.originatorPerson.length).toBeGreaterThan(0);
        
        // Check beneficiary structure (note: different field name)
        expect(Array.isArray(ivms.beneficiary.beneficiaryPerson)).toBe(true);
        expect(ivms.beneficiary.beneficiaryPerson.length).toBeGreaterThan(0);
        
        // Verify version detection works
        const version = ivms101_version(ivms);
        expect(version).toBe(IVMS101_2023.PayloadVersionCode.V2023);
        
        // Check payload version is set
        expect(ivms.payloadMetadata).toBeDefined();
        expect(ivms.payloadMetadata!.payloadVersion).toBe(IVMS101_2023.PayloadVersionCode.V2023);
      }));
    });

    it("should generate valid 2023 natural person name identifiers", () => {
      fc.assert(fc.property(arb.naturalPersonNameId2023(), (nameId) => {
        expect(nameId.primaryIdentifier).toBeTypeOf("string");
        expect(nameId.primaryIdentifier.length).toBeGreaterThan(0);
        expect(["ALIA", "BIRT", "MAID", "LEGL", "MISC"]).toContain(nameId.naturalPersonNameIdentifierType);
        if (nameId.secondaryIdentifier !== undefined) {
          expect(nameId.secondaryIdentifier).toBeTypeOf("string");
        }
      }));
    });

    it("should use customerIdentification instead of customerNumber in 2023", () => {
      fc.assert(fc.property(arb.ivms101_2023Valid(), (ivms) => {
        [...ivms.originator.originatorPerson, ...ivms.beneficiary.beneficiaryPerson].forEach(person => {
          if (person.naturalPerson) {
            // Should not have customerNumber (2020 field)
            expect((person.naturalPerson as any).customerNumber).toBeUndefined();
            // May have customerIdentification (2023 field)
            if (person.naturalPerson.customerIdentification !== undefined) {
              expect(person.naturalPerson.customerIdentification).toBeTypeOf("string");
            }
          }
          if (person.legalPerson) {
            // Should not have customerNumber (2020 field)
            expect((person.legalPerson as any).customerNumber).toBeUndefined();
            // May have customerIdentification (2023 field)
            if (person.legalPerson.customerIdentification !== undefined) {
              expect(person.legalPerson.customerIdentification).toBeTypeOf("string");
            }
          }
        });
      }));
    });
  });

  describe("Cross-Version Compatibility Tests", () => {
    it("should handle conversion from 2020 to 2023 structure", () => {
      fc.assert(fc.property(arb.ivms101_2020(), (original2020) => {
        const converted2023 = convertTo2023(original2020);
        
        // Field name changes should be handled
        expect(converted2023.originator.originatorPerson).toBeDefined();
        expect(converted2023.beneficiary.beneficiaryPerson).toBeDefined();
        
        // Should not have the old field names
        expect((converted2023.originator as any).originatorPersons).toBeUndefined();
        expect((converted2023.beneficiary as any).beneficiaryPersons).toBeUndefined();
        
        // Array lengths should match
        expect(converted2023.originator.originatorPerson.length)
          .toBe(original2020.originator.originatorPersons.length);
        expect(converted2023.beneficiary.beneficiaryPerson.length)
          .toBe(original2020.beneficiary.beneficiaryPersons.length);
      }));
    });

    it("should maintain referential integrity across conversions", () => {
      fc.assert(fc.property(arb.ivms101_2020(), (original) => {
        const converted2023 = convertTo2023(original);
        const backConverted = convertFrom2023(converted2023);
        
        // Account numbers should be preserved
        expect(backConverted.originator.accountNumber).toEqual(original.originator.accountNumber);
        expect(backConverted.beneficiary.accountNumber).toEqual(original.beneficiary.accountNumber);
        
        // Geographic addresses should be preserved
        original.originator.originatorPersons.forEach((person, idx) => {
          if (person.naturalPerson?.geographicAddress) {
            expect(backConverted.originator.originatorPersons[idx].naturalPerson?.geographicAddress)
              .toEqual(person.naturalPerson.geographicAddress);
          }
        });
      }));
    });
  });

  describe("Data Integrity Tests", () => {
    it("should maintain data type consistency in 2020 format", () => {
      fc.assert(fc.property(arb.ivms101_2020(), (ivms) => {
        // All persons should have at least one name
        [...ivms.originator.originatorPersons, ...ivms.beneficiary.beneficiaryPersons].forEach(person => {
          if (person.naturalPerson) {
            expect(person.naturalPerson.name.nameIdentifier.length).toBeGreaterThan(0);
          }
          if (person.legalPerson) {
            expect(person.legalPerson.name.nameIdentifier.length).toBeGreaterThan(0);
          }
        });
        
        // If dates are present, they should be valid
        [...ivms.originator.originatorPersons, ...ivms.beneficiary.beneficiaryPersons].forEach(person => {
          if (person.naturalPerson?.dateAndPlaceOfBirth) {
            const date = new Date(person.naturalPerson.dateAndPlaceOfBirth.dateOfBirth);
            expect(date.getTime()).not.toBeNaN();
            expect(person.naturalPerson.dateAndPlaceOfBirth.placeOfBirth.length).toBeGreaterThan(0);
          }
        });
      }));
    });

    it("should maintain data type consistency in 2023 format", () => {
      fc.assert(fc.property(arb.ivms101_2023Valid(), (ivms) => {
        // All persons should have at least one name
        [...ivms.originator.originatorPerson, ...ivms.beneficiary.beneficiaryPerson].forEach(person => {
          if (person.naturalPerson) {
            expect(person.naturalPerson.name.nameIdentifier.length).toBeGreaterThan(0);
          }
          if (person.legalPerson) {
            expect(person.legalPerson.name.nameIdentifier.length).toBeGreaterThan(0);
          }
        });
        
        // If dates are present, they should be valid
        [...ivms.originator.originatorPerson, ...ivms.beneficiary.beneficiaryPerson].forEach(person => {
          if (person.naturalPerson?.dateAndPlaceOfBirth) {
            const date = new Date(person.naturalPerson.dateAndPlaceOfBirth.dateOfBirth);
            expect(date.getTime()).not.toBeNaN();
            expect(person.naturalPerson.dateAndPlaceOfBirth.placeOfBirth.length).toBeGreaterThan(0);
          }
        });
      }));
    });
  });

  describe("Edge Case Tests", () => {
    it("should handle empty optional arrays gracefully", () => {
      fc.assert(fc.property(arb.ivms101_2020(), (ivms) => {
        // Optional arrays should be either undefined or have content
        if (ivms.originator.accountNumber !== undefined) {
          expect(ivms.originator.accountNumber.length).toBeGreaterThan(0);
        }
        if (ivms.beneficiary.accountNumber !== undefined) {
          expect(ivms.beneficiary.accountNumber.length).toBeGreaterThan(0);
        }
      }));
    });

    it("should generate consistent national identifier types", () => {
      fc.assert(fc.property(arb.naturalPerson(), (person) => {
        if (person.nationalIdentification) {
          const validNaturalPersonTypes = ["ARNU", "CCPT", "DRLC", "FIIN", "TXID", "SOCS", "IDCD", "MISC"];
          expect(validNaturalPersonTypes).toContain(person.nationalIdentification.nationalIdentifierType);
        }
      }));
      
      fc.assert(fc.property(arb.legalPerson(), (person) => {
        if (person.nationalIdentification) {
          const validLegalEntityTypes = ["RAID", "FIIN", "TXID", "LEIX", "MISC"];
          expect(validLegalEntityTypes).toContain(person.nationalIdentification.nationalIdentifierType);
        }
      }));
    });
  });
});