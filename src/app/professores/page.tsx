'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ModalAdicionarProfessor from '@/components/ModalAdicionarProfessor';

interface Professor {
  id: string;
  nome: string;
  email?: string;
  sala?: string;
  // Mapeamento compatível com ambas as versões do banco
  presenca?: string | boolean;
  passa_lista?: string | boolean;
  exigencia?: string;
  dificuldade?: string;
}

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('professores')
      .select('*')
      .eq('status', 'aprovado') // traz apenas os aprovados
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar professores:', error);
    } else {
      setProfessores(data || []);
    }
    setLoading(false);
  };

  const professoresFiltrados = professores.filter((prof) =>
    prof.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const getDificuldadeColor = (dif?: string) => {
    switch (dif?.toLowerCase()) {
      case 'tranquilo':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'médio':
      case 'medio':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'exigente':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  // Função auxiliar para tratar e formatar o campo de presença
  const formatarPresenca = (val?: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? 'Passa Lista' : 'Não cobra';
    }
    return val || 'Não informado';
  };

  return (
    <main className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Botão para voltar ao Início */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-texto-secundario hover:text-texto-principal transition-colors bg-card border border-borda px-3 py-1.5 rounded-xl shadow-sm"
        >
          <span>← Voltar para o Início</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-borda pb-4">
        <div>
          <h1 className="text-2xl font-black text-texto-principal flex items-center gap-2">
            <span>👨‍🏫</span> Professores do Curso
          </h1>
          <p className="text-xs text-texto-secundario mt-1">
            Consulte perfis, contatos, nível de exigência e materiais associados.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-destaque hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span>➕</span> Sugerir Docente
        </button>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Buscar professor pelo nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-card border border-borda rounded-xl px-4 py-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
        />
      </div>

      {/* Grid de Cards */}
      {loading ? (
        <div className="text-center py-12 text-texto-secundario text-xs">
          Carregando docentes...
        </div>
      ) : professoresFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-card border border-borda rounded-2xl p-6">
          <p className="text-sm font-semibold text-texto-secundario">
            Nenhum professor encontrado com esses termos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {professoresFiltrados.map((prof) => {
            // Unificação dos dados (prioriza coluna nova, recua para antiga)
            const nivelExigencia = prof.exigencia || prof.dificuldade;
            const valorPresenca = formatarPresenca(prof.presenca ?? prof.passa_lista);

            return (
              <Link key={prof.id} href={`/professores/${prof.id}`}>
                <div className="bg-card border border-borda hover:border-azul-texto/50 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md space-y-3 cursor-pointer group">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-texto-principal group-hover:text-azul-texto transition-colors">
                      {prof.nome}
                    </h2>
                    {nivelExigencia && (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${getDificuldadeColor(
                          nivelExigencia
                        )}`}
                      >
                        {nivelExigencia}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-texto-secundario">
                    <p className="truncate">
                      📧 <strong>E-mail:</strong> {prof.email || 'Não informado'}
                    </p>
                    <p>
                      📝 <strong>Cobra presença:</strong> {valorPresenca}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal Adicionar Professor */}
      <ModalAdicionarProfessor
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchProfessores();
        }}
      />
    </main>
  );
}