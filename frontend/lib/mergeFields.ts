import {
  NDAFormData,
  Party,
  ExtractedNDAFields,
  ExtractedParty,
  GenericDocFormData,
  ExtractedGenericFields,
} from "./types";

function mergeParty(current: Party, extracted: ExtractedParty): Party {
  return {
    company: extracted.company ?? current.company,
    signatoryName: extracted.signatoryName ?? current.signatoryName,
    title: extracted.title ?? current.title,
    noticeAddress: extracted.noticeAddress ?? current.noticeAddress,
  };
}

export function mergeNDAFields(
  current: NDAFormData,
  extracted: ExtractedNDAFields
): NDAFormData {
  return {
    purpose: extracted.purpose ?? current.purpose,
    effectiveDate: extracted.effectiveDate ?? current.effectiveDate,
    mndaTermType: extracted.mndaTermType ?? current.mndaTermType,
    mndaTermYears: extracted.mndaTermYears ?? current.mndaTermYears,
    confidentialityTermType:
      extracted.confidentialityTermType ?? current.confidentialityTermType,
    confidentialityTermYears:
      extracted.confidentialityTermYears ?? current.confidentialityTermYears,
    governingLawState: extracted.governingLawState ?? current.governingLawState,
    jurisdictionDescription:
      extracted.jurisdictionDescription ?? current.jurisdictionDescription,
    modifications: extracted.modifications ?? current.modifications,
    party1:
      extracted.party1 != null
        ? mergeParty(current.party1, extracted.party1)
        : current.party1,
    party2:
      extracted.party2 != null
        ? mergeParty(current.party2, extracted.party2)
        : current.party2,
  };
}

export function mergeGenericFields(
  current: GenericDocFormData,
  extracted: ExtractedGenericFields
): GenericDocFormData {
  return {
    party1:
      extracted.party1 != null
        ? mergeParty(current.party1, extracted.party1)
        : current.party1,
    party2:
      extracted.party2 != null
        ? mergeParty(current.party2, extracted.party2)
        : current.party2,
    effectiveDate: extracted.effectiveDate ?? current.effectiveDate,
    term: extracted.term ?? current.term,
    governingLawState: extracted.governingLawState ?? current.governingLawState,
    jurisdictionDescription:
      extracted.jurisdictionDescription ?? current.jurisdictionDescription,
    specialTerms: extracted.specialTerms ?? current.specialTerms,
  };
}
