import { X, Clock, AlertTriangle, User } from "lucide-react";

export default function ModalDetalhesAtraso({ isOpen, onClose, titulo, cor, dados }) {
  if (!isOpen) return null;

  const colorMap = {
    red: { text: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/10' },
    amber: { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' },
  };

  const c = colorMap[cor] || colorMap.red;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
      <div className="w-full max-w-2xl bg-[#0a1628] border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`px-6 py-4 border-b border-slate-700/30 flex items-center justify-between ${c.bg}`}>
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className={c.text} />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{titulo}</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 bg-[#060d1f]">
          <div className="space-y-3">
            {dados.map((item) => (
              <div key={item.id} className="p-4 bg-[#0a1628] border border-slate-700/30 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-200">{item.nome}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-mono text-slate-500">{item.tag_rfid}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <User size={12}/> {item.responsavel}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-base font-bold font-mono ${c.text}`}>{item.tempoFora}</p>
                  <p className="text-[10px] text-slate-600 uppercase font-bold">Tempo Total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/30 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all">
            FECHAR
          </button>
        </div>
      </div>
    </div>
  );
}