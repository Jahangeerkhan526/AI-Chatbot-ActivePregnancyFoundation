// When any of these terms are detected in a user message, redirect them to their GP.

export const MEDICAL_KEYWORDS: Record<string, string[]> = {
  "Chest & Heart": [
    "chest pain", "chest tightness", "chest pressure", "chest discomfort",
    "heart pain", "heart racing", "heart pounding", "palpitations",
    "heart condition", "heart disease", "cardiac",
  ],
  "Breathing": [
    "shortness of breath", "cant breathe", "can't breathe",
    "breathing difficulty", "breathless", "out of breath",
  ],
  "Bleeding & Fluids": [
    "bleeding", "vaginal bleeding", "spotting", "blood loss",
    "amniotic fluid", "waters broke", "waters breaking", "leaking fluid",
  ],
  "Dizziness & Head": [
    "dizziness", "dizzy", "faint", "fainting", "lightheaded", "light headed",
    "blurred vision", "blurry vision", "seeing spots",
    "severe headache", "headache", "migraine",
  ],
  "Pain": [
    "severe pain", "abdominal pain", "stomach pain", "tummy pain",
    "pelvic pain", "pelvic pressure", "lower back pain", "back pain",
    "hip pain", "groin pain", "rib pain", "pubic pain",
    "round ligament pain", "spd pain",
  ],
  "Baby Movement": [
    "baby not moving", "no movement", "reduced movement", "less movement",
    "baby moving less", "cant feel baby", "can't feel baby",
  ],
  "Blood Pressure": [
    "high blood pressure", "high bp", "low blood pressure", "low bp",
    "blood pressure", "hypertension", "hypotension",
    "preeclampsia", "eclampsia",
    "swollen face", "swollen hands", "swollen feet",
    "swelling face", "swelling hands", "swelling feet",
  ],
  "Conditions": [
    "gestational diabetes", "diabetes", "epilepsy", "seizure",
    "blood clot", "dvt", "cancer", "tumour", "tumor", "thyroid",
    "kidney disease", "kidney pain", "anaemia", "anemia", "iron deficiency",
  ],
  "Pregnancy Complications": [
    "placenta previa", "placenta praevia", "low placenta",
    "incompetent cervix", "weak cervix", "cerclage", "cervical stitch",
    "premature labour", "premature labor", "preterm",
    "early labour", "contractions", "labour", "labor", "waters",
  ],
  "Pregnancy History": [
    "miscarriage", "ectopic", "stillbirth", "pregnancy loss",
  ],
  "Injury & Illness": [
    "fell", "fall", "fallen", "accident", "injured", "injury",
    "fracture", "broken bone", "fever", "infection", "temperature",
    "vomiting", "hyperemesis", "severe nausea",
  ],
  "Mental Health": [
    "suicidal", "self harm", "postnatal depression", "postpartum depression",
  ],
};

export const ALL_MEDICAL_KEYWORDS: string[] = Object.values(MEDICAL_KEYWORDS).flat();

export function detectMedicalKeywords(
  message: string
): { keyword: string; category: string }[] {
  const lower = message.toLowerCase();
  const matches: { keyword: string; category: string }[] = [];

  for (const [category, keywords] of Object.entries(MEDICAL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        matches.push({ keyword, category });
      }
    }
  }

  return matches;
}

export function shouldReferToGP(message: string): boolean {
  return detectMedicalKeywords(message).length > 0;
}

export function getGPReferralResponse(message: string): string | null {
  const matches = detectMedicalKeywords(message);
  if (matches.length === 0) return null;

  const mentalHealthMatch = matches.find(m => m.category === "Mental Health");
  if (mentalHealthMatch) {
    return (
      "I'm really glad you reached out. What you've shared sounds serious, and I want to make sure you get the right support. " +
      "Please contact your GP or midwife as soon as possible. If you're in crisis right now, you can also call the Samaritans " +
      "on 116 123 (free, 24/7) or text SHOUT to 85258. You don't have to go through this alone. 💙"
    );
  }

  return (
    "It sounds like you may be experiencing something that needs medical attention. " +
    "I'd strongly encourage you to contact your GP or midwife as soon as possible — " +
    "they're best placed to help with what you've described. " +
    "If you feel this is urgent, please call 111 or 999. Your health and your baby's health always come first. 💛"
  );
}