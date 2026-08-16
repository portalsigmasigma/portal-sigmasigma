'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  professorId: string;
  professorNome: string;
}

export default function ModalAdicionarMaterialProfessor({
  isOpen,
  onClose,
  professorId,
  professorNome,
}: ModalProps) {
  const [enviado, setEnviado] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [tipo, setTipo] = useState('Prova');
  const [linkDrive, setLinkDrive] = useState('');
  const [descricao, setDescricao] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('materiais').insert([
      {
        titulo,
        disciplina,
        tipo,
        link_drive: linkDrive,
        descricao,
        professor_id: professorId,
        professor: professorNome,
        status: 'pendente',
      },
    ]);

    if (error) {
      console.error('Erro ao adicionar material:', error);
      alert('Erro ao enviar material. Tente novamente!');
      return;
    }

    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      onClose();
    }, 2500);
  };

  const tiposMaterial = ['Prova', 'Trabalho', 'Lista de Exercícios', 'Resumo', 'Outros'];

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
            <span className="text-4xl">📚</span>
            <h3 className="text-lg font-bold text-azul-texto">Material enviado com sucesso!</h3>
            <p className="text-xs text-texto-secundario">
              Obrigado por contribuir com a página do(a) {professorNome}!
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-extrabold text-texto-principal">
                Adicionar Material 📚
              </h2>
              <p className="text-xs text-texto-secundario mt-1">
                Relacionar prova, lista ou resumo ao docente <strong className="text-azul-texto">{professorNome}</strong>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Título do Material *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prova 1 - P1 de Cálculo II (2025/1)"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Disciplina *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cálculo I"
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Tipo de Material *
                  </label>
                  <div className="relative">
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none appearance-none cursor-pointer pr-8"
                    >
                      {tiposMaterial.map((t) => (
                        <option key={t} value={t} className="bg-[#18181b] text-white py-2">
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-texto-secundario text-xs">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Link do Arquivo (Google Drive, PDF, etc.) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={linkDrive}
                  onChange={(e) => setLinkDrive(e.target.value)}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Observações / Dicas adicionais <span className="text-[10px] text-texto-secundario/70">(opcional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Gabarito incluso na página 3."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-destaque hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Enviar Material para Aprovação
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}