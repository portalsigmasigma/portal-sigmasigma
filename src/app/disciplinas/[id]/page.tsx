'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ModalAdicionarMaterialDisciplina from '@/components/ModalAdicionarMaterialDisciplina';

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  periodo?: string;
  tipo?: string;
  ementa?: string;
}

export default function DisciplinaDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materiais, setMateriais] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDetalhes() {
      const { data } = await supabase
        .from('disciplinas')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setDisciplina(data);
    }
    fetchDetalhes();
  }, [id]);

  if (!disciplina) {
    return (
      <div className="p-8 text-center text-xs text-texto-secundario">
        Carregando disciplina...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Botão de Voltar */}
      <div>
        <Link
          href="/disciplinas"
          className="inline-flex items-center gap-2 text-xs font-semibold text-texto-secundario hover:text-azul-texto transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Voltar para Disciplinas</span>
        </Link>
      </div>

      {/* Card Principal da Disciplina */}
      <div className="bg-card border border-borda rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-azul-texto bg-fundo px-3 py-1 rounded-md border border-borda uppercase tracking-wider">
              {disciplina.codigo}
            </span>
            {disciplina.tipo && (
              <span className="text-[11px] font-semibold capitalize bg-borda/40 px-2.5 py-1 rounded-md text-texto-principal">
                {disciplina.tipo}
              </span>
            )}
          </div>

          {/* Botão para abrir o Modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-destaque hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>➕</span> Relacionar Material
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-texto-principal uppercase tracking-tight">
            {disciplina.nome}
          </h1>
          <p className="text-xs text-texto-secundario mt-2">
            {disciplina.ementa || `Disciplina de caráter ${disciplina.tipo || 'obrigatório'}`}
          </p>
        </div>
      </div>

      {/* Seção de Materiais Associados */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-texto-principal flex items-center gap-2">
          Materiais e Provas Associados <span>({materiais.length})</span>
        </h2>

        {materiais.length === 0 ? (
          <div className="bg-card border border-borda rounded-2xl p-12 text-center text-xs text-texto-secundario">
            Nenhum material vinculado a esta disciplina até o momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Renderização dos materiais aqui quando houver */}
          </div>
        )}
      </div>

      {/* Modal */}
      <ModalAdicionarMaterialDisciplina
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        disciplinaNome={disciplina.nome}
      />
    </main>
  );
}