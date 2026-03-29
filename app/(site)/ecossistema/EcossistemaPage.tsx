"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Printer,
  ShoppingBag,
  Globe,
  Dumbbell,
  Brain,
  X,
  ArrowRight,
  Layers,
  Cpu,
  RotateCcw,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

/* --- Types --- */
interface Node {
  id: string;
  label: string;
  icon: typeof Printer;
  camada: "infra" | "neuron" | "distrib" | "core";
  color: string;
  x: number;
  y: number;
  desc: string;
  conexoes: string[];
  href: string;
}

interface Edge {
  from: string;
  to: string;
  label: string;
  type: "dados" | "supply" | "conteudo" | "clientes";
}

/* --- Data --- */
const nodes: Node[] = [
  { id: "holding", label: "GRUPO +351", icon: Layers, camada: "core", color: "#1e3a5f", x: 50, y: 50, desc: "Venture builder. Governanca central, estrategia e alocacao de recursos entre todas as empresas.", conexoes: ["gso", "strike", "ebrand", "global", "farmlab"], href: "/sobre" },
  { id: "gso", label: "Nexial GSO", icon: Brain, camada: "neuron", color: "#3b82f6", x: 50, y: 15, desc: "Consultoria IA com metodo A&E. Diagnostico, implementacao e operacao continua para empresas.", conexoes: ["holding", "strike", "ebrand"], href: "/portfolio/nexial-gso" },
  { id: "strike", label: "Strike Studio", icon: Dumbbell, camada: "infra", color: "#22c55e", x: 20, y: 30, desc: "Boutique de MMA e fitness gamificado. 130+ alunos. Strike House + Strike Lab. Tese de franqueadora.", conexoes: ["holding", "gso", "farmlab"], href: "/portfolio/strike-studio" },
  { id: "ebrand", label: "Nexial E-Brand", icon: ShoppingBag, camada: "distrib", color: "#f59e0b", x: 80, y: 30, desc: "E-commerce de marcas proprias. Importacao China, validacao de produtos, marca Axis em lancamento.", conexoes: ["holding", "global", "farmlab"], href: "/portfolio/nexial-e-brand" },
  { id: "global", label: "Nexial Global", icon: Globe, camada: "distrib", color: "#f59e0b", x: 80, y: 70, desc: "Sourcing internacional e supply chain. Parceiro com 20 anos na China. Viagens empresariais.", conexoes: ["holding", "ebrand"], href: "/portfolio/nexial-global" },
  { id: "farmlab", label: "FarmLab 3D", icon: Printer, camada: "infra", color: "#22c55e", x: 20, y: 70, desc: "Laboratorio de impressao 3D. Producao, prototipagem rapida e criacao de produtos e marcas proprias.", conexoes: ["holding", "ebrand", "strike"], href: "/portfolio/farmlab-3d" },
];

const edges: Edge[] = [
  { from: "global", to: "ebrand", label: "Supply chain direto", type: "supply" },
  { from: "farmlab", to: "ebrand", label: "Produtos para venda", type: "supply" },
  { from: "gso", to: "strike", label: "IA para gamificacao", type: "dados" },
  { from: "farmlab", to: "strike", label: "Equipamentos 3D", type: "supply" },
  { from: "gso", to: "ebrand", label: "Inteligencia de mercado", type: "dados" },
];

const camadaLabels = {
  infra: { label: "Operacao Fisica", color: "#22c55e", icon: Cpu },
  neuron: { label: "Inteligencia Digital", color: "#3b82f6", icon: Brain },
  distrib: { label: "Comercio Global", color: "#f59e0b", icon: RotateCcw },
  core: { label: "Governanca", color: "#1e3a5f", icon: Layers },
};

const edgeColors: Record<string, string> = {
  dados: "#3b82f6",
  supply: "#f59e0b",
  conteudo: "#22c55e",
  clientes: "#8b5cf6",
};

/* --- Component --- */
export function EcossistemaPage() {
  const [selected, setSelected] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgSize, setSvgSize] = useState({ w: 800, h: 600 });
  const explainRef = useRef<HTMLElement>(null);
  const explainInView = useInView(explainRef, { once: true, margin: "-80px" });

  useEffect(() => {
    function updateSize() {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setSvgSize({ w: rect.width, h: rect.height });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  function getPos(node: Node) {
    return { x: (node.x / 100) * svgSize.w, y: (node.y / 100) * svgSize.h };
  }

  function isConnected(nodeId: string) {
    if (!hoveredNode) return true;
    if (nodeId === hoveredNode) return true;
    const node = nodes.find((n) => n.id === hoveredNode);
    return node?.conexoes.includes(nodeId) ?? false;
  }

  function isEdgeHighlighted(edge: Edge) {
    if (!hoveredNode) return true;
    return edge.from === hoveredNode || edge.to === hoveredNode;
  }

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-28 bg-gradient-to-b from-[#f8f9fb] to-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="text-accent text-[13px] font-semibold tracking-[0.2em] uppercase mb-5">
              Mapa do Ecossistema
            </p>
            <h1 className="text-3xl md:text-[3.5rem] font-bold text-primary font-display tracking-[-0.03em] leading-[1.05] mb-5">
              Ecossistema +351
            </h1>
            <p className="text-muted text-lg leading-[1.7] max-w-3xl tracking-[-0.006em]">
              Visualize como as 5 empresas se conectam. Operacao fisica gera caixa e dados,
              inteligencia digital transforma em decisao, comercio global conecta a mercado.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-5 bg-white border-y border-black/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[11px] text-muted/60 font-semibold uppercase tracking-[0.15em]">Camadas:</span>
            {(Object.entries(camadaLabels) as [string, { label: string; color: string; icon: typeof Cpu }][]).map(
              ([key, { label, color }]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[12px] text-muted">{label}</span>
                </div>
              )
            )}
            <div className="ml-auto flex flex-wrap gap-4">
              <span className="text-[11px] text-muted/60 font-semibold uppercase tracking-[0.15em]">Fluxos:</span>
              {[
                { type: "dados", label: "Dados" },
                { type: "supply", label: "Supply chain" },
                { type: "conteudo", label: "Conteúdo" },
                { type: "clientes", label: "Clientes" },
              ].map(({ type, label }) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className="w-6 h-[2px] rounded" style={{ backgroundColor: edgeColors[type] }} />
                  <span className="text-[11px] text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Graph */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease }}
            className="relative bg-[#f8f9fb] rounded-2xl border border-black/[0.04] overflow-hidden shadow-sm shadow-black/[0.02]"
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
              className="w-full"
              style={{ height: "min(70vh, 600px)" }}
            >
              {/* Edges */}
              {edges.map((edge) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                const from = getPos(fromNode);
                const to = getPos(toNode);
                const highlighted = isEdgeHighlighted(edge);

                return (
                  <g key={`${edge.from}-${edge.to}`}>
                    <line
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke={edgeColors[edge.type]}
                      strokeWidth={highlighted ? 2 : 1}
                      strokeOpacity={highlighted ? 0.4 : 0.06}
                      strokeDasharray={edge.type === "dados" ? "6 3" : undefined}
                      style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
                    />
                    {highlighted && hoveredNode && (
                      <text
                        x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8}
                        textAnchor="middle"
                        className="text-[9px] fill-muted/60 pointer-events-none font-medium"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const pos = getPos(node);
                const connected = isConnected(node.id);
                const isHovered = hoveredNode === node.id;
                const r = node.camada === "core" ? 32 : 24;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(node)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onTouchStart={() => setHoveredNode(hoveredNode === node.id ? null : node.id)}
                    opacity={connected ? 1 : 0.12}
                    style={{ transition: "opacity 0.4s" }}
                  >
                    {isHovered && (
                      <circle cx={pos.x} cy={pos.y} r={r + 10} fill={node.color} opacity={0.06} />
                    )}
                    <circle
                      cx={pos.x} cy={pos.y} r={r}
                      fill="white"
                      stroke={node.color}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      style={{ transition: "stroke-width 0.3s" }}
                    />
                    <circle cx={pos.x} cy={pos.y} r={5} fill={node.color} />
                    <text
                      x={pos.x} y={pos.y + r + 16}
                      textAnchor="middle"
                      className="text-[11px] font-semibold fill-foreground pointer-events-none tracking-tight"
                    >
                      {node.label}
                    </text>
                    <text
                      x={pos.x} y={pos.y + r + 28}
                      textAnchor="middle"
                      className="text-[8px] fill-muted/50 pointer-events-none"
                    >
                      {camadaLabels[node.camada].label.split(" (")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-4 left-4 text-[11px] text-muted/30 font-medium">
              <span className="hidden md:inline">Passe o mouse sobre um nó para ver conexões. Clique para detalhes.</span>
              <span className="md:hidden">Toque num nó para ver conexões. Toque novamente para detalhes.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Selected node panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.4, ease }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-lg"
          >
            <div className="bg-white/90 backdrop-blur-2xl rounded-2xl border border-black/[0.06] shadow-2xl shadow-black/[0.08] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: selected.color + "10" }}
                  >
                    <selected.icon className="w-5 h-5" style={{ color: selected.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground tracking-[-0.015em]">{selected.label}</h3>
                    <p className="text-[11px] text-muted font-medium">
                      {camadaLabels[selected.camada].label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-muted/40 hover:text-foreground transition-colors duration-300 p-1 rounded-lg hover:bg-black/[0.04]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-muted text-[14px] leading-[1.7] mb-4">
                {selected.desc}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {selected.conexoes.map((c) => {
                    const target = nodes.find((n) => n.id === c);
                    return (
                      <span
                        key={c}
                        className="text-[10px] font-medium text-muted bg-[#f8f9fb] px-2.5 py-1 rounded-full"
                      >
                        {target?.label}
                      </span>
                    );
                  })}
                </div>
                <a
                  href={selected.href}
                  className="inline-flex items-center gap-1.5 text-accent text-[13px] font-medium hover:underline underline-offset-4 shrink-0"
                >
                  Ver detalhes
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ecossistema explanation */}
      <section ref={explainRef} className="py-28 bg-[#f8f9fb]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={explainInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <h2 className="text-2xl md:text-[2.25rem] font-bold text-primary font-display tracking-[-0.025em] mb-12 text-center">
              Como o ecossistema funciona
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: "01", title: "Operacao fisica", desc: "Strike Studio e FarmLab 3D geram caixa real, dados de mercado e validacao de produtos no terreno.", color: "#22c55e" },
              { num: "02", title: "Inteligencia digital", desc: "Nexial GSO transforma dados em decisao com IA e metodo proprio. Tecnologia alimenta todas as verticais.", color: "#3b82f6" },
              { num: "03", title: "Comercio global", desc: "Nexial Global e E-Brand conectam producao a mercado. Supply chain Asia-Europa fecha o ciclo.", color: "#f59e0b" },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                animate={explainInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.6, ease }}
              >
                <div className="bg-white rounded-2xl border border-black/[0.04] p-8 h-full text-center hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-500">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ backgroundColor: item.color + "10" }}
                  >
                    <span className="text-lg font-bold tracking-[-0.02em]" style={{ color: item.color }}>
                      {item.num}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2 tracking-[-0.015em]">{item.title}</h3>
                  <p className="text-muted text-[14px] leading-[1.7]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={explainInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-10 bg-gradient-to-br from-primary via-[#0f2d4a] to-primary-dark rounded-2xl p-8 text-center relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-accent/[0.03] blur-[80px]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <p className="relative text-white/60 text-lg leading-[1.7] max-w-2xl mx-auto tracking-[-0.006em]">
              &ldquo;Concorrentes copiam produto. Nao copiam o sistema que o criou.
              Cada ciclo de operacao, inteligencia e comercio gera um ativo
              que so existe dentro do ecossistema.&rdquo;
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <h2 className="text-2xl md:text-[2.25rem] font-bold text-primary font-display tracking-[-0.025em] mb-5">
              Quer fazer parte desta rede?
            </h2>
            <p className="text-muted text-[15px] mb-10 tracking-[-0.006em]">
              Explore os modelos de parceria ou candidate-se diretamente.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/parceiros"
                className="group inline-flex items-center gap-2.5 bg-primary text-white px-7 py-3.5 rounded-2xl text-[14px] font-semibold hover:bg-primary-light transition-all duration-500 hover:shadow-xl hover:shadow-primary/15 active:scale-[0.97]"
              >
                Ver modelos de JV
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
              <a
                href="/aplicar"
                className="group inline-flex items-center gap-2.5 border border-black/[0.08] text-primary px-7 py-3.5 rounded-2xl text-[14px] font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all duration-500 active:scale-[0.97]"
              >
                Candidatar-se
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
