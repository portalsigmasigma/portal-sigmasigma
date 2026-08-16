'use client';

import { useState } from 'react';

interface ModalContribuirProps {
  isOpen: boolean;
  onClose: () => void;
}

// Listas de sugestões pré-cadastradas
const sugestoesDisciplinas = [
  'Cálculo',
  'Sistemas Digitais',
  'Circuitos Elétricos',
  'Física Teórica',
  'Geometria Analítica',
];

const sugestoesProfessores = [
  'Dr. Roberto',
  'Dra. Ana Maria',
  'Prof. Carlos',
];

const sugestoesTiposMaterial = [
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
    tipo: '',
    linkDrive: '',
    observacoes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Dados prontos para envio:', formData);

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

              {/* Disciplina e Tipo de Material com mesmo estilo de entrada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Disciplina */}
                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Disciplina *
                  </label>
                  <input
                    type="text"
                    required
                    list="disciplinas-sugestoes"
                    placeholder="Selecione ou digite..."
                    value={formData.disciplina}
                    onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none transition-all"
                  />
                  <datalist id="disciplinas-sugestoes">
                    {sugestoesDisciplinas.map((disc) => (
                      <option key={disc} value={disc} />
                    ))}
                  </datalist>
                </div>

                {/* Tipo de Material */}
                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Tipo de Material *
                  </label>
                  <input
                    type="text"
                    required
                    list="tipos-sugestoes"
                    placeholder="Selecione ou digite..."
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none transition-all"
                  />
                  <datalist id="tipos-sugestoes">
                    {sugestoesTiposMaterial.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Professor */}
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Professor(a) *
                </label>
                <input
                  type="text"
                  required
                  list="professores-sugestoes"
                  placeholder="Selecione ou digite..."
                  value={formData.professor}
                  onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none transition-all"
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
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none transition-all"
                />
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Informações Adicionais / Observações <span className="text-[10px] text-texto-secundario/70">(opcional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Trabalho valendo 15 pontos, Prova versão B, etc."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none resize-none transition-all"
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