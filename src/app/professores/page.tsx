'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Professor {
  id: string;
  nome: string;
  email?: string;
  sala?: string;
  passa_lista: boolean;
  dificuldade: string;
}

export default function PaginaProfessores() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarProfessores() {
      const { data, error } = await supabase
        .from('professores')
        .select('*')
        .order('nome', { ascending: true });

      if (!error && data) {
        setProfessores(data);
      }
      setCarregando(false);
    }
    carregarProfessores();
  }, []);

  return (
    <div className="min-h-screen bg-fundo text-texto-principal p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-borda text-xs font-semibold text-azul-texto hover:border-azul-texto transition-all active:scale-95"
        >
          &larr; Voltar ao Início
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-azul-texto">
            Corpo Docente 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-texto-secundario mt-1">
            Clique em um professor para ver localização de sala, presença e dicas de aprovação.
          </p>
        </div>

        {carregando ? (
          <div className="text-center py-12 text-xs text-texto-secundario animate-pulse">
            Carregando professores... ⚡
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {professores.map((prof) => (
              <Link
                key={prof.id}
                href={`/professores/${prof.id}`}
                className="bg-card border border-borda hover:border-azul-texto/60 rounded-2xl p-5 shadow-sm transition-all hover:-translate-y-1 block group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-base font-bold text-texto-principal group-hover:text-azul-texto transition-colors">
                    {prof.nome}
                  </h2>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                    prof.dificuldade === 'Tranquilo'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : prof.dificuldade === 'Exigente'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {prof.dificuldade}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-texto-secundario">
                  <p>📍 <strong>Sala:</strong> {prof.sala || 'Não informada'}</p>
                  <p>📝 <strong>Presença:</strong> {prof.passa_lista ? 'Passa lista' : 'Raramente cobra'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}