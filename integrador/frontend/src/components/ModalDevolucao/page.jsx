import { useState } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

export default function ModalDevolucao({ isOpen, onClose, onConfirm, ferramenta }) {
  const [observacao, setObservacao] = useState('');

  if (!isOpen || !ferramenta) return null;

  const handleConfirm = () => {
    onConfirm(ferramenta.id, observacao.trim() || null);
    setObservacao('');
  };

  const handleClose = () => {
    setObservacao('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-[#0a1628] border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-slate-700/30 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-200">Confirmar Devolução</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-slate-400">
            Você está prestes a registrar a devolução da seguinte ferramenta:
          </p>

          <div className="bg-[#060d1f] border border-slate-700/30 rounded-xl p-4">
            <p className="text-base font-bold text-slate-200">{ferramenta.nome}</p>
            <p className="text-xs text-slate-500 font-mono mt-1">{ferramenta.tagRfid}</p>
            <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center gap-2 text-sm text-slate-400">
              <AlertCircle size={14} className="text-amber-400" />
              <span>Retirada por: <strong className="text-slate-300">{ferramenta.responsavel}</strong></span>
            </div>
          </div>

          {/* Campo de observação */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Observação <span className="text-slate-700 normal-case font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Devolvida com avaria na ponteira..."
              className="w-full bg-[#060d1f] border border-slate-700/40 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-700 focus:border-teal-500/50 focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 bg-black/20 border-t border-slate-700/30 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-lg text-sm font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 transition-colors shadow-[0_0_15px_rgba(45,212,191,0.1)] hover:shadow-[0_0_20px_rgba(45,212,191,0.2)]"
          >
            Confirmar Devolução
          </button>
        </div>
      </div>
    </div>
  );
}
