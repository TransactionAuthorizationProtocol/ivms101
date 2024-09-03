import * as IVMS101 from "./ivms101";
import * as IVMS101_2023 from "./ivms101_2023";

export function convertTo2023(
  data: IVMS101.IVMS101,
): IVMS101_2023.IVMS101_2023 {
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
      payloadVersion: "101.2023",
    },
  };
}

export function convertFrom2023(
  data: IVMS101_2023.IVMS101_2023,
): IVMS101.IVMS101 {
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

function convertPerson(person: IVMS101.Person): IVMS101_2023.Person {
  return {
    naturalPerson: person.naturalPerson
      ? convertNaturalPerson(person.naturalPerson)
      : undefined,
    legalPerson: person.legalPerson
      ? convertLegalPerson(person.legalPerson)
      : undefined,
  };
}

function convertPersonBack(person: IVMS101_2023.Person): IVMS101.Person {
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
  np: IVMS101.NaturalPerson,
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
): IVMS101.NaturalPerson {
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

function convertLegalPerson(lp: IVMS101.LegalPerson): IVMS101_2023.LegalPerson {
  return {
    ...lp,
    customerIdentification: lp.customerNumber,
  };
}

function convertLegalPersonBack(
  lp: IVMS101_2023.LegalPerson,
): IVMS101.LegalPerson {
  const { customerIdentification, ...rest } = lp;
  return {
    ...rest,
    customerNumber: customerIdentification,
  };
}
