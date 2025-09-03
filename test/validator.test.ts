import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as IVMS101_2020 from "../src/ivms101_2020";
import * as IVMS101_2023 from "../src/ivms101_2023";
import {
  IVMS101_2020Schema,
  IVMS101_2023Schema,
  IVMS101Schema,
  validateIVMS101,
  isValidIVMS101_2020,
  isValidIVMS101_2023,
  isValidIVMS101,
} from "../src/validator";
import * as arb from "../src/arbitraries";

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
                addressType: "BIZZ",
                streetName: "Business Ave",
                buildingNumber: "456",
                townName: "Los Angeles",
                country: "US",
              },
            ],
            nationalIdentification: {
              nationalIdentifier: "987654321",
              nationalIdentifierType: "LEIX",
              countryOfIssue: "US",
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
          sequence: 1,
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
                addressType: "BIZZ",
                streetName: "Business Ave",
                buildingNumber: "456",
                townName: "Los Angeles",
                country: "US",
              },
            ],
            nationalIdentification: {
              nationalIdentifier: "987654321",
              nationalIdentifierType: "LEIX",
              countryOfIssue: "US",
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
          sequence: 1,
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
              },
            },
          ],
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
                    country: "XX", // Invalid country code
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
      fc.assert(fc.property(arb.ivms101_2020(), (ivms2020) => {
        const result = IVMS101_2020Schema.safeParse(ivms2020);
        expect(result.success).toBe(true);
      }));
    });

    it("should validate all generated IVMS101 2023 structures", () => {
      fc.assert(fc.property(arb.ivms101_2023Valid(), (ivms2023) => {
        const result = IVMS101_2023Schema.safeParse(ivms2023);
        expect(result.success).toBe(true);
      }));
    });

    it("should accept all generated data via union schema", () => {
      fc.assert(fc.property(arb.ivms101(), (ivms) => {
        const result = IVMS101Schema.safeParse(ivms);
        expect(result.success).toBe(true);
      }));
    });

    it("should validate generated data via utility functions", () => {
      fc.assert(fc.property(arb.ivms101_2020(), (ivms2020) => {
        expect(isValidIVMS101_2020(ivms2020)).toBe(true);
        expect(isValidIVMS101(ivms2020)).toBe(true);
        expect(() => validateIVMS101(ivms2020)).not.toThrow();
      }));

      fc.assert(fc.property(arb.ivms101_2023Valid(), (ivms2023) => {
        expect(isValidIVMS101_2023(ivms2023)).toBe(true);
        expect(isValidIVMS101(ivms2023)).toBe(true);
        expect(() => validateIVMS101(ivms2023)).not.toThrow();
      }));
    });

    it("should correctly identify version-specific data", () => {
      fc.assert(fc.property(arb.ivms101_2020(), (ivms2020) => {
        // 2020 data should validate as 2020 but not as 2023
        expect(isValidIVMS101_2020(ivms2020)).toBe(true);
        expect(isValidIVMS101_2023(ivms2020)).toBe(false);
      }));

      fc.assert(fc.property(arb.ivms101_2023Valid(), (ivms2023) => {
        // 2023 data should validate as 2023 but not as 2020
        expect(isValidIVMS101_2023(ivms2023)).toBe(true);
        expect(isValidIVMS101_2020(ivms2023)).toBe(false);
      }));
    });

    it("should validate generated person structures individually", () => {
      fc.assert(fc.property(arb.naturalPerson(), (person) => {
        // Natural person should have valid structure
        expect(person.name.length).toBeGreaterThan(0);
        person.name.forEach(nameId => {
          expect(nameId.primaryIdentifier.trim().length).toBeGreaterThan(0);
          expect(["ALIA", "BIRT", "MAID", "LEGL", "MISC"]).toContain(nameId.nameIdentifierType);
        });
      }));

      fc.assert(fc.property(arb.legalPerson(), (person) => {
        // Legal person should have valid structure
        expect(person.name.length).toBeGreaterThan(0);
        person.name.forEach(nameId => {
          expect(nameId.legalPersonName.trim().length).toBeGreaterThan(0);
          expect(["LEGL", "SHRT", "TRAD"]).toContain(nameId.legalPersonNameIdentifierType);
        });
      }));
    });

    it("should validate generated addresses", () => {
      fc.assert(fc.property(arb.address(), (address) => {
        expect(["HOME", "BIZZ", "GEOG"]).toContain(address.addressType);
        expect(address.townName.trim().length).toBeGreaterThan(0);
        expect(address.country.length).toBe(2); // ISO country codes
      }));
    });

    it("should validate national identification structures", () => {
      fc.assert(fc.property(arb.naturalPersonNationalIdentification(), (natId) => {
        expect(natId.nationalIdentifier.trim().length).toBeGreaterThan(0);
        const validNaturalPersonTypes = ["ARNU", "CCPT", "DRLC", "FIIN", "TXID", "SOCS", "IDCD", "MISC"];
        expect(validNaturalPersonTypes).toContain(natId.nationalIdentifierType);
      }));

      fc.assert(fc.property(arb.legalEntityNationalIdentification(), (natId) => {
        expect(natId.nationalIdentifier.trim().length).toBeGreaterThan(0);
        const validLegalEntityTypes = ["RAID", "FIIN", "TXID", "LEIX", "MISC"];
        expect(validLegalEntityTypes).toContain(natId.nationalIdentifierType);
      }));
    });
  });
});
