export interface Source {
  id: string;
  type: 'pdf' | 'txt';
  location: string;
  label: string;
  hasImages?: boolean; //A true value triggers OCR 
}

export const SOURCES: Source[] = [

  //TXT FILES 
  {
    id: 'src-txt-001',
    type: 'txt',
    location: './data/pdfs/apf_faqs.txt',
    label: 'APF General FAQs',
  },
  {
    id: 'src-txt-002',
    type: 'txt',
    location: './data/pdfs/fertility_treatment_faqs.txt',
    label: 'APF Fertility Treatment FAQs',
  },
  {
    id: 'src-txt-003',
    type: 'txt',
    location: './data/pdfs/general_faqs.txt',
    label: 'APF General FAQs (Extended)',
  },
  {
    id: 'src-txt-004',
    type: 'txt',
    location: './data/pdfs/pelvic_floor_faqs.txt',
    label: 'APF Pelvic Floor FAQs',
  },
  {
    id: 'src-txt-005',
    type: 'txt',
    location: './data/pdfs/postnatal_faqs.txt',
    label: 'APF Postnatal FAQs',
  },
  {
    id: 'src-txt-006',
    type: 'txt',
    location: './data/pdfs/pregnancy_faqs.txt',
    label: 'APF Pregnancy FAQs',
  },

  // APF ACTIVITY GUIDES 
  {
    id: 'src-pdf-001',
    type: 'pdf',
    location: './data/pdfs/apf_guide_Aquantal_during_pregnancy.pdf',
    label: 'APF Guide: Aquanatal During Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-002',
    type: 'pdf',
    location: './data/pdfs/apf_guide_cycling_during_pregnancy.pdf',
    label: 'APF Guide: Cycling During Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-003',
    type: 'pdf',
    location: './data/pdfs/apf_guide_dancing_during_pregnancy.pdf',
    label: 'APF Guide: Dancing During Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-004',
    type: 'pdf',
    location: './data/pdfs/apf_guide_homeworkout_during_pregnancy.pdf',
    label: 'APF Guide: Home Workout During Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-005',
    type: 'pdf',
    location: './data/pdfs/apf_guide_personaltraining_during_pregnancy.pdf',
    label: 'APF Guide: Personal Training During Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-006',
    type: 'pdf',
    location: './data/pdfs/apf_guide_pilates_during_pregnancy.pdf',
    label: 'APF Guide: Pilates During Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-007',
    type: 'pdf',
    location: './data/pdfs/apf_guide_resistancetraining_during_pregnancy.pdf',
    label: 'APF Guide: Resistance Training During Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-008',
    type: 'pdf',
    location: './data/pdfs/apf_guide_running_during_pregnancy.pdf',
    label: 'APF Guide: Running During Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-009',
    type: 'pdf',
    location: './data/pdfs/apf_guide_swimming_during_pregnancy.pdf',
    label: 'APF Guide: Swimming During Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-010',
    type: 'pdf',
    location: './data/pdfs/apf_guide_walking_during_pregnancy.pdf',
    label: 'APF Guide: Walking During Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-011',
    type: 'pdf',
    location: './data/pdfs/apf_guide_yoga_during_pregnancy.pdf',
    label: 'APF Guide: Yoga During Pregnancy',
    hasImages: false,
  },

  // APF ORGANISATIONAL DOCS 
  {
    id: 'src-pdf-012',
    type: 'pdf',
    location: './data/pdfs/APF-Our-Big-Push-2026.pdf',
    label: 'APF: Our Big Push 2026',
    hasImages: false,
  },
  {
    id: 'src-pdf-013',
    type: 'pdf',
    location: './data/pdfs/endorsement-programme.pdf',
    label: 'APF Endorsement Programme',
    hasImages: false,
  },

  //CLINICAL GUIDELINES & RESEARCH
  {
    id: 'src-pdf-014',
    type: 'pdf',
    location: './data/pdfs/CSEP-PATH_GAQ_P_UK version.pdf',
    label: 'GAQ-P: Get Active Questionnaire for Pregnancy (UK)',
    hasImages: false,
  },
  {
    id: 'src-pdf-015',
    type: 'pdf',
    location: './data/pdfs/CSEP-PATH_GAQ_P_HCP_UK_230123.pdf',
    label: 'GAQ-P: Healthcare Provider Version (UK)',
    hasImages: false,
  },
  {
    id: 'src-pdf-016',
    type: 'pdf',
    location: './data/pdfs/development-of-the-get-active-questionnaire-for-pregnancy-breaking-down-barriers-to-prenatal-exercise.pdf',
    label: 'Research: Development of the GAQ-P',
    hasImages: false,
  },
  {
    id: 'src-pdf-017',
    type: 'pdf',
    location: './data/pdfs/bjsports-2024-109104.full.pdf',
    label: 'Research: BJSM 2024 — Physical Activity in Pregnancy',
    hasImages: false,
  },
  {
    id: 'src-pdf-018',
    type: 'pdf',
    location: './data/pdfs/1395.full.pdf',
    label: 'Research: Clinical Study (1395)',
    hasImages: false,
  },

  //UK CMO PHYSICAL ACTIVITY GUIDELINES 
  {
    id: 'src-pdf-019',
    type: 'pdf',
    location: './data/pdfs/uk-chief-medical-officers-physical-activity-guidelines.pdf',
    label: 'UK CMO Physical Activity Guidelines',
    hasImages: false,
  },
  {
    id: 'src-pdf-020',
    type: 'pdf',
    location: './data/pdfs/CMOs-physical-activity-guidelines-appendices-march-2023.pdf',
    label: 'UK CMO Physical Activity Guidelines — Appendices (2023)',
    hasImages: false,
  },
  {
    id: 'src-pdf-021',
    type: 'pdf',
    location: './data/pdfs/Canllawiau_Gweithgarwch_Corfforol_Prif_Swyddogion_Meddygol_y_DU.pdf',
    label: 'UK CMO Physical Activity Guidelines (Welsh)',
    hasImages: false,
  },

  // POSTNATAL & INFOGRAPHICS 
  {
    id: 'src-pdf-022',
    type: 'pdf',
    location: './data/pdfs/Physical activity for women after childbirth_ birth to 12 months (text of the infographic) - GOV.UK.pdf',
    label: 'GOV.UK: Physical Activity After Childbirth (Birth to 12 Months)',
    hasImages: false,
  },
  {
    id: 'src-pdf-023',
    type: 'pdf',
    location: './data/pdfs/postpartum_infographic.pdf',
    label: 'Postpartum Physical Activity Infographic',
    hasImages: true, 
  },
  {
    id: 'src-pdf-024',
    type: 'pdf',
    location: './data/pdfs/thismummoves-postnatal-leaflet.pdf',
    label: 'This Mum Moves: Postnatal Leaflet',
    hasImages: true, 
  },
  {
    id: 'src-pdf-025',
    type: 'pdf',
    location: './data/pdfs/thismummoves-pregnancy-leaflet.pdf',
    label: 'This Mum Moves: Pregnancy Leaflet',
    hasImages: true,
  },

  // SOCIAL MEDIA
  {
    id: 'src-pdf-026',
    type: 'pdf',
    location: './data/pdfs/TMM_Social Media Resource Pack_Jan 2023.pdf',
    label: 'This Mum Moves: Social Media Resource Pack (Jan 2023)',
    hasImages: true, // ← resource pack likely image-heavy
  },
];