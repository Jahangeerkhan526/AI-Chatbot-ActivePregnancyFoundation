
export interface DatasetRecord {
  id: string;
  category: string;
  content: string;
  source: string;
}

export const APF_Q_DATASET: DatasetRecord[] = [
  {
    id: "GAQP-01-A",
    category: "Screening Section 1",
    content: "Mild, moderate or severe respiratory or cardiovascular diseases (e.g., chronic bronchitis)?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-B",
    category: "Screening Section 1",
    content: "Epilepsy that is not stable?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-C",
    category: "Screening Section 1",
    content: "Type 1 diabetes that is not stable or your blood sugar is outside of target ranges?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-D",
    category: "Screening Section 1",
    content: "Thyroid disease that is not stable or your thyroid function is outside of target ranges?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-E",
    category: "Screening Section 1",
    content: "An eating disorder(s) or malnutrition?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-F",
    category: "Screening Section 1",
    content: "Twins (28 weeks pregnant or later)? Or are you expecting triplets or higher multiple births?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-G",
    category: "Screening Section 1",
    content: "Low red blood cell number (anemia) with high levels of fatigue and/or light-headedness?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-H",
    category: "Screening Section 1",
    content: "High blood pressure (preeclampsia, gestational hypertension, or chronic hypertension that is not stable)?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-I",
    category: "Screening Section 1",
    content: "A baby that is growing slowly (intrauterine growth restriction)?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-J",
    category: "Screening Section 1",
    content: "Unexplained bleeding, ruptured membranes or labour before 37 weeks?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-K",
    category: "Screening Section 1",
    content: "A placenta that is partially or completely covering the cervix (placenta previa)?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-L",
    category: "Screening Section 1",
    content: "Weak cervical tissue (incompetent cervix)?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-01-M",
    category: "Screening Section 1",
    content: "A stitch or tape to reinforce your cervix (cerclage)?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-02-A",
    category: "Screening Section 2",
    content: "Recurrent miscarriages (loss of your baby before 20 weeks gestation two or more times)?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-02-B",
    category: "Screening Section 2",
    content: "Early delivery (before 37 weeks gestation)?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-03",
    category: "Screening Section 3",
    content: "Do you have any other medical condition that may affect your ability to be physically active during pregnancy?",
    source: "GAQ-P Page 1"
  },
  {
    id: "GAQP-04",
    category: "Screening Section 4",
    content: "Is there any other reason you are concerned about physical activity during pregnancy?",
    source: "GAQ-P Page 1"
  },
  {
    id: "INTENSITY-LIGHT",
    category: "Guidelines (Intensity)",
    content: "Light intensity: Moving, but do not sweat or breathe hard (e.g., walking to get mail).",
    source: "GAQ-P Page 2"
  },
  {
    id: "INTENSITY-MOD",
    category: "Guidelines (Intensity)",
    content: "Moderate intensity activity: Heart rate goes up, may sweat/breathe hard. Can talk but NOT sing (e.g., brisk walking). Accumulate 150 mins/week.",
    source: "GAQ-P Page 2"
  },
  {
    id: "INTENSITY-VIG",
    category: "Guidelines (Intensity)",
    content: "Vigorous intensity: Heart rate goes up substantially, feel hot/sweaty, cannot say more than a few words without pausing to breathe. Consult professional if starting or at >2500m.",
    source: "GAQ-P Page 2"
  },
  {
    id: "SAFETY-STOP",
    category: "Medical Safety",
    content: "Stop exercising immediately if you experience: Dizziness, chest pain, painful contractions, vaginal bleeding, or sudden leakage of fluid.",
    source: "GAQ-P Page 2"
  }
];
