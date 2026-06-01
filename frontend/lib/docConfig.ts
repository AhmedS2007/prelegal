export interface DocConfig {
  id: string;
  name: string;
  description: string;
  filename: string;
  party1Label: string;
  party2Label: string;
  isNDA: boolean;
}

export const DOC_CONFIGS: DocConfig[] = [
  {
    id: "mnda",
    name: "Mutual Non-Disclosure Agreement",
    description:
      "Standard mutual NDA created by a committee of over 40 attorneys. Covers confidentiality obligations between two parties sharing sensitive information.",
    filename: "Mutual-NDA.md",
    party1Label: "Party 1",
    party2Label: "Party 2",
    isNDA: true,
  },
  {
    id: "mnda-coverpage",
    name: "Mutual NDA Cover Page",
    description:
      "Cover page template for the Common Paper Mutual NDA. Contains the business terms (party names, purpose, term) to be filled in and signed by both parties.",
    filename: "Mutual-NDA-coverpage.md",
    party1Label: "Party 1",
    party2Label: "Party 2",
    isNDA: true,
  },
  {
    id: "csa",
    name: "Cloud Service Agreement",
    description:
      "Standard agreement for selling and buying cloud software and SaaS products. Covers subscription terms, order forms, acceptable use, and service levels.",
    filename: "CSA.md",
    party1Label: "Provider",
    party2Label: "Customer",
    isNDA: false,
  },
  {
    id: "design-partner",
    name: "Design Partner Agreement",
    description:
      "Standard agreement for companies working with design partners to test and provide feedback on early-stage products. Covers access rights, feedback ownership, and confidentiality.",
    filename: "design-partner-agreement.md",
    party1Label: "Provider",
    party2Label: "Partner",
    isNDA: false,
  },
  {
    id: "sla",
    name: "Service Level Agreement",
    description:
      "Standard SLA defining uptime commitments, incident response times, and remedies. Designed to be used alongside the Common Paper Cloud Service Agreement.",
    filename: "sla.md",
    party1Label: "Provider",
    party2Label: "Customer",
    isNDA: false,
  },
  {
    id: "psa",
    name: "Professional Services Agreement",
    description:
      "Standard agreement for professional services engagements. Covers statements of work, deliverables, payment terms, IP ownership, and warranties.",
    filename: "psa.md",
    party1Label: "Provider",
    party2Label: "Customer",
    isNDA: false,
  },
  {
    id: "dpa",
    name: "Data Processing Agreement",
    description:
      "Standard agreement governing data processing activities between a controller and processor. Covers GDPR and CCPA compliance, security obligations, and sub-processor rules.",
    filename: "DPA.md",
    party1Label: "Provider",
    party2Label: "Customer",
    isNDA: false,
  },
  {
    id: "software-license",
    name: "Software License Agreement",
    description:
      "Standard agreement for licensing software to customers. Covers license grants, order forms, restrictions, support, and IP ownership.",
    filename: "Software-License-Agreement.md",
    party1Label: "Provider",
    party2Label: "Customer",
    isNDA: false,
  },
  {
    id: "partnership",
    name: "Partnership Agreement",
    description:
      "Standard agreement for business partnerships. Covers revenue sharing, referral fees, co-marketing obligations, and partner program terms.",
    filename: "Partnership-Agreement.md",
    party1Label: "Provider",
    party2Label: "Partner",
    isNDA: false,
  },
  {
    id: "pilot",
    name: "Pilot Agreement",
    description:
      "Short-term agreement for trialing a product or service before committing to a longer-term deal. Covers scope, duration, payment, and path to a full commercial agreement.",
    filename: "Pilot-Agreement.md",
    party1Label: "Provider",
    party2Label: "Customer",
    isNDA: false,
  },
  {
    id: "baa",
    name: "Business Associate Agreement",
    description:
      "Standard HIPAA-compliant agreement governing the use and disclosure of protected health information (PHI) between a covered entity and a business associate.",
    filename: "BAA.md",
    party1Label: "Covered Entity",
    party2Label: "Business Associate",
    isNDA: false,
  },
  {
    id: "ai-addendum",
    name: "AI Addendum",
    description:
      "Standard addendum addressing AI-specific terms including data use for model training, output ownership, and AI-related liability. Designed to be used alongside a primary service agreement.",
    filename: "AI-Addendum.md",
    party1Label: "Provider",
    party2Label: "Customer",
    isNDA: false,
  },
];
