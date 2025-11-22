import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as arb from "../src/arbitraries";
import {
  IVMS101_2020Schema,
  IVMS101_2023Schema,
  IVMS101Schema,
  isValidIVMS101_2020,
  isValidIVMS101_2023,
  isValidIVMS101,
} from "../src/validator";
import { z } from "zod";

describe("Comprehensive Arbitrary Validation", () => {
  // Test with higher sample sizes for more thorough validation
  const TEST_SAMPLES = 100;
  const EXHAUSTIVE_SAMPLES = 1000;

  describe("Exhaustive IVMS101 2020 Validation", () => {
    it("should generate 100% valid IVMS101 2020 structures", () => {
      let validCount = 0;
      let invalidCount = 0;
      const errors: any[] = [];

      fc.assert(
        fc.property(arb.ivms101_2020(), (ivms) => {
          const result = IVMS101_2020Schema.safeParse(ivms);
          if (result.success) {
            validCount++;
          } else {
            invalidCount++;
            errors.push({
              data: ivms,
              error: result.error,
            });
          }
          // Always return true so we can collect all samples
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );

      if (invalidCount > 0) {
        console.error(`Found ${invalidCount} invalid samples out of ${TEST_SAMPLES}`);
        console.error("First error:", JSON.stringify(errors[0], null, 2));
      }

      expect(invalidCount).toBe(0);
      expect(validCount).toBe(TEST_SAMPLES);
    });

    it("should generate structures with diverse data patterns", () => {
      const samples = fc.sample(arb.ivms101_2020(), EXHAUSTIVE_SAMPLES);

      // Check that we have variation in the generated data
      const hasNaturalPersons = samples.filter(s =>
        s.originator.originatorPersons.some(p => p.naturalPerson)
      );
      const hasLegalPersons = samples.filter(s =>
        s.originator.originatorPersons.some(p => p.legalPerson)
      );
      const hasOptionalFields = samples.filter(s =>
        s.originatingVASP || s.beneficiaryVASP || s.transferPath
      );
      const hasAccountNumbers = samples.filter(s =>
        s.originator.originatorPersons.some(p => p.accountNumber) ||
        s.beneficiary.beneficiaryPersons.some(p => p.accountNumber)
      );

      // Ensure we're generating diverse structures
      expect(hasNaturalPersons.length).toBeGreaterThan(0);
      expect(hasLegalPersons.length).toBeGreaterThan(0);
      expect(hasOptionalFields.length).toBeGreaterThan(0);
      expect(hasAccountNumbers.length).toBeGreaterThan(0);

      // All should be valid
      samples.forEach(sample => {
        expect(isValidIVMS101_2020(sample)).toBe(true);
      });
    });
  });

  describe("Exhaustive IVMS101 2023 Validation", () => {
    it("should generate 100% valid IVMS101 2023 structures", () => {
      let validCount = 0;
      let invalidCount = 0;
      const errors: any[] = [];

      fc.assert(
        fc.property(arb.ivms101_2023Valid(), (ivms) => {
          const result = IVMS101_2023Schema.safeParse(ivms);
          if (result.success) {
            validCount++;
          } else {
            invalidCount++;
            errors.push({
              data: ivms,
              error: result.error,
            });
          }
          // Always return true so we can collect all samples
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );

      if (invalidCount > 0) {
        console.error(`Found ${invalidCount} invalid samples out of ${TEST_SAMPLES}`);
        console.error("First error:", JSON.stringify(errors[0], null, 2));
      }

      expect(invalidCount).toBe(0);
      expect(validCount).toBe(TEST_SAMPLES);
    });

    it("should always set payloadVersion correctly for 2023", () => {
      fc.assert(
        fc.property(arb.ivms101_2023Valid(), (ivms) => {
          expect(ivms.payloadMetadata?.payloadVersion).toBe("101.2023");
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });

    it("should use correct 2023 field names", () => {
      fc.assert(
        fc.property(arb.ivms101_2023Valid(), (ivms) => {
          // Check correct field names
          expect(ivms.originator).toHaveProperty("originatorPerson");
          expect(ivms.originator).not.toHaveProperty("originatorPersons");
          expect(ivms.beneficiary).toHaveProperty("beneficiaryPerson");
          expect(ivms.beneficiary).not.toHaveProperty("beneficiaryPersons");

          // Check natural person name identifier field
          ivms.originator.originatorPerson.forEach(person => {
            if (person.naturalPerson) {
              person.naturalPerson.name.nameIdentifier.forEach(nameId => {
                expect(nameId).toHaveProperty("naturalPersonNameIdentifierType");
                expect(nameId).not.toHaveProperty("nameIdentifierType");
              });
              // Check customer identification field
              expect(person.naturalPerson).not.toHaveProperty("customerNumber");
              if ((person.naturalPerson as any).customerIdentification !== undefined) {
                expect(person.naturalPerson).toHaveProperty("customerIdentification");
              }
            }
            if (person.legalPerson) {
              expect(person.legalPerson).not.toHaveProperty("customerNumber");
              if ((person.legalPerson as any).customerIdentification !== undefined) {
                expect(person.legalPerson).toHaveProperty("customerIdentification");
              }
            }
          });

          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });
  });

  describe("Field-level Validation", () => {
    it("should generate valid country codes", () => {
      fc.assert(
        fc.property(arb.countryCode(), (code) => {
          // The arbitrary uses a limited set, but they should all be valid
          const validCodes = [
            "US", "GB", "DE", "FR", "JP", "CA", "AU", "CH",
            "NL", "SE", "NO", "DK", "FI", "SG", "HK", "KR"
          ];
          expect(validCodes).toContain(code);
          expect(code.length).toBe(2);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });

    it("should generate non-empty strings for required fields", () => {
      fc.assert(
        fc.property(arb.personName(), (name) => {
          expect(name.trim().length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );

      fc.assert(
        fc.property(arb.identifier(), (id) => {
          expect(id.trim().length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );

      fc.assert(
        fc.property(arb.addressComponent(), (component) => {
          expect(component.trim().length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });

    it("should generate valid dates", () => {
      fc.assert(
        fc.property(arb.date(), (dateStr) => {
          const date = new Date(dateStr);
          expect(date.getTime()).not.toBeNaN();
          expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });

    it("should generate correct national identifier types for persons", () => {
      fc.assert(
        fc.property(arb.naturalPersonNationalIdentification(), (natId) => {
          const validTypes = ["ARNU", "CCPT", "DRLC", "FIIN", "TXID", "SOCS", "IDCD", "MISC"];
          expect(validTypes).toContain(natId.nationalIdentifierType);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );

      fc.assert(
        fc.property(arb.legalEntityNationalIdentification(), (natId) => {
          const validTypes = ["RAID", "FIIN", "TXID", "LEIX", "MISC"];
          expect(validTypes).toContain(natId.nationalIdentifierType);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });

    it("should enforce XOR constraint for Person type", () => {
      fc.assert(
        fc.property(arb.person(), (person) => {
          const hasNatural = person.naturalPerson !== undefined;
          const hasLegal = person.legalPerson !== undefined;
          // Exactly one should be defined
          expect(hasNatural !== hasLegal).toBe(true);
          expect(hasNatural || hasLegal).toBe(true);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });

    it("should ensure arrays have minimum required length", () => {
      fc.assert(
        fc.property(arb.originator(), (originator) => {
          expect(originator.originatorPersons.length).toBeGreaterThanOrEqual(1);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );

      fc.assert(
        fc.property(arb.beneficiary(), (beneficiary) => {
          expect(beneficiary.beneficiaryPersons.length).toBeGreaterThanOrEqual(1);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });

    it("should generate valid address structures", () => {
      fc.assert(
        fc.property(arb.address(), (address) => {
          expect(["HOME", "BIZZ", "GEOG"]).toContain(address.addressType);
          expect(address.townName.trim().length).toBeGreaterThan(0);
          expect(address.country.length).toBe(2);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });
  });

  describe("Union Schema Validation", () => {
    it("should generate data valid for the union schema", () => {
      fc.assert(
        fc.property(arb.ivms101(), (ivms) => {
          const result = IVMS101Schema.safeParse(ivms);
          expect(result.success).toBe(true);
          expect(isValidIVMS101(ivms)).toBe(true);
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });
  });

  describe("Edge Cases and Boundary Testing", () => {
    it("should handle optional fields correctly", () => {
      const samples2020 = fc.sample(arb.ivms101_2020(), 50);
      const samples2023 = fc.sample(arb.ivms101_2023Valid(), 50);

      // Check that optional fields are sometimes present, sometimes not
      const withOptional2020 = samples2020.filter(s =>
        s.originatingVASP || s.beneficiaryVASP || s.transferPath || s.payloadMetadata
      );

      // Some samples should have optional fields
      expect(withOptional2020.length).toBeGreaterThan(0);

      // Check variation in optional fields across samples
      const withOriginatingVASP = samples2020.filter(s => s.originatingVASP).length;
      const withBeneficiaryVASP = samples2020.filter(s => s.beneficiaryVASP).length;
      const withTransferPath = samples2020.filter(s => s.transferPath).length;
      const withPayloadMetadata = samples2020.filter(s => s.payloadMetadata).length;

      // Should have variation (not all samples have all optional fields)
      expect(withOriginatingVASP).toBeLessThan(50);
      expect(withBeneficiaryVASP).toBeLessThan(50);

      // All should still be valid
      samples2020.forEach(sample => {
        expect(isValidIVMS101_2020(sample)).toBe(true);
      });
      samples2023.forEach(sample => {
        expect(isValidIVMS101_2023(sample)).toBe(true);
      });
    });

    it("should generate valid nested structures", () => {
      fc.assert(
        fc.property(arb.ivms101_2020(), (ivms) => {
          // Check nested person structures
          [...ivms.originator.originatorPersons, ...ivms.beneficiary.beneficiaryPersons].forEach(person => {
            if (person.naturalPerson) {
              expect(person.naturalPerson.name.nameIdentifier.length).toBeGreaterThanOrEqual(1);
              person.naturalPerson.name.nameIdentifier.forEach(nameId => {
                expect(nameId.primaryIdentifier.trim().length).toBeGreaterThan(0);
              });
            }
            if (person.legalPerson) {
              expect(person.legalPerson.name.nameIdentifier.length).toBeGreaterThanOrEqual(1);
              person.legalPerson.name.nameIdentifier.forEach(nameId => {
                expect(nameId.legalPersonName.trim().length).toBeGreaterThan(0);
              });
            }
          });
          return true;
        }),
        { numRuns: TEST_SAMPLES }
      );
    });
  });

  describe("Statistical Analysis", () => {
    it("should provide good distribution of person types", () => {
      const samples = fc.sample(arb.person(), 1000);
      const naturalPersonCount = samples.filter(p => p.naturalPerson).length;
      const legalPersonCount = samples.filter(p => p.legalPerson).length;

      // Should have reasonable distribution (not all one type)
      expect(naturalPersonCount).toBeGreaterThan(100);
      expect(legalPersonCount).toBeGreaterThan(100);

      // Should total to the sample size
      expect(naturalPersonCount + legalPersonCount).toBe(1000);
    });

    it("should generate diverse optional field combinations", () => {
      const samples = fc.sample(arb.naturalPerson(), 100);

      const withNatId = samples.filter(p => p.nationalIdentification).length;
      const withCustomerNum = samples.filter(p => p.customerNumber).length;
      const withDOB = samples.filter(p => p.dateAndPlaceOfBirth).length;
      const withCountryRes = samples.filter(p => p.countryOfResidence).length;
      const withGeoAddr = samples.filter(p => p.geographicAddress).length;

      // Should have variation in optional fields
      expect(withNatId).toBeGreaterThan(0);
      expect(withNatId).toBeLessThan(100);
      expect(withCustomerNum).toBeGreaterThan(0);
      expect(withCustomerNum).toBeLessThan(100);
      // Add more assertions as needed
    });
  });
});