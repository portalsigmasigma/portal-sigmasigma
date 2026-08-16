'use client';

import { useState } from 'react';

interface ModalContribuirProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalContribuir({ isOpen, onClose }: ModalContribuirProps) {
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    disciplina: 'Cálculo',
    professor: '',
    tipo: 'Prova',
    linkDrive: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui pode integrar com uma API, Webhook do Discord/Formspree ou simplesmente simular o envio
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-borda rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4">
        
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
              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Título do Material
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Prova 1 com Gabarito"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Disciplina
                  </label>
                  <select
                    value={formData.disciplina}
                    onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  >
                    <option value="Cálculo">Cálculo</option>
                    <option value="Sistemas Digitais">Sistemas Digitais</option>
                    <option value="Circuitos Elétricos">Circuitos Elétricos</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-texto-secundario mb-1">
                    Tipo
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                  >
                    <option value="Prova">Prova</option>
                    <option value="Gabarito">Gabarito</option>
                    <option value="Lista">Lista</option>
                    <option value="Livro">Livro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Professor(a)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Roberto"
                  value={formData.professor}
                  onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                  className="w-full bg-fundo border border-borda rounded-xl p-2.5 text-xs text-texto-principal focus:border-azul-texto outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-texto-secundario mb-1">
                  Link do Arquivo (Drive / Dropbox)
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