interface CompanyProfile {
  nome?: string | null;
  tagline?: string | null;
  descricao?: string | null;
  setor?: string | null;
  pais?: string | null;
  cidade?: string | null;
  website?: string | null;
  linkedin?: string | null;
  logo?: string | null;
  interesses?: string[] | null;
}

interface CompletenessResult {
  percentage: number;
  completed: string[];
  missing: string[];
}

const FIELDS: { key: keyof CompanyProfile; label: string; weight: number }[] = [
  { key: "nome", label: "Nome da empresa", weight: 15 },
  { key: "tagline", label: "Tagline", weight: 10 },
  { key: "descricao", label: "Descrição", weight: 15 },
  { key: "setor", label: "Setor", weight: 10 },
  { key: "pais", label: "País", weight: 10 },
  { key: "cidade", label: "Cidade", weight: 5 },
  { key: "website", label: "Website", weight: 10 },
  { key: "linkedin", label: "LinkedIn", weight: 5 },
  { key: "logo", label: "Logo", weight: 10 },
  { key: "interesses", label: "Interesses", weight: 10 },
];

export function calculateProfileCompleteness(company: CompanyProfile): CompletenessResult {
  let totalWeight = 0;
  let completedWeight = 0;
  const completed: string[] = [];
  const missing: string[] = [];

  for (const field of FIELDS) {
    totalWeight += field.weight;
    const value = company[field.key];
    const isFilled = Array.isArray(value) ? value.length > 0 : !!value;

    if (isFilled) {
      completedWeight += field.weight;
      completed.push(field.label);
    } else {
      missing.push(field.label);
    }
  }

  return {
    percentage: Math.round((completedWeight / totalWeight) * 100),
    completed,
    missing,
  };
}
