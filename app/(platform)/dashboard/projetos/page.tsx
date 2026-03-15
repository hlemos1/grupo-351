"use client";

import { useEffect, useState } from "react";
import { FolderKanban, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Project {
  id: string;
  nome: string;
  descricao: string | null;
  status: string;
  criadoEm: string;
  match: {
    opportunity: { titulo: string; tipo: string };
    fromUser: { nome: string };
    toUser: { nome: string };
  };
  members: { company: { nome: string; slug: string }; role: string }[];
  tasks: Task[];
}

interface Task {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  prazo: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  ativo: { label: "Ativo", color: "bg-emerald-50 text-emerald-700", icon: Clock },
  pausado: { label: "Pausado", color: "bg-amber-50 text-amber-700", icon: AlertCircle },
  concluido: { label: "Concluído", color: "bg-blue-50 text-blue-700", icon: CheckCircle },
  cancelado: { label: "Cancelado", color: "bg-red-50 text-red-700", icon: AlertCircle },
};

const taskStatusColors: Record<string, string> = {
  pendente: "bg-gray-100 text-gray-600",
  "em-progresso": "bg-blue-50 text-blue-700",
  concluida: "bg-emerald-50 text-emerald-700",
};

export default function ProjetosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/platform/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
          <FolderKanban className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Projetos</h1>
          <p className="text-sm text-gray-400">{projects.length} projeto(s)</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.04] p-12 text-center">
          <FolderKanban className="w-8 h-8 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Nenhum projeto ainda.</p>
          <p className="text-gray-300 text-xs mt-1">
            Projetos são criados quando um match é aceito e ambas as partes iniciam uma parceria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const st = statusConfig[project.status] || statusConfig.ativo;
            const Icon = st.icon;
            const totalTasks = project.tasks.length;
            const doneTasks = project.tasks.filter((t) => t.status === "concluida").length;

            return (
              <div key={project.id} className="bg-white rounded-2xl border border-black/[0.04] p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{project.nome}</h3>
                    {project.descricao && (
                      <p className="text-sm text-gray-500 mt-1">{project.descricao}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Origem: {project.match.opportunity.titulo}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${st.color}`}>
                    <Icon className="w-3 h-3" /> {st.label}
                  </span>
                </div>

                {/* Membros */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.members.map((m) => (
                    <span key={m.company.slug} className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full">
                      {m.company.nome} ({m.role})
                    </span>
                  ))}
                </div>

                {/* Progresso de tarefas */}
                {totalTasks > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500">Tarefas</span>
                      <span className="text-xs font-medium text-gray-600">{doneTasks}/{totalTasks}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${(doneTasks / totalTasks) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Tarefas recentes */}
                {project.tasks.length > 0 && (
                  <div className="space-y-2">
                    {project.tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            task.status === "concluida" ? "bg-emerald-500" :
                            task.status === "em-progresso" ? "bg-blue-500" : "bg-gray-300"
                          }`} />
                          <span className={`text-sm ${task.status === "concluida" ? "text-gray-400 line-through" : "text-gray-700"}`}>
                            {task.titulo}
                          </span>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${taskStatusColors[task.status] || taskStatusColors.pendente}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Datas */}
                <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-300">
                  Criado em {new Date(project.criadoEm).toLocaleDateString("pt-PT")}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
