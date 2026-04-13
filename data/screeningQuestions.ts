// src/data/screeningQuestions.ts
//
// Pregnancy questions: drawn directly from GAQ-P (apfData.ts APF_Q_DATASET).
// Postnatal questions: drawn from the International Delphi study and POGP leaflets.
//
// Each question has a yesAction:
//   'refer_immediately'  → stop screening, tell user to see GP/midwife before any activity
//   'refer_and_continue' → flag the concern, keep going through remaining questions
//   'note_and_continue'  → acknowledge (e.g. anxiety question), then continue to chat

export interface ScreeningQuestion {
  id: string;
  text: string;
  yesAction: 'refer_immediately' | 'refer_and_continue' | 'note_and_continue';
}

// ── PREGNANCY SCREENING ────────────────────────────────────────────────────
// Source: GAQ-P (apfData.ts APF_Q_DATASET)
// Section 1 = clinical contraindications → refer_immediately
// Section 2 = history questions          → refer_and_continue
// Sections 3 & 4 = open questions        → note_and_continue / refer_and_continue

export const PREGNANCY_SCREENING_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 'preg-intro',
    text: "Before we dive in, I'd like to run through a few quick health questions — just to make sure I point you in the right direction. 😊 There are no wrong answers!\n\nDo you have any mild, moderate, or severe respiratory or cardiovascular disease — for example, chronic bronchitis or a heart condition?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-b',
    text: "Do you have epilepsy that is not currently stable?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-c',
    text: "Do you have Type 1 diabetes that isn't stable, or is your blood sugar outside of your target ranges?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-d',
    text: "Do you have thyroid disease that isn't stable, or is your thyroid function outside of your target ranges?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-e',
    text: "Do you have an eating disorder or are you experiencing malnutrition?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-f',
    text: "Are you pregnant with twins at 28 weeks or later — or expecting triplets or more?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-g',
    text: "Have you been told you have a low red blood cell count (anaemia), and are you experiencing high levels of fatigue or light-headedness because of it?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-h',
    text: "Do you have high blood pressure — such as pre-eclampsia, gestational hypertension, or chronic hypertension that isn't stable?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-i',
    text: "Have you been told your baby is growing slowly (sometimes called intrauterine growth restriction)?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-j',
    text: "Have you had any unexplained bleeding, ruptured membranes, or signs of labour before 37 weeks?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-k',
    text: "Have you been told your placenta is partially or completely covering your cervix (placenta praevia)?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-l',
    text: "Do you have a weak cervix (sometimes called cervical incompetence)?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-01-m',
    text: "Do you have a stitch or tape in place to reinforce your cervix (a cerclage)?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'preg-02-a',
    text: "Have you had two or more miscarriages — losses before 20 weeks?",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'preg-02-b',
    text: "Have you previously had an early delivery before 37 weeks in a past pregnancy?",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'preg-03',
    text: "Is there any other medical condition you have that might affect your ability to be physically active during pregnancy? If yes, feel free to describe it briefly.",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'preg-04',
    text: "And finally — is there any other reason you're feeling concerned about physical activity during your pregnancy? There's no wrong answer here! 💛",
    yesAction: 'note_and_continue',
  },
];

// ── POSTNATAL SCREENING ────────────────────────────────────────────────────
// Source: International Delphi study of clinical and exercise professionals'
//         opinion of physical activity prescreening and contraindications for
//         postpartum physical activity; POGP Patient Leaflets.

export const POSTNATAL_SCREENING_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 'post-intro',
    text: "Congratulations on your little one! 🎉 Before we get into the good stuff, I'd like to run through a quick health check to make sure you're ready to get moving safely.\n\nHave you had any loss of consciousness for any reason since giving birth?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-02',
    text: "Have you noticed any problems with coordination, muscle weakness, or balance?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-03',
    text: "Have you had any signs of a blood clot — for example, leg pain or swelling, warm or red skin on your leg, or sudden shortness of breath?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-04',
    text: "Is your blood pressure elevated (above 140/90) and not yet under control?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-05',
    text: "Are you currently experiencing an eating disorder or malnutrition?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-06',
    text: "Have you been diagnosed with postpartum cardiomyopathy — a heart condition that can develop after childbirth?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-07',
    text: "Have you had any new chest pain, dizziness, or stroke-like symptoms — such as face drooping, arm weakness, or slurred speech — during everyday activities or at rest?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-08',
    text: "Are you experiencing severe abdominal pain?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-09',
    text: "Do you get chest pain, dizziness, or feel lightheaded specifically during exercise?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-10',
    text: "Do you have any breathing difficulties at rest that don't improve with medication?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-11',
    text: "Do you have kidney disease?",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'post-12',
    text: "Are you experiencing excessive fatigue — beyond normal tiredness — that doesn't improve even when you rest?",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'post-13',
    text: "Do you have a severe infection right now, with fever, body aches, or swollen glands?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-14',
    text: "Do you have a broken bone or any other significant injury?",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'post-15',
    text: "If you had a caesarean section — is there pain at the incision site that gets worse when you move or exercise?",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'post-16',
    text: "Do you have any vaginal bleeding that isn't your normal period?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-17',
    text: "Do you have any other medical condition that might affect your ability to be physically active after having your baby? If yes, feel free to describe it briefly.",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'post-18',
    text: "And last one — are you feeling anxious or worried about returning to or increasing your physical activity after birth? There's genuinely no wrong answer here. 💛",
    yesAction: 'note_and_continue',
  },
];