import { X, CheckCircle2, AlertCircle } from "lucide-react";

export default function ModalDevolucao({ isOpen, onClose, onConfirm, ferramenta }) {
  if (!isOpen || !ferramenta) return null;

  return (
    // Fundo escuro com desfoque (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      
      <div className="w-full max-w-md bg-[#0a1628] border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-slate-700/30 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-200">Confirmar Devolução</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6">
          <p className="text-sm text-slate-400 mb-4">
            Você está prestes a registrar a devolução da seguinte ferramenta:
          </p>
          
          <div className="bg-[#060d1f] border border-slate-700/30 rounded-xl p-4 mb-2">
            <p className="text-base font-bold text-slate-200">{ferramenta.nome}</p>
            <p className="text-xs text-slate-500 font-mono mt-1">{ferramenta.tagRfid}</p>
            
            <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center gap-2 text-sm text-slate-400">
              <AlertCircle size={14} className="text-amber-400" />
              <span>Retirada por: <strong className="text-slate-300">{ferramenta.responsavel}</strong></span>
            </div>
          </div>
        </div>

        {/* Rodapé com Botões */}
        <div className="px-6 py-4 bg-black/20 border-t border-slate-700/30 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(ferramenta.id)}
            className="px-5 py-2 rounded-lg text-sm font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 transition-colors shadow-[0_0_15px_rgba(45,212,191,0.1)] hover:shadow-[0_0_20px_rgba(45,212,191,0.2)]"
          >
            Confirmar Devolução
          </button>
        </div>

      </div>
    </div>
  );
}