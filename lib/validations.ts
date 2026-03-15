import { z } from "zod";

export const candidaturaCreateSchema = z.object({
  tipo: z.literal("aplicacao-jv"),
  nome: z.string().min(2).max(200),
  email: z.string().email(),
  telefone: z.string().min(5).max(30),
  pais: z.string().min(2),
  cidade: z.string().min(2),
  perfil: z.enum(["operador", "investidor", "ambos"]),
  experiencia: z.string().min(10).max(5000),
  setor: z.string().min(2),
  empresaAtual: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  modelo: z.array(z.string()).default([]),
  capitalDisponivel: z.string(),
  prazo: z.string(),
  dedicacao: z.string(),
  motivacao: z.string().min(10).max(5000),
  diferenciais: z.string().min(10).max(5000),
  disponibilidade: z.string().optional(),
  aceitaNDA: z.boolean(),
});

export const contatoCreateSchema = z.object({
  nome: z.string().min(2).max(200),
  email: z.string().email(),
  empresa: z.string().optional(),
  tipo: z.string().min(2),
  orcamento: z.string().optional(),
  mensagem: z.string().min(5).max(10000),
});

export const candidaturaUpdateSchema = z.object({
  status: z.enum(["nova", "em-analise", "entrevista", "aprovada", "recusada", "arquivada"]).optional(),
  notas: z.string().max(10000).optional(),
  atribuidoA: z.string().max(200).optional(),
});

export const contatoUpdateSchema = z.object({
  lido: z.boolean().optional(),
  arquivado: z.boolean().optional(),
  notas: z.string().max(10000).optional(),
});

export const projetoSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(200),
  tagline: z.string().max(500),
  description: z.string().max(10000),
  detalhes: z.array(z.string()),
  tag: z.string(),
  status: z.enum(["Ideação", "Em estruturação", "Em desenvolvimento", "Em operação", "Consolidado"]),
  mercado: z.string(),
  parceiro: z.string().optional(),
  controle: z.string(),
  icon: z.string(),
  socio: z.string().optional(),
  porcentagem: z.number().min(0).max(100).optional(),
  notasInternas: z.string().optional(),
});

export const termoSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  termo: z.string().min(2).max(200),
  definicao: z.string().max(10000),
  categoria: z.enum(["conceito", "marca", "modelo", "metrica"]),
});

export const artigoSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(2).max(300),
  resumo: z.string().max(2000),
  conteudo: z.array(z.string()),
  categoria: z.enum(["tese", "modelo", "case", "guia"]),
  destaque: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

export const aiMessagesSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(50000),
  })).min(1),
});

// ─── Plataforma ───

export const registerSchema = z.object({
  nome: z.string().min(2).max(200),
  email: z.string().email(),
  senha: z.string().min(8).max(128),
  role: z.enum(["empresa", "parceiro"]).default("empresa"),
});

export const companyCreateSchema = z.object({
  nome: z.string().min(2).max(200),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  tagline: z.string().max(300).optional(),
  descricao: z.string().max(10000).optional(),
  setor: z.string().min(2),
  pais: z.string().min(2),
  cidade: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  estagio: z.enum(["ideacao", "validacao", "operando", "escala", "consolidado"]).default("operando"),
  faturamento: z.enum(["ate-100k", "100k-500k", "500k-1m", "1m-5m", "5m+"]).optional(),
  interesses: z.array(z.string()).default([]),
});

export const companyUpdateSchema = companyCreateSchema.partial().omit({ slug: true });

export const opportunityCreateSchema = z.object({
  titulo: z.string().min(5).max(300),
  tipo: z.enum(["franquia", "investimento", "parceria", "fornecedor", "expansao"]),
  setor: z.string().min(2),
  descricao: z.string().min(20).max(10000),
  requisitos: z.string().max(5000).optional(),
  budget: z.string().optional(),
  localizacao: z.string().optional(),
  expiraEm: z.string().datetime().optional(),
});

export const opportunityUpdateSchema = opportunityCreateSchema.partial().extend({
  status: z.enum(["aberta", "em-negociacao", "fechada", "cancelada"]).optional(),
});
