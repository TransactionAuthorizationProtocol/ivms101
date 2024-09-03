import * as IVMS101_2020 from "./ivms101_2020";
import * as IVMS101_2023 from "./ivms101_2023";
export type IVMS101 = IVMS101_2020.IVMS101 | IVMS101_2023.IVMS101;

export function ivms101_version(data: IVMS101) {
  return (data as IVMS101_2023.IVMS101).payloadMetadata?.payloadVersion ===
    IVMS101_2023.PayloadVersionCode.V2023
    ? IVMS101_2023.PayloadVersionCode.V2023
    : IVMS101_2023.PayloadVersionCode.V2020;
}

export function ensureVersion(
  version: IVMS101_2023.PayloadVersionCode,
  data: IVMS101,
): IVMS101 {
  if (ivms101_version(data) === version) return data;
  if (version === IVMS101_2023.PayloadVersionCode.V2023)
    return convertTo2023(data as IVMS101_2020.IVMS101);
  return convertFrom2023(data as IVMS101_2023.IVMS101);
}
/**
 * Converts IVMS101 data to IVMS101.2023 format
 * @param data The IVMS101 data to convert
 * @returns The converted IVMS101.2023 data
 */
export function convertTo2023(
  data: IVMS101_2020.IVMS101,
): IVMS101_2023.IVMS101 {
  return {
    originator: {
      originatorPerson: data.originator.originatorPersons.map(convertPerson),
      accountNumber: data.originator.accountNumber,
    },
    beneficiary: {
      beneficiaryPerson: data.beneficiary.beneficiaryPersons.map(convertPerson),
      accountNumber: data.beneficiary.accountNumber,
    },
    originatingVASP: data.originatingVASP
      ? convertPerson(data.originatingVASP)
      : undefined,
    beneficiaryVASP: data.beneficiaryVASP
      ? convertPerson(data.beneficiaryVASP)
      : undefined,
    transferPath: data.transferPath
      ? {
          transferPath: data.transferPath.transferPath.map((tp) => ({
            intermediaryVASP: convertPerson(tp.intermediaryVASP),
            sequence: tp.sequence,
          })),
        }
      : undefined,
    payloadMetadata: {
      transliterationMethod: data.payloadMetadata?.transliterationMethod,
      payloadVersion: IVMS101_2023.PayloadVersionCode.V2023,
    },
  };
}
/**
 * Converts IVMS101.2023 data back to IVMS101 format
 * @param data The IVMS101.2023 data to convert
 * @returns The converted IVMS101 data
 */
export function convertFrom2023(
  data: IVMS101_2023.IVMS101,
): IVMS101_2020.IVMS101 {
  return {
    originator: {
      originatorPersons:
        data.originator.originatorPerson.map(convertPersonBack),
      accountNumber: data.originator.accountNumber,
    },
    beneficiary: {
      beneficiaryPersons:
        data.beneficiary.beneficiaryPerson.map(convertPersonBack),
      accountNumber: data.beneficiary.accountNumber,
    },
    originatingVASP: data.originatingVASP
      ? convertPersonBack(data.originatingVASP)
      : undefined,
    beneficiaryVASP: data.beneficiaryVASP
      ? convertPersonBack(data.beneficiaryVASP)
      : undefined,
    transferPath: data.transferPath
      ? {
          transferPath: data.transferPath.transferPath.map((tp) => ({
            intermediaryVASP: convertPersonBack(tp.intermediaryVASP),
            sequence: tp.sequence,
          })),
        }
      : undefined,
    payloadMetadata: data.payloadMetadata
      ? {
          transliterationMethod: data.payloadMetadata.transliterationMethod,
        }
      : undefined,
  };
}
/**
 * Converts a Person from IVMS101 to IVMS101.2023 format
 * @param person The IVMS101 Person to convert
 * @returns The converted IVMS101.2023 Person
 */
function convertPerson(person: IVMS101_2020.Person): IVMS101_2023.Person {
  return {
    naturalPerson: person.naturalPerson
      ? convertNaturalPerson(person.naturalPerson)
      : undefined,
    legalPerson: person.legalPerson
      ? convertLegalPerson(person.legalPerson)
      : undefined,
  };
}

/**
 * Converts a Person from IVMS101.2023 back to IVMS101 format
 * @param person The IVMS101.2023 Person to convert
 * @returns The converted IVMS101 Person
 */
function convertPersonBack(person: IVMS101_2023.Person): IVMS101_2020.Person {
  return {
    naturalPerson: person.naturalPerson
      ? convertNaturalPersonBack(person.naturalPerson)
      : undefined,
    legalPerson: person.legalPerson
      ? convertLegalPersonBack(person.legalPerson)
      : undefined,
  };
}

function convertNaturalPerson(
  np: IVMS101_2020.NaturalPerson,
): IVMS101_2023.NaturalPerson {
  return {
    ...np,
    name: np.name.map((n) => ({
      ...n,
      naturalPersonNameIdentifierType: n.nameIdentifierType,
    })),
    customerIdentification: np.customerNumber,
  };
}

function convertNaturalPersonBack(
  np: IVMS101_2023.NaturalPerson,
): IVMS101_2020.NaturalPerson {
  const { customerIdentification, ...rest } = np;
  return {
    ...rest,
    name: np.name.map((n) => {
      const { naturalPersonNameIdentifierType, ...nameRest } = n;
      return {
        ...nameRest,
        nameIdentifierType: naturalPersonNameIdentifierType,
      };
    }),
    customerNumber: customerIdentification,
  };
}

function convertLegalPerson(
  lp: IVMS101_2020.LegalPerson,
): IVMS101_2023.LegalPerson {
  return {
    ...lp,
    customerIdentification: lp.customerNumber,
  };
}

function convertLegalPersonBack(
  lp: IVMS101_2023.LegalPerson,
): IVMS101_2020.LegalPerson {
  const { customerIdentification, ...rest } = lp;
  return {
    ...rest,
    customerNumber: customerIdentification,
  };
}
