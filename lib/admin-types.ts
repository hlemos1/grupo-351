export type CandidaturaStatus =
  | "nova"
  | "em-analise"
  | "entrevista"
  | "aprovada"
  | "recusada"
  | "arquivada";

export interface Candidatura {
  id: string;
  criadoEm: string;
  status: CandidaturaStatus;
  nome: string;
  email: string;
  telefone: string;
  pais: string;
  cidade: string;
  perfil: "operador" | "investidor" | "ambos";
  experiencia: string;
  setor: string;
  empresaAtual?: string;
  linkedin?: string;
  modelo: string[];
  capitalDisponivel: string;
  prazo: string;
  dedicacao: string;
  motivacao: string;
  diferenciais: string;
  disponibilidade?: string;
  aceitaNDA: boolean;
  notas?: string;
  atribuidoA?: string;
}

export interface Contato {
  id: string;
  criadoEm: string;
  lido: boolean;
  arquivado: boolean;
  nome: string;
  email: string;
  empresa?: string;
  tipo: string;
  orcamento?: string;
  mensagem: string;
  notas?: string;
}

export interface ProjetoAdmin {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  detalhes: string[];
  tag: string;
  status: "Em operação" | "Em desenvolvimento" | "Em estruturação";
  mercado: string;
  parceiro?: string;
  controle: string;
  icon: string;
  notasInternas?: string;
  ultimaAtualizacao?: string;
}

export interface DashboardStats {
  candidaturas: {
    total: number;
    novas: number;
    emAnalise: number;
    entrevista: number;
    aprovadas: number;
    recusadas: number;
  };
  contatos: {
    total: number;
    naoLidos: number;
  };
  projetos: {
    emOperacao: number;
    emDesenvolvimento: number;
    emEstruturacao: number;
  };
  conhecimento: {
    termos: number;
    artigos: number;
  };
}
