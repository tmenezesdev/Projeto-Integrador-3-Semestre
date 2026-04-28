import { Activity } from 'lucide-react';
import ModalBase from './ModalBase';

function Barra({ label, valor, total, cor, textCor }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-300 font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xl font-black ${textCor}`}>{valor}</span>
          <span className="text-xs text-slate-600">/ {total} ({pct}%)</span>
        </div>
      </div>
      <div className="h-2 bg-teal-500/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${cor} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ModalTaxaPrazo({ open, onClose, total, emUso, atrasadas }) {
  const disponiveis = total - emUso - atrasadas;
  const taxaPrazo   = (emUso + atrasadas) > 0 ? Math.round((emUso / (emUso + atrasadas)) * 100) : 100;

  return (
    <ModalBase open={open} onClose={onClose} title="Taxa no Prazo" icon={Activity}
      iconColor="text-blue-400" iconBg="bg-blue-500/10 border-blue-500/20"
    >
      <div className="px-6 py-6 flex flex-col gap-6">

        {/* Número principal */}
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-5 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Ferramentas em dia</p>
          <p className="text-5xl font-black text-blue-400">{taxaPrazo}%</p>
          <p className="text-xs text-slate-600 mt-1">
            {emUso} em uso · {atrasadas} atrasada{atrasadas !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Barras */}
        <div className="flex flex-col gap-5">
          <Barra label="Disponíveis" valor={disponiveis} total={total} cor="bg-green-500"   textCor="text-green-400"   />
          <Barra label="Em Uso"      valor={emUso}       total={total} cor="bg-teal-500"    textCor="text-teal-400"    />
          <Barra label="Atrasadas"   valor={atrasadas}   total={total} cor="bg-red-500"     textCor="text-red-400"     />
        </div>

      </div>
    </ModalBase>
  );
}