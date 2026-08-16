'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAdicionarProfessor({ isOpen, onClose }: ModalProps) {
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    sala: '',
    passaLista: 'Sempre',
    dificuldade: 'Médio',
    resumo: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('professores').insert([
      {
        nome: formData.nome,
        email: formData.email,
        sala: formData.sala,
        passa_lista: formData.passaLista,
        dificuldade: formData.dificuldade,
        resumo: formData.resumo,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-borda rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-texto-secundario hover:text-texto-principal text-lg font-bold cursor-pointer"
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
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.sala}
                    onChange={(e) => setFormData({ ...formData, sala: e.target.value })}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  />
                </div>
              </div>

              {/* Nível de Exigência */}
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1.5">
                  Nível de Exigência *
                </label>
                <div className="flex flex-wrap gap-2">
                  {opcoesDificuldade.map((opcao) => {
                    const ativo = formData.dificuldade === opcao;
                    return (
                      <button
                        key={opcao}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, dificuldade: opcao }))}
                        className={`flex-1 min-w-[80px] px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          ativo
                            ? 'bg-azul-texto/10 border-azul-texto text-azul-texto shadow-[0_0_10px_rgba(0,210,255,0.15)]'
                            : 'bg-fundo border-borda text-texto-secundario hover:border-azul-texto/50 hover:text-texto-principal'
                        }`}
                      >
                        {opcao}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cobra Presença */}
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1.5">
                  Cobra Presença *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {opcoesPresenca.map((opcao) => {
                    const ativo = formData.passaLista === opcao;
                    return (
                      <button
                        key={opcao}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, passaLista: opcao }))}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                          ativo
                            ? 'bg-azul-texto/10 border-azul-texto text-azul-texto shadow-[0_0_10px_rgba(0,210,255,0.15)]'
                            : 'bg-fundo border-borda text-texto-secundario hover:border-azul-texto/50 hover:text-texto-principal'
                        }`}
                      >
                        {opcao}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Dicas e Visão Geral <span className="text-[10px] text-texto-secundario/70">(opcional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Cobra muita teoria nas provas, dá ponto por participação, etc."
                  value={formData.resumo}
                  onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
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