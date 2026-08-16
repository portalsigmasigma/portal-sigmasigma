'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';


interface ModalContribuirProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sugestões de disciplinas pré-cadastradas
const sugestoesDisciplinas = [
  'Cálculo',
  'Sistemas Digitais',
  'Circuitos Elétricos',
  'Física Teórica',
  'Geometria Analítica',
];

// Sugestões de professores pré-cadastrados
const sugestoesProfessores = [
  'Dr. Roberto',
  'Dra. Ana Maria',
  'Prof. Carlos',
];

// Tipos de materiais disponíveis
const tiposMaterial = [
  'Prova',
  'Lista de Exercícios',
  'Trabalho',
  'Gabarito',
  'Material Didático',
];

export default function ModalContribuir({ isOpen, onClose }: ModalContribuirProps) {
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    disciplina: '',
    professor: '',
    tipo: tiposMaterial[0],
    linkDrive: '',
    observacoes: '',
  });

  if (!isOpen) return null;

// Dentro do componente ModalContribuir:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { error } = await supabase.from('contribuicoes').insert([
    {
      titulo: formData.titulo,
      disciplina: formData.disciplina,
      professor: formData.professor,
      tipo: formData.tipo,
      link_drive: formData.linkDrive,
      observacoes: formData.observacoes,
      status: 'pendente',
    },
  ]);

  if (error) {
    console.error('Erro ao enviar:', error);
    alert('Erro ao enviar o material. Tente novamente!');
    return;
  }

  setEnviado(true);
  setTimeout(() => {
    setEnviado(false);
    onClose();
  }, 2500);
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-borda rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-texto-secundario hover:text-texto-principal text-lg font-bold"
        >
          ✕
        </button>

        {enviado ? (
          <div className="text-center py-8 space-y-2">
            <span className="text-4xl">🚀</span>
            <h3 className="text-lg font-bold text-azul-texto">Material enviado com sucesso!</h3>
            <p className="text-xs text-texto-secundario">
              Obrigado por ajudar a salvar a pele dos colegas! Em breve o arquivo estará disponível.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-extrabold text-texto-principal">
                Contribuir com Material 📥
              </h2>
              <p className="text-xs text-texto-secundario mt-1">
                Envie provas, listas ou gabaritos via link (Google Drive, Dropbox, etc.).
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Título */}
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Título do Material *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prova 1 - Turma A"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none transition-all"
                />
              </div>

              {/* Disciplina (Com autocompletar e digitação livre) e Tipo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Disciplina *
                  </label>
                  <input
                    type="text"
                    required
                    list="disciplinas-sugestoes"
                    placeholder="Selecione ou digite nova..."
                    value={formData.disciplina}
                    onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  />
                  <datalist id="disciplinas-sugestoes">
                    {sugestoesDisciplinas.map((disc) => (
                      <option key={disc} value={disc} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Tipo de Material *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  >
                    {tiposMaterial.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Professor (Com autocompletar e digitação livre) */}
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Professor(a) *
                </label>
                <input
                  type="text"
                  required
                  list="professores-sugestoes"
                  placeholder="Selecione ou digite novo professor..."
                  value={formData.professor}
                  onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                />
                <datalist id="professores-sugestoes">
                  {sugestoesProfessores.map((prof) => (
                    <option key={prof} value={prof} />
                  ))}
                </datalist>
              </div>

              {/* Link do Arquivo */}
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Link do Arquivo (Google Drive / Dropbox) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={formData.linkDrive}
                  onChange={(e) => setFormData({ ...formData, linkDrive: e.target.value })}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                />
              </div>

              {/* Informações Adicionais (Opcional) */}
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Informações Adicionais / Observações <span className="text-[10px] text-texto-secundario/70">(opcional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Trabalho valendo 15 pontos, Prova versão B, questões 3 e 4 foram anuladas, etc."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-destaque hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
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