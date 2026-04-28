import { Clock, CheckCircle2 } from 'lucide-react';
import ModalBase from './ModalBase';

export default function ModalAtrasadas({ open, onClose, ferramentas }) {
  return (
    <ModalBase
      open={open} onClose={onClose}
      title="Ferramentas Atrasadas"
      icon={Clock}
      iconColor="text-red-400"
      iconBg="bg-red-500/10 border-red-500/20"
    >
      {ferramentas.length === 0 ? (
        <div className="py-16 text-center">
          <CheckCircle2 size={28} className="text-emerald-500 mx-auto mb-2 opacity-50" />
          <p className="text-slate-500 text-sm">Nenhuma ferramenta fora do prazo</p>
        </div>
      ) : (
        <div className="divide-y divide-teal-500/5">
          {ferramentas.map(f => (
            <div key={f.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-red-500/5 transition-colors">
              <div>
                <p className="text-sm font-medium text-white">{f.ferramenta ?? f.nome}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{f.tagRfid} · {f.responsavel}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-red-400">{f.tempoForaLabel}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-red-500/10 text-red-400 border-red-500/20">
                  Atrasada
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalBase>
  );
}