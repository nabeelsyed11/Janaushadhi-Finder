export interface Medicine {
  id: string;
  brandedName: string;
  genericName: string;
  brandedPrice: number;
  genericPrice: number;
  category: string;
  usage: string;
}

export const medicines: Medicine[] = [
  {
    id: "1",
    brandedName: "Crocin Advance",
    genericName: "Paracetamol",
    brandedPrice: 35.0,
    genericPrice: 8.5,
    category: "Fever & Pain",
    usage: "Used for fever and mild to moderate pain relief."
  },
  {
    id: "2",
    brandedName: "Augmentin 625 Duo",
    genericName: "Amoxycillin + Clavulanic Acid",
    brandedPrice: 220.0,
    genericPrice: 110.0,
    category: "Antibiotic",
    usage: "Treats bacterial infections of the lungs, ears, and skin."
  },
  {
    id: "3",
    brandedName: "Calpol 500",
    genericName: "Paracetamol",
    brandedPrice: 15.0,
    genericPrice: 5.0,
    category: "Fever & Pain",
    usage: "Relieves pain and reduces fever."
  },
  {
    id: "4",
    brandedName: "Telma 40",
    genericName: "Telmisartan",
    brandedPrice: 180.0,
    genericPrice: 28.0,
    category: "Blood Pressure",
    usage: "Used to treat high blood pressure (hypertension)."
  },
  {
    id: "5",
    brandedName: "Glycomet 500",
    genericName: "Metformin",
    brandedPrice: 65.0,
    genericPrice: 15.0,
    category: "Diabetes",
    usage: "Helps control blood sugar levels in type 2 diabetes."
  },
  {
    id: "6",
    brandedName: "Pantocid 40",
    genericName: "Pantoprazole",
    brandedPrice: 150.0,
    genericPrice: 22.0,
    category: "Acidity",
    usage: "Reduces acid production in the stomach."
  },
  {
    id: "7",
    brandedName: "Zyrtec",
    genericName: "Cetirizine",
    brandedPrice: 80.0,
    genericPrice: 12.0,
    category: "Allergy",
    usage: "Relieves symptoms of cold and allergies."
  },
  {
    id: "8",
    brandedName: "Voveran-D",
    genericName: "Diclofenac",
    brandedPrice: 120.0,
    genericPrice: 35.0,
    category: "Pain Relief",
    usage: "Non-steroidal anti-inflammatory drug (NSAID)."
  },
  {
    id: "9",
    brandedName: "Atorva 10",
    genericName: "Atorvastatin",
    brandedPrice: 210.0,
    genericPrice: 32.0,
    category: "Cholesterol",
    usage: "Lowers 'bad' cholesterol and fats in the blood."
  },
  {
    id: "10",
    brandedName: "Azithral 500",
    genericName: "Azithromycin",
    brandedPrice: 130.0,
    genericPrice: 65.0,
    category: "Antibiotic",
    usage: "Treatment of various bacterial infections."
  },
  {
    id: "11",
    brandedName: "Combiflam",
    genericName: "Ibuprofen + Paracetamol",
    brandedPrice: 45.0,
    genericPrice: 12.0,
    category: "Pain Relief",
    usage: "Treats fever, headache, and muscle pain."
  },
  {
    id: "12",
    brandedName: "Liv.52",
    genericName: "Herbal Formulation",
    brandedPrice: 160.0,
    genericPrice: 85.0,
    category: "Liver Health",
    usage: "Supports healthy liver function."
  },
  {
    id: "13",
    brandedName: "Thyronorm 50",
    genericName: "Thyroxine",
    brandedPrice: 190.0,
    genericPrice: 45.0,
    category: "Thyroid",
    usage: "Supplements low thyroid hormone levels."
  },
  {
    id: "14",
    brandedName: "Dolo 650",
    genericName: "Paracetamol",
    brandedPrice: 30.0,
    genericPrice: 10.0,
    category: "Fever & Pain",
    usage: "Safe and effective for fever and aches."
  },
  {
    id: "15",
    brandedName: "Montair LC",
    genericName: "Montelukast + Levocetirizine",
    brandedPrice: 240.0,
    genericPrice: 48.0,
    category: "Asthma & Allergy",
    usage: "Prevention of asthma and allergy symptoms."
  }
];
