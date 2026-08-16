'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAdicionarProfessor({ isOpen, onClose }: ModalProps) {
  const [enviado, setEnviado] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [sala, setSala] = useState('');
  const [dificuldade, setDificuldade] = useState('Médio');
  const [passaLista, setPassaLista] = useState('Sempre');
  const [resumo, setResumo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('professores').insert([
      {
        nome,
        email,
        sala,
        passa_lista: passaLista,
        dificuldade,
        resumo,
        status: 'pendente',
      },
    ]);

    if (error) {
      console.error('Erro ao sugerir professor:', error);
      alert('Erro ao enviar sugestão. Tente novamente!');
      return;
    }

    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      onClose();
    }, 2500);
  };

  const opcoesDificuldade = ['Tranquilo', 'Médio', 'Exigente'];
  const opcoesPresenca = ['Nunca', 'Às vezes', 'Sempre', 'Passa lista'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="bg-card border border-borda rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-texto-secundario hover:text-texto-principal text-lg font-bold cursor-pointer p-2"
        >
          ✕
        </button>

        {enviado ? (
          <div className="text-center py-8 space-y-2">
            <span className="text-4xl">👨‍🏫</span>
            <h3 className="text-lg font-bold text-azul-texto">Docente sugerido com sucesso!</h3>
            <p className="text-xs text-texto-secundario">
              Obrigado por contribuir! As informações passarão por avaliação em breve.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-extrabold text-texto-principal">
                Adicionar Docente ➕
              </h2>
              <p className="text-xs text-texto-secundario mt-1">
                Sugira as informações de um professor para ajudar na grade do curso.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Nome do Docente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fausto De Camargo Júnior"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    E-mail de Contato
                  </label>
                  <input
                    type="email"
                    placeholder="exemplo@cefetmg.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Sala / Prédio
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Sala 204 - Prédio 2"
                    value={sala}
                    onChange={(e) => setSala(e.target.value)}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  />
                </div>
              </div>

              {/* Select para Nível de Exigência */}
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Nível de Exigência *
                </label>
                <div className="relative">
                  <select
                    value={dificuldade}
                    onChange={(e) => setDificuldade(e.target.value)}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none appearance-none cursor-pointer pr-8"
                  >
                    {opcoesDificuldade.map((opcao) => (
                      <option key={opcao} value={opcao} className="bg-card text-texto-principal">
                        {opcao}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-texto-secundario text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Select para Cobra Presença */}
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Cobra Presença *
                </label>
                <div className="relative">
                  <select
                    value={passaLista}
                    onChange={(e) => setPassaLista(e.target.value)}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none appearance-none cursor-pointer pr-8"
                  >
                    {opcoesPresenca.map((opcao) => (
                      <option key={opcao} value={opcao} className="bg-card text-texto-principal">
                        {opcao}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-texto-secundario text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Dicas e Visão Geral <span className="text-[10px] text-texto-secundario/70">(opcional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Cobra muita teoria nas provas, dá ponto por participação, etc."
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-destaque hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Enviar para Moderação
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}