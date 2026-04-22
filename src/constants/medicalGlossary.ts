// src/constants/medicalGlossary.ts
// Medical term definitions sourced from:
// - Saint Mary's Hospital Obstetric Glossary (mft.nhs.uk)
// - RCOG A-Z of Medical Terms (rcog.org.uk)
// Used to provide plain English explanations when users mention medical terms

export interface MedicalTerm {
  term: string;
  definition: string;
  source: string;
}

export const MEDICAL_GLOSSARY: MedicalTerm[] = [
  { term: "cardiovascular disease", definition: "A general term for conditions affecting the heart or blood vessels, such as heart disease or chronic bronchitis.", source: "RCOG A-Z of Medical Terms" },
  { term: "ruptured membranes", definition: "When the fluid-filled sac surrounding your baby breaks — sometimes called your waters breaking. This can happen before or during labour.", source: "Saint Mary's Hospital Obstetric Glossary" },
  { term: 'Abdomen', definition: 'The tummy area from the lower ribs to the pelvis.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Acceleration of labour', definition: 'The speeding up of labour by the use of drugs, usually via a Syntocinon drip.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Active labour', definition: 'Also known as the first stage of labour. This is the period after the latent (early) stage of labour when a woman is experiencing strong, regular contractions and her cervix continues to dilate from 4cms until she is fully dilated (10cms).', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Albumin (ALB)', definition: 'This is a protein. If it is present in your urine, it may be a sign of pre-eclampsia or of an infection such as cystitis.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Alpha fetoprotein (AFP)', definition: 'A substance present in the blood of pregnant women. This is tested as part of the Down\'s syndrome screening tests.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Amniocentesis', definition: 'A way of testing the fluid surrounding a baby in the womb by taking a small sample with a needle put into the womb through the abdomen. It can be carried out after the 15th week of pregnancy, and can detect some conditions, like Down syndrome.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Amniotic fluid', definition: 'The watery liquid surrounding and protecting the growing fetus in the uterus.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Amniotic sac', definition: 'The pregnancy sac containing the baby and the amniotic fluid. Sometimes also called the membranes.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Anaemia', definition: 'A condition when the level of haemoglobin, the protein in blood which carries oxygen round the body, is lower than normal. It can cause tiredness, breathlessness, fainting, headaches and can cause your heart to beat faster.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Antenatal', definition: 'Before birth.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Antepartum haemorrhage (APH)', definition: 'Bleeding before the birth.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Antiphospholipid syndrome', definition: 'A condition caused by your immune system mistakenly attacking healthy cells in your body. It can increase your risk of blood clots and of pregnancy complications such as recurrent miscarriage or stillbirth.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Artificial rupture of membranes (ARM)', definition: 'Breaking the waters to stimulate the onset of strong labour.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Assisted delivery', definition: 'The use of forceps or ventouse to speed up the delivery, or to move the baby if they have become stuck.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Blood pressure (BP)', definition: 'It is important to have your blood pressure measured as a rise could mean a problem.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Breech position', definition: 'When the baby is lying bottom first in the womb.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Breech presentation', definition: 'This means your baby is lying bottom or feet down in the uterus.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Caesarean birth', definition: 'An operation in which a baby is born through a cut made in the wall of the abdomen and the uterus. It may be done as a planned (elective) or an emergency procedure.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Caesarean section', definition: 'Delivery of an infant through an incision in the abdominal and uterine walls.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Cephalic', definition: 'This means the baby is lying with its head in the lower part of the uterus.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Cervix', definition: 'The entrance or neck of the womb, at the top of the vagina.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Crowning', definition: 'The point in labour when the head of the baby can be seen at the vagina.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Deep vein thrombosis (DVT)', definition: 'A blood clot that forms in a deep vein.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Diabetes', definition: 'A condition caused by high levels of glucose (a form of sugar) in the blood.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Diabetes Type 1', definition: 'A serious, lifelong condition where your blood glucose level is too high because your body cannot make a hormone called insulin, which controls blood glucose.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Dilation/Dilatation', definition: 'In the first stage of labour the cervix gradually opens up to make space for the baby. It needs to open to approximately 10 centimetres before the baby\'s head can pass through.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Eclampsia', definition: 'Seizures or fits that are a potentially life-threatening complication of pre-eclampsia.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Ectopic pregnancy', definition: 'When a fertilised egg implants outside the womb, usually in one of the fallopian tubes.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Endometriosis', definition: 'A condition where cells of the lining of the womb are found elsewhere, usually around the pelvis and near the womb.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Engaged', definition: 'This means that the widest part of the baby\'s head has passed into the pelvis in preparation for giving birth.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Epidural', definition: 'An injection of local anaesthetic into the lower back, given for pain relief during labour.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Episiotomy', definition: 'A cut made in the mother\'s perineum (the area between the vagina and anus) to allow the baby to be born more quickly and prevent tearing.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Fetal distress', definition: 'Sometimes the strength of labour contractions can reduce the baby\'s oxygen supply, causing the baby to become distressed.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Fetus', definition: 'An unborn baby.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Fibroids', definition: 'Non-cancerous growths that develop in the muscle of the womb. A woman can have one fibroid or many, and they can be of different sizes.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Gestation/Gestational age', definition: 'How far into the pregnancy you are, measured from the first day of your last menstrual period.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Gestational age', definition: 'The age of the baby in the womb, measured in weeks from the first day of the woman\'s last menstrual period. A normal pregnancy lasts between 37 and 41 completed weeks.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Gestational diabetes', definition: 'A form of diabetes triggered during pregnancy.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Group B streptococcus (GBS)', definition: 'A bacterium that is commonly present within the vagina. However, it can cause a serious infection in a newborn baby.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Haemoglobin (Hb)', definition: 'This is a substance in the blood that carries oxygen and it can be low if you have low iron levels (anaemia).', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Haemorrhage', definition: 'Very heavy bleeding. In pregnancy it can happen before 24 weeks (threatened miscarriage), after 24 weeks (antepartum haemorrhage), or immediately after birth (postpartum haemorrhage).', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Heart palpitations', definition: 'When you suddenly become aware of your heartbeat pounding or beating more quickly than usual.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Hypertension', definition: 'Raised blood pressure.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Hypotension', definition: 'Low blood pressure.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Incompetent cervix', definition: 'See weak cervix. When the cervix opens too early in pregnancy in the second trimester, without contractions.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Induction', definition: 'Starting the labour artificially.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Induction of labour', definition: 'When labour is started artificially.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Meconium', definition: 'The bowel contents of the baby at birth.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Miscarriage', definition: 'The unplanned loss of a pregnancy before 23 weeks.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Multiple pregnancy', definition: 'When a woman is carrying more than one baby, e.g. twins or triplets.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Oedema', definition: 'Swelling in any part of the body.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Oxytocin', definition: 'The hormone secreted by women when they are in labour which stimulates labour contractions.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Pelvic floor', definition: 'The sling of muscles that holds the pelvic organs in place.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Pelvic floor muscles', definition: 'Layers of muscle which support the bladder and other organs in the pelvis.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Pelvic girdle pain', definition: 'Pain in the pelvic area during or after pregnancy, also known as SPD (symphysis pubis dysfunction).', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Perineum', definition: 'The area of skin between the vagina and the anus.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Placenta', definition: 'An organ which develops in the womb linking the baby with the mother\'s system. It is delivered after the baby, when it is known as the afterbirth.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Placenta praevia', definition: 'A condition where the placenta covers all or part of the cervix. If the placenta does not move sufficiently it may be necessary to perform a caesarean.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Placental abruption', definition: 'Premature separation of the placenta from the uterine wall.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Postnatal depression', definition: 'A type of depression parents have after the birth of their baby.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Postpartum haemorrhage', definition: 'Heavy blood loss after the delivery of the baby.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Pre-eclampsia', definition: 'A condition that occurs in the second half of pregnancy, associated with high blood pressure and protein in the urine.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Pregnancy Induced Hypertension (PIH)', definition: 'This means that your blood pressure is high as a result of the pregnancy.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Premature birth / Preterm birth', definition: 'When your baby is born before 37 completed weeks of pregnancy.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Preterm', definition: 'Born before 37 weeks of pregnancy.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Preterm labour', definition: 'Labour that happens before 37 weeks of pregnancy.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Prolapsed umbilical cord', definition: 'When the cord slips down in front of the baby and the oxygen supply to the baby is reduced or cut off. This is a medical emergency.', source: 'Saint Mary\'s Hospital Obstetric Glossary' },
  { term: 'Pulmonary embolus', definition: 'Part of a blood clot (DVT) which breaks off and travels in the bloodstream and becomes stuck in the lung.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Recurrent miscarriage', definition: 'When a woman loses three or more babies before 23 completed weeks.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Sepsis', definition: 'The immune system\'s overreaction to an infection or injury which can lead to tissue damage, organ failure, and death.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Stillbirth', definition: 'When a baby is born dead after the 23rd completed week of pregnancy.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Stress incontinence', definition: 'Leaking urine during everyday activities like coughing, laughing or exercising. This usually happens because the muscles that support the bladder are too weak.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Trimester', definition: 'A three-month period of time. Pregnancy is divided into: first trimester up to around 13 weeks, second trimester 13 to 26 weeks, third trimester 27 to 40 weeks.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Umbilical cord', definition: 'The cord that connects a mother\'s blood system with a baby\'s and which is cut after the birth.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Uterus (womb)', definition: 'The organ where a baby develops during pregnancy. Made of muscle, it is hollow, stretchy and about the size and shape of an upside-down pear.', source: 'RCOG A-Z of Medical Terms' },
  { term: 'Weak cervix', definition: 'When the cervix (the neck of the womb) opens too early in pregnancy, in the second trimester, and without contractions. Previously known as incompetent cervix.', source: 'RCOG A-Z of Medical Terms' },

  { term: "epilepsy", definition: "A condition affecting the brain that causes repeated seizures or fits. It can usually be well controlled with medication.", source: "RCOG A-Z of Medical Terms" },
  { term: "thyroid", definition: "A gland in your neck that produces hormones controlling your metabolism and energy levels. Thyroid problems are common and usually manageable with medication.", source: "RCOG A-Z of Medical Terms" },
  { term: "cerclage", definition: "A stitch placed in the cervix to help keep it closed and support the pregnancy. Also called a cervical stitch.", source: "Saint Mary's Hospital Obstetric Glossary" },
  { term: "hyperemesis", definition: "Severe pregnancy sickness that causes extreme nausea and vomiting, much worse than normal morning sickness.", source: "RCOG A-Z of Medical Terms" },
  { term: "postpartum cardiomyopathy", definition: "A rare heart condition that can develop in the last month of pregnancy or in the months after giving birth.", source: "RCOG A-Z of Medical Terms" },
  { term: "gestational hypertension", definition: "High blood pressure that develops during pregnancy, usually after 20 weeks.", source: "RCOG A-Z of Medical Terms" },
  { term: "intrauterine growth restriction", definition: "When a baby is not growing at the expected rate inside the womb.", source: "RCOG A-Z of Medical Terms" },
  { term: "loss of consciousness", definition: "When a person temporarily becomes unaware of their surroundings and cannot respond, sometimes called fainting or passing out.", source: "RCOG A-Z of Medical Terms" },
  { term: "eating disorder", definition: "A serious condition affecting how a person thinks about food, eating and their body weight or shape.", source: "RCOG A-Z of Medical Terms" },
  { term: "stroke", definition: "A medical emergency where blood supply to part of the brain is cut off. Signs include face drooping, arm weakness or slurred speech — call 999 immediately.", source: "RCOG A-Z of Medical Terms" },
  { term: "malnutrition", definition: "When the body does not get enough nutrients it needs to function properly, which can affect your health and recovery.", source: "RCOG A-Z of Medical Terms" },

{ term: "heart condition", definition: "A general term for any condition that affects how the heart works, including problems with the heart muscle, valves or rhythm.", source: "RCOG A-Z of Medical Terms" },
{ term: "bleeding", definition: "Any unexpected blood loss during or after pregnancy should always be reported to your midwife or GP immediately.", source: "Saint Mary's Hospital Obstetric Glossary" },
{ term: "cervical incompetence", definition: "When the cervix is too weak to stay closed during pregnancy, which can sometimes cause early labour. Also called weak cervix.", source: "RCOG A-Z of Medical Terms" },
{ term: "dvt", definition: "Deep Vein Thrombosis — a blood clot that forms in a deep vein, usually in the leg. Signs include pain, swelling or redness in the leg.", source: "RCOG A-Z of Medical Terms" },
{ term: "abdominal pain", definition: "Pain or discomfort in the tummy area. During pregnancy or after birth, severe abdominal pain should always be checked by a doctor.", source: "Saint Mary's Hospital Obstetric Glossary" },
{ term: "kidney", definition: "The kidneys are two organs that filter waste from your blood and produce urine. Kidney disease means they are not working as well as they should.", source: "RCOG A-Z of Medical Terms" },

];

// Clinical terms that appear in screening questions — checked first
const SCREENING_PRIORITY_TERMS = [
  'placenta praevia',
  'placenta praevia',
  'incompetent cervix',
  'weak cervix',
  'postpartum cardiomyopathy',
  'intrauterine growth restriction',  // ← for baby growth question
  'gestational hypertension',
  'deep vein thrombosis',
  'loss of consciousness',
  'eating disorder',                   // ← missing!
  'pre-eclampsia',
  'eclampsia',
  'cerclage',
  'hyperemesis',
  'malnutrition',
  'miscarriage',
  'preterm',
  'anaemia',
  'thyroid',
  'diabetes',
  'epilepsy',
  'stroke',
  'dvt',
  'pelvic girdle pain',
];

export function findMedicalTerm(text: string): MedicalTerm | null {
  const lower = text.toLowerCase();

  // 1. Check priority clinical terms first (exact match)
  for (const priority of SCREENING_PRIORITY_TERMS) {
    if (lower.includes(priority)) {
      const found = MEDICAL_GLOSSARY.find(t => t.term.toLowerCase() === priority);
      if (found) return found;
    }
  }

  // 2. Try exact match against full glossary
  const exact = MEDICAL_GLOSSARY.find(t => lower.includes(t.term.toLowerCase()));
  if (exact) return exact;

  return null;
}
