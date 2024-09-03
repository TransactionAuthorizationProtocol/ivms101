import { describe, it, expect } from "vitest";
import * as IVMS101 from "../src/ivms101_2020";
import * as IVMS101_2023 from "../src/ivms101_2023";
import { convertTo2023, convertFrom2023 } from "../src/converter";

describe("IVMS101 Converter", () => {
  const sampleIVMS101: IVMS101.IVMS101 = {
    originator: {
      originatorPersons: [
        {
          naturalPerson: {
            name: [
              {
                primaryIdentifier: "Smith",
                secondaryIdentifier: "John",
                nameIdentifierType: "LEGL",
              },
            ],
            customerNumber: "123456",
          },
        },
      ],
      accountNumber: ["ACC001"],
    },
    beneficiary: {
      beneficiaryPersons: [
        {
          legalPerson: {
            name: [
              {
                legalPersonName: "Acme Corp",
                legalPersonNameIdentifierType: "LEGL",
              },
            ],
            customerNumber: "789012",
          },
        },
      ],
    },
    payloadMetadata: {
      transliterationMethod: ["othr"],
    },
  };

  it("should convert IVMS101 to IVMS101_2023", () => {
    const converted = convertTo2023(sampleIVMS101);

    expect(
      converted.originator.originatorPerson[0].naturalPerson?.name[0]
        .naturalPersonNameIdentifierType,
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
  });

  it("should convert IVMS101_2023 back to IVMS101", () => {
    const converted = convertTo2023(sampleIVMS101);
    const backConverted = convertFrom2023(converted);

    expect(backConverted).toEqual(sampleIVMS101);
  });
});
