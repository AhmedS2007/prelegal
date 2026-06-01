import { NDAFormData, Party, ExtractedNDAFields, ExtractedParty } from "./types";

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
