'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  tipo: 'Obrigatória' | 'Optativa';
  periodo?: string;
}

interface Material {
  id: string;
  titulo: string;
  tipo: string;
  professor?: string;
  link_drive: string;
  observacoes?: string;
  created_at?: string;
}

export default function PaginaDetalheDisciplina() {
  const params = useParams();
  const id = params?.id as string;

  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDetalhes() {
      if (!id) return;
      setCarregando(true);

      // 1. Buscar a disciplina específica pelo ID
      const { data: discData, error: discError } = await supabase
        .from('disciplinas')
        .select('*')
        .eq('id', id)
        .single();

      if (!discError && discData) {
        setDisciplina(discData);

        // 2. Buscar materiais vinculados ao nome ou código da disciplina
        const { data: matData } = await supabase
          .from('materiais')
          .select('*')
          .or(`disciplina.eq.${discData.nome},disciplina.eq.${discData.codigo}`)
          .order('created_at', { ascending: false });

        setMateriais(matData || []);
      }

      setCarregando(false);
    }

    carregarDetalhes();
  }, [id]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-fundo text-texto-principal p-8 flex items-center justify-center">
        <p className="text-xs text-texto-secundario animate-pulse">Carregando disciplina... ⚡</p>
      </div>
    );
  }

  if (!disciplina) {
    return (
      <div className="min-h-screen bg-fundo text-texto-principal p-8 max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-xl font-bold text-azul-texto">Disciplina não encontrada</h1>
        <Link
          href="/disciplinas"
          className="inline-block px-4 py-2 bg-card border border-borda rounded-lg text-xs font-semibold hover:border-azul-texto transition-all"
        >
          &larr; Voltar para Disciplinas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8 w-full max-w-full box-border">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Botão Voltar */}
        <Link
          href="/disciplinas"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-borda text-xs font-semibold text-azul-texto hover:border-azul-texto transition-all"
        >
          &larr; Voltar para Disciplinas
        </Link>

        {/* Informações da Disciplina */}
        <div className="bg-card border border-borda rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-borda/40 text-azul-texto">
              {disciplina.codigo}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded border bg-blue-500/10 text-azul-texto border-blue-500/20">
              {disciplina.tipo}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-texto-principal">{disciplina.nome}</h1>

          <p className="text-xs text-texto-secundario">
            {disciplina.tipo === 'Obrigatória'
              ? `Pertence ao ${disciplina.periodo || 'período não informado'}`
              : 'Disciplina de caráter optativo'}
          </p>
        </div>

        {/* Lista de Materiais da Disciplina */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-azul-texto">
            Materiais e Provas Associados ({materiais.length})
          </h2>

          {materiais.length > 0 ? (
            <div className="bg-card border border-borda rounded-xl overflow-hidden divide-y divide-borda">
              {materiais.map((mat) => (
                <div key={mat.id} className="p-4 flex items-center justify-between hover:bg-borda/20 transition-all">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-borda/40 text-texto-secundario">
                      {mat.tipo}
                    </span>
                    <h3 className="text-xs font-bold text-texto-principal">{mat.titulo}</h3>
                    {mat.professor && (
                      <p className="text-[11px] text-texto-secundario">Prof. {mat.professor}</p>
                    )}
                  </div>

                  <a
                    href={mat.link_drive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-destaque text-white text-xs font-semibold rounded-lg hover:bg-destaque/90 transition-all flex items-center gap-1"
                  >
                    Abrir Link ↗
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-borda rounded-xl p-8 text-center text-xs text-texto-secundario">
              Nenhum material vinculado a esta disciplina até o momento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}