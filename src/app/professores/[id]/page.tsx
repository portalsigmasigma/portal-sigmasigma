'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ModalAdicionarMaterialProfessor from '@/components/ModalAdicionarMaterialProfessor';

interface Professor {
  id: string;
  nome: string;
  email?: string;
  sala?: string;
  passa_lista?: string;
  dificuldade?: string;
  resumo?: string;
}

interface Material {
  id: string;
  titulo: string;
  disciplina: string;
  tipo: string;
  link_drive: string;
  descricao?: string;
}

export default function DetalhesProfessorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProfessorDetails();
  }, [id]);

  const fetchProfessorDetails = async () => {
    setLoading(true);

    // Buscar dados do professor
    const { data: profData, error: profError } = await supabase
      .from('professores')
      .select('*')
      .eq('id', id)
      .single();

    if (profError) {
      console.error('Erro ao carregar professor:', profError);
    } else {
      setProfessor(profData);

      // Buscar materiais associados
      const { data: matData, error: matError } = await supabase
        .from('materiais')
        .select('*')
        .eq('status', 'aprovado')
        .or(`professor_id.eq.${id},professor.ilike.%${profData.nome}%`);

      if (!matError) {
        setMateriais(matData || []);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-fundo text-texto-principal p-8 text-center text-xs text-texto-secundario">
        Carregando perfil do professor...
      </main>
    );
  }

  if (!professor) {
    return (
      <main className="min-h-screen bg-fundo text-texto-principal p-8 space-y-4 text-center">
        <h1 className="text-xl font-bold">Professor não encontrado.</h1>
        <Link href="/professores" className="text-xs text-azul-texto hover:underline">
          ← Voltar para a lista
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 space-y-6 max-w-5xl mx-auto">
      <Link href="/professores" className="text-xs text-azul-texto hover:underline inline-flex items-center gap-1 font-semibold">
        ← Voltar para Professores
      </Link>

      {/* Header do Perfil */}
      <div className="bg-card border border-borda rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-texto-principal">
              {professor.nome}
            </h1>
            <p className="text-xs text-texto-secundario mt-1">
              📧 {professor.email || 'E-mail não informado'}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-destaque hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <span>➕</span> Relacionar Material
          </button>
        </div>

        {/* Detalhes Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-fundo border border-borda rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-texto-secundario tracking-wider">
              📌 Sala / Prédio
            </span>
            <p className="text-xs font-semibold text-texto-principal">
              {professor.sala || 'Não informada'}
            </p>
          </div>

          <div className="bg-fundo border border-borda rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-texto-secundario tracking-wider">
              ⚡ Nível de Exigência
            </span>
            <p className="text-xs font-semibold text-texto-principal">
              {professor.dificuldade || 'Não informado'}
            </p>
          </div>

          <div className="bg-fundo border border-borda rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-texto-secundario tracking-wider">
              📝 Cobra Presença
            </span>
            <p className="text-xs font-semibold text-texto-principal">
              {professor.passa_lista || 'Não informado'}
            </p>
          </div>
        </div>

        {professor.resumo && (
          <div className="bg-fundo border border-borda rounded-xl p-4 text-xs text-texto-secundario space-y-1">
            <span className="font-bold text-texto-principal">💡 Dicas e Visão Geral:</span>
            <p>{professor.resumo}</p>
          </div>
        )}
      </div>

      {/* Seção de Materiais Associados */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-texto-principal flex items-center gap-2">
          <span>📚</span> Materiais deste Professor ({materiais.length})
        </h2>

        {materiais.length === 0 ? (
          <div className="bg-card border border-borda rounded-2xl p-6 text-center space-y-2">
            <p className="text-xs text-texto-secundario">
              Nenhum material cadastrado especificamente para este professor ainda.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-azul-texto font-bold hover:underline cursor-pointer"
            >
              Seja o primeiro a enviar uma prova ou resumo!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materiais.map((m) => (
              <div key={m.id} className="bg-card border border-borda rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-azul-texto uppercase tracking-wider">
                      {m.disciplina} • {m.tipo}
                    </span>
                    <h3 className="text-sm font-bold text-texto-principal mt-0.5">
                      {m.titulo}
                    </h3>
                  </div>
                </div>

                {m.descricao && (
                  <p className="text-xs text-texto-secundario line-clamp-2">
                    {m.descricao}
                  </p>
                )}

                <a
                  href={m.link_drive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1.5 bg-fundo hover:border-azul-texto border border-borda text-azul-texto text-xs font-bold rounded-lg transition-colors"
                >
                  Acessar Arquivo ↗
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Relacionar Material */}
      <ModalAdicionarMaterialProfessor
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchProfessorDetails();
        }}
        professorId={professor.id}
        professorNome={professor.nome}
      />
    </main>
  );
}