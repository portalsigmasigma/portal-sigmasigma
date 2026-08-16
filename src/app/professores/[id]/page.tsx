'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Professor {
  id: string;
  nome: string;
  email?: string;
  sala?: string;
  passa_lista: boolean;
  dificuldade: string;
  resumo?: string;
}

export default function DetalheProfessor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarProfessor() {
      const { data, error } = await supabase
        .from('professores')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setProfessor(data);
      }
      setCarregando(false);
    }
    buscarProfessor();
  }, [id]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-fundo text-texto-principal flex items-center justify-center text-xs animate-pulse">
        Carregando informações do professor... ⚡
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="min-h-screen bg-fundo text-texto-principal p-8 text-center space-y-4">
        <p className="text-sm text-texto-secundario">Professor não encontrado.</p>
        <Link href="/professores" className="text-xs text-azul-texto underline">
          Voltar para lista
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <Link
          href="/professores"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-borda text-xs font-semibold text-azul-texto hover:border-azul-texto transition-all active:scale-95"
        >
          &larr; Voltar para Professores
        </Link>

        {/* Card Principal */}
        <div className="bg-card border border-borda rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-borda pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-texto-principal">
                {professor.nome}
              </h1>
              <p className="text-xs text-texto-secundario mt-1">
                {professor.email || 'Email de contato não cadastrado'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                professor.dificuldade === 'Tranquilo'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : professor.dificuldade === 'Exigente'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                Nível: {professor.dificuldade}
              </span>
            </div>
          </div>

          {/* Grid de Características */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-fundo border border-borda rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-texto-secundario tracking-wider">
                📍 Local de Atendimento / Sala
              </span>
              <p className="text-sm font-semibold text-texto-principal">
                {professor.sala || 'Não informada'}
              </p>
            </div>

            <div className="bg-fundo border border-borda rounded-xl p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-texto-secundario tracking-wider">
                📝 Cobra Presença
            </span>
            <p className="text-sm font-semibold text-texto-principal">
                {professor.passa_lista || 'Não informado'}
            </p>
            </div>
          </div>

          {/* Resumo e Dicas do Colegiado */}
          {professor.resumo && (
            <div className="bg-fundo border border-borda rounded-xl p-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-texto-secundario tracking-wider">
                💡 Dicas & Visão Geral dos Alunos
              </span>
              <p className="text-xs text-texto-secundario leading-relaxed">
                {professor.resumo}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}