import { AlertOctagon, CheckCircle2 } from 'lucide-react';
import ModalBase from './ModalBase';

export default function ModalAlertas({ open, onClose, alertas }) {
  return (
    <ModalBase
      open={open} onClose={onClose}
      title="Alertas Ativos"
      icon={AlertOctagon}
      iconColor="text-red-400"
      iconBg="bg-red-500/10 border-red-500/20"
    >
      {alertas.length === 0 ? (
        <div className="py-16 text-center">
          <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-2 opacity-50" />
          <p className="text-slate-500 text-sm">Nenhum alerta ativo no momento</p>
        </div>
      ) : (
        <div className="divide-y divide-teal-500/5">
          {alertas.map(a => (
            <div key={a.id} className="px-6 py-4 hover:bg-red-500/5 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 animate-pulse" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-200">{a.ferramenta}</p>
                    <span className="text-[10px] font-mono text-slate-600 shrink-0">{a.tagRfid}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{a.mensagem}</p>
                  {a.responsavel && (
                    <p className="text-[11px] text-slate-600 mt-1">Responsável: {a.responsavel}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalBase>
  );
}