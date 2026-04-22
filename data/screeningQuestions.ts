// src/data/screeningQuestions.ts
//
// Pregnancy questions: drawn directly from GAQ-P
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
  explainTerm?: string;
}

// ── PREGNANCY SCREENING (GAQ-P) ───────────────────────────────────────────────

export const PREGNANCY_SCREENING_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 'preg-intro',
    text: "Before we get into the fun stuff, I'd love to ask you a few quick health questions — it only takes a minute and helps me give you the right guidance. No wrong answers at all! 😊\n\nHas a doctor ever mentioned anything about your heart or lungs — for example, a cardiovascular disease like a heart condition, or a breathing condition like chronic bronchitis?",
    yesAction: 'refer_immediately',
    explainTerm: "cardiovascular disease",
  },
  {
    id: 'preg-01-b',
    text: "Do you have epilepsy — and has it been difficult to manage or control lately?",
    yesAction: 'refer_immediately',
    explainTerm: "epilepsy",
  },
  {
    id: 'preg-01-c',
    text: "Do you have Type 1 diabetes? If so, has your blood sugar been outside your target ranges recently?",
    yesAction: 'refer_immediately',
    explainTerm: "diabetes type 1",
  },
  {
    id: 'preg-01-d',
    text: "Have you been told you have a thyroid condition — and has your thyroid function been outside your target ranges or difficult to keep under control?",
    yesAction: 'refer_immediately',
    explainTerm: "thyroid",
  },
  {
    id: 'preg-01-e',
    text: "Are you currently experiencing an eating disorder or malnutrition — for example, struggling with your relationship with food or not getting enough nutrition?",
    yesAction: 'refer_immediately',
    explainTerm: "eating disorder",
  },
  {
    id: 'preg-01-f',
    text: "Are you expecting a multiple pregnancy — like twins at 28 weeks or more, or triplets or higher at any stage?",
    yesAction: 'refer_immediately',
    explainTerm: "multiple pregnancy",
  },
  {
    id: 'preg-01-g',
    text: "Have you been told you have anaemia — low red blood cell levels — and are you experiencing high levels of fatigue or light-headedness because of it?",
    yesAction: 'refer_immediately',
    explainTerm: "anaemia",
  },
  {
    id: 'preg-01-h',
    text: "How has your blood pressure been during this pregnancy? Has your midwife or doctor mentioned pre-eclampsia, gestational hypertension, or any blood pressure that's been hard to control?",
    yesAction: 'refer_immediately',
    explainTerm: "pre-eclampsia",
  },
  {
    id: 'preg-01-i',
    text: "Has your doctor or midwife mentioned that your baby may have intrauterine growth restriction — meaning they might be growing more slowly than expected?",
    yesAction: 'refer_immediately',
    explainTerm: "intrauterine growth restriction",
  },
  {
    id: 'preg-01-j',
    text: "Have you had any unexplained bleeding, ruptured membranes (your waters breaking), or signs of early labour before 37 weeks?",
    yesAction: 'refer_immediately',
    explainTerm: "ruptured membranes",
  },
  {
    id: 'preg-01-k',
    text: "Has anyone mentioned that you have placenta praevia — where your placenta is partially or fully covering the cervix?",
    yesAction: 'refer_immediately',
    explainTerm: "placenta praevia",
  },
  {
    id: 'preg-01-l',
    text: "Have you been told you have an incompetent cervix — sometimes called a weak or short cervix — that may not stay closed during pregnancy?",
    yesAction: 'refer_immediately',
    explainTerm: "cervical incompetence",
  },
  {
    id: 'preg-01-m',
    text: "Do you have a cerclage in place — a stitch or tape used to reinforce and support your cervix during pregnancy?",
    yesAction: 'refer_immediately',
    explainTerm: "cerclage",
  },
  {
    id: 'preg-02-a',
    text: "Have you experienced recurrent miscarriages — losing two or more pregnancies before 20 weeks?",
    yesAction: 'refer_and_continue',
    explainTerm: "miscarriage",
  },
  {
    id: 'preg-02-b',
    text: "Have you had a preterm birth in a previous pregnancy — where your baby arrived before 37 weeks?",
    yesAction: 'refer_and_continue',
    explainTerm: "premature birth / preterm birth",
  },
  {
    id: 'preg-03',
    text: "Is there anything else health-wise that you think might be worth mentioning — anything that could affect how you move or exercise during pregnancy?",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'preg-04',
    text: "Last one, I promise! Is there anything else making you feel a bit nervous or unsure about being active during your pregnancy? Totally okay if there is — just good to know! 💛",
    yesAction: 'note_and_continue',
  },
];

// ── POSTNATAL SCREENING (GAQ-PP) ──────────────────────────────────────────────

export const POSTNATAL_SCREENING_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 'post-intro',
    text: "Congratulations on your little one! 🎉 Before we get into the good stuff, I'd love to ask a few quick questions — just to make sure we get the activity guidance right for where you're at right now.\n\nSince giving birth, have you ever fainted or experienced a loss of consciousness at any point?",
    yesAction: 'refer_immediately',
    explainTerm: "loss of consciousness",
  },
  {
    id: 'post-02',
    text: "Have you noticed anything unusual with your balance, coordination, or muscle strength — like feeling unsteady on your feet?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-03',
    text: "Have you had any pain, swelling or redness in your legs — or felt suddenly short of breath for no obvious reason? These can sometimes be signs of a blood clot or DVT (deep vein thrombosis).",
    yesAction: 'refer_immediately',
    explainTerm: "dvt",
  },
  {
    id: 'post-04',
    text: "How has your blood pressure been since having your baby? Has it been elevated — for example, above 140/90 — or hard to keep under control? This is sometimes called hypertension.",
    yesAction: 'refer_immediately',
    explainTerm: "hypertension",
  },
  {
    id: 'post-05',
    text: "Are you currently experiencing an eating disorder or malnutrition — for example, struggling with your relationship with food or not getting enough nutrition?",
    yesAction: 'refer_immediately',
    explainTerm: "eating disorder",
  },
  {
    id: 'post-06',
    text: "Has a doctor mentioned anything about your heart since you gave birth — like a condition called postpartum cardiomyopathy, where the heart becomes weakened after birth?",
    yesAction: 'refer_immediately',
    explainTerm: "postpartum cardiomyopathy",
  },
  {
    id: 'post-07',
    text: "Have you had any new chest pain, dizziness, or stroke-like symptoms — such as facial drooping, arm weakness, or difficulty speaking — during everyday activities or at rest?",
    yesAction: 'refer_immediately',
    explainTerm: "stroke",
  },
  {
    id: 'post-08',
    text: "Are you having any severe abdominal pain — strong pain in your tummy or abdomen that doesn't go away?",
    yesAction: 'refer_immediately',
    explainTerm: "abdominal pain",
  },
  {
    id: 'post-09',
    text: "When you do any physical activity, do you get chest pain, feel dizzy, or feel light-headed? You might also notice heart palpitations — your heart beating faster or harder than usual.",
    yesAction: 'refer_immediately',
    explainTerm: "heart palpitations",
  },
  {
    id: 'post-10',
    text: "Are you having any trouble breathing even when you're just resting — and it doesn't seem to improve with medication?",
    yesAction: 'refer_immediately',
  },
  {
    id: 'post-11',
    text: "Have you been told you have kidney disease — a condition where your kidneys are not filtering your blood as well as they should?",
    yesAction: 'refer_and_continue',
    explainTerm: "kidney",
  },
  {
    id: 'post-12',
    text: "Are you feeling really exhausted — beyond the usual new baby tiredness — and rest doesn't seem to help much?",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'post-13',
    text: "Are you currently unwell with a fever, body aches, or swollen glands? These can sometimes be signs of a serious infection or sepsis.",
    yesAction: 'refer_immediately',
    explainTerm: "sepsis",
  },
  {
    id: 'post-14',
    text: "Have you had a fracture or significant injury recently that might affect your movement or ability to exercise?",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'post-15',
    text: "If you had a caesarean section — how is your scar feeling? Are you experiencing any pain around the incision site, especially when you move or exercise?",
    yesAction: 'refer_and_continue',
    explainTerm: "caesarean birth",
  },
  {
    id: 'post-16',
    text: "Have you had any vaginal bleeding that doesn't seem like your normal period returning?",
    yesAction: 'refer_immediately',
    explainTerm: "vaginal bleeding",
  },
  {
    id: 'post-17',
    text: "Is there anything else health-wise you'd like to mention — anything that might affect how you get back into activity after having your baby?",
    yesAction: 'refer_and_continue',
  },
  {
    id: 'post-18',
    text: "And the very last one — how are you feeling about getting back to being active? Any worries or nerves about it? Completely normal if you do! 💛",
    yesAction: 'note_and_continue',
  },
];