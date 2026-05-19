'use client';
import { BASE_URL } from '@/lib/apiConfig';

import { useState, useEffect } from "react";
import { History, Search, Download, AlertCircle, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Sk } from '@/components/ui/skeleton';
import ExcelJS from 'exceljs';
import { useAuth } from '@/hooks/useAuth';

const API_URL = BASE_URL + '/api/supervisor/historico';
const PAGE_SIZE = 20;

function gerarGraficoBase64(labels, retiradas, devolucoes) {
  const canvas = document.createElement('canvas');
  canvas.width  = 900;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pad = { top: 60, right: 40, bottom: 80, left: 55 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;

  // fundo
  ctx.fillStyle = '#0d1f3c';
  ctx.fillRect(0, 0, W, H);

  // título
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Movimentações por Data', W / 2, 38);

  const maxVal = Math.max(...retiradas, ...devolucoes, 1);
  const gridLines = 5;

  // grid + eixo Y
  for (let i = 0; i <= gridLines; i++) {
    const y = pad.top + cH - (i / gridLines) * cH;
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cW, y); ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(Math.round((i / gridLines) * maxVal)), pad.left - 8, y + 4);
  }

  // barras
  const groupW = cW / Math.max(labels.length, 1);
  const barW   = Math.min(groupW * 0.32, 28);
  const barGap = 4;

  labels.forEach((label, i) => {
    const cx = pad.left + i * groupW + groupW / 2;

    // retirada
    const rH = (retiradas[i] / maxVal) * cH || 0;
    ctx.fillStyle = '#f97316';
    ctx.fillRect(cx - barW - barGap / 2, pad.top + cH - rH, barW, rH);

    // devolução
    const dH = (devolucoes[i] / maxVal) * cH || 0;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(cx + barGap / 2, pad.top + cH - dH, barW, dH);

    // label X
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, pad.top + cH + 18);
  });

  // eixo X linha
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + cH);
  ctx.lineTo(pad.left + cW, pad.top + cH);
  ctx.stroke();

  // legenda
  const legY = H - 16;
  ctx.fillStyle = '#f97316';
  ctx.fillRect(W / 2 - 130, legY - 11, 13, 13);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Retiradas', W / 2 - 113, legY);

  ctx.fillStyle = '#10b981';
  ctx.fillRect(W / 2 + 20, legY - 11, 13, 13);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('Devoluções', W / 2 + 37, legY);

  return canvas.toDataURL('image/png').split(',')[1];
}

export default function HistoricoPage() {
  const { getToken } = useAuth();
  const [historico, setHistorico] = useState([]);
  const [busca, setBusca]         = useState('');
  const [filtroOp, setFiltroOp]   = useState('TODOS');
  const [pagina, setPagina]       = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro]           = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${getToken()}` } });
        if (!res.ok) throw new Error();
        setHistorico(await res.json());
      } catch { setErro(true); }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  useEffect(() => { setPagina(1); }, [busca, filtroOp]);

  const dadosFiltrados = historico.filter(item => {
    const matchBusca =
      item.ferramenta?.toLowerCase().includes(busca.toLowerCase()) ||
      item.responsavel?.toLowerCase().includes(busca.toLowerCase()) ||
      item.tagRfid?.toLowerCase().includes(busca.toLowerCase());
    const matchOp = filtroOp === 'TODOS' || item.operacao === filtroOp;
    return matchBusca && matchOp;
  });

  const handleExportar = async () => {
    const porData = {};
    dadosFiltrados.forEach(log => {
      const data = log.dataHora?.split(' ')[0] ?? 'N/A';
      if (!porData[data]) porData[data] = { retiradas: 0, devolucoes: 0 };
      if (log.operacao === 'RETIRADA') porData[data].retiradas++;
      else porData[data].devolucoes++;
    });
    const labels    = Object.keys(porData).sort();
    const retArr    = labels.map(d => porData[d].retiradas);
    const devArr    = labels.map(d => porData[d].devolucoes);
    const imgBase64 = gerarGraficoBase64(labels, retArr, devArr);

    const wb = new ExcelJS.Workbook();
    wb.creator = 'SmartBench';

    const ws = wb.addWorksheet('Histórico');
    ws.columns = [
      { header: 'ID',          key: 'id',          width: 8  },
      { header: 'Data e Hora', key: 'dataHora',     width: 20 },
      { header: 'Ferramenta',  key: 'ferramenta',   width: 32 },
      { header: 'TAG RFID',    key: 'tagRfid',      width: 16 },
      { header: 'Responsável', key: 'responsavel',  width: 24 },
      { header: 'Cargo',       key: 'cargo',        width: 14 },
      { header: 'Operação',    key: 'operacao',     width: 14 },
      { header: 'Método',      key: 'metodo',       width: 14 },
      { header: 'Observação',  key: 'observacao',   width: 38 },
    ];

    ws.getRow(1).eachCell(cell => {
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D1F3C' } };
      cell.font      = { bold: true, color: { argb: 'FF2DD4BF' }, size: 10 };
      cell.border    = { bottom: { style: 'thin', color: { argb: 'FF2DD4BF' } } };
      cell.alignment = { vertical: 'middle' };
    });
    ws.getRow(1).height = 22;

    dadosFiltrados.forEach(log => {
      const row = ws.addRow({
        id:          log.id,
        dataHora:    log.dataHora,
        ferramenta:  log.ferramenta,
        tagRfid:     log.tagRfid,
        responsavel: log.responsavel,
        cargo:       log.cargo,
        operacao:    log.operacao,
        metodo:      log.metodo === 'RFID_AUTOMATICO' ? 'RFID AUTO' : 'MANUAL',
        observacao:  log.observacao || '',
      });

      const opCell = row.getCell('operacao');
      opCell.font = {
        bold: true,
        color: { argb: log.operacao === 'RETIRADA' ? 'FFF97316' : 'FF10B981' },
      };

      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A1628' } };
        if (!cell.font) cell.font = {};
        if (!cell.font.color) cell.font.color = { argb: 'FFE2E8F0' };
        cell.font.size = 10;
        cell.alignment = { vertical: 'middle' };
      });
      row.height = 18;
    });

    const totalRow = ws.addRow([`${dadosFiltrados.length} registro(s) exportado(s)`]);
    totalRow.getCell(1).font = { italic: true, color: { argb: 'FF64748B' }, size: 9 };

    const wsChart = wb.addWorksheet('Gráfico');
    const imgId = wb.addImage({ base64: imgBase64, extension: 'png' });
    wsChart.addImage(imgId, {
      tl: { col: 0.5, row: 0.5 },
      ext: { width: 900, height: 420 },
    });
    wsChart.getCell('A1').value = '';

    const { saveAs } = await import('file-saver');
    const buffer    = await wb.xlsx.writeBuffer();
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `historico-smartbench-${dataAtual}.xlsx`);
  };

  const totalPaginas = Math.max(1, Math.ceil(dadosFiltrados.length / PAGE_SIZE));
  const paginados = dadosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  // LOADING STATE
  if (isLoading) return (
    <div className="flex-1 p-4 md:p-8 bg-[#09090A] min-h-screen text-white font-sans">
      <div className="flex flex-col gap-1 mb-6 md:mb-10">
        <Sk className="h-3 w-24" />
        <div className="flex items-center gap-2 md:gap-3">
          <History className="text-teal-400 h-5 md:h-7 w-5 md:w-7 opacity-30" />
          <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">Histórico de Movimentações</h1>
        </div>
        <Sk className="h-3 w-60 md:w-80 mt-1 ml-7 md:ml-10" />
      </div>
      <div className="flex flex-col gap-4 mb-6">
        <Sk className="h-10 w-full rounded-lg" />
        <Sk className="h-10 w-full md:w-52 rounded-lg" />
      </div>
      <div className="bg-[#0a1628] border border-slate-700/30 rounded-xl overflow-hidden">
        <div className="divide-y divide-slate-700/20">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="p-4 md:p-6 space-y-3">
              <Sk className="h-4 w-32" />
              <Sk className="h-4 w-48" />
              <Sk className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ERROR STATE
  if (erro) return (
    <div className="flex items-center justify-center min-h-screen bg-[#09090A] p-4">
      <div className="text-center">
        <AlertCircle className="text-red-400 w-10 h-10 mx-auto mb-3" />
        <p className="text-white font-semibold">Erro ao carregar histórico</p>
      </div>
    </div>
  );

  return (
    
    <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#09090A] min-h-screen text-white font-sans overflow-y-auto">

      {/* HEADER */}
      <div className="flex flex-col gap-1 mb-6 md:mb-10">
        <p className="text-xs font-bold text-teal-500 uppercase tracking-widest">Auditoria</p>
        <div className="flex items-center gap-2 md:gap-3">
          <History className="text-teal-400 h-5 md:h-7 w-5 md:w-7" />
          <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">Histórico de Movimentações</h1>
        </div>
        <p className="text-xs md:text-sm text-slate-500 mt-1 ml-7 md:ml-10">Registro completo de retiradas e devoluções no SmartBench.</p>
      </div>

      {/* FILTROS - DESKTOP */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input
              type="text"
              placeholder="Pesquisar por TAG, ferramenta ou responsável..."
              className="w-full bg-[#0a1628] border border-slate-700/40 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none transition-colors"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex gap-1 bg-[#0a1628] border border-slate-700/40 rounded-lg p-1">
            {['TODOS', 'RETIRADA', 'DEVOLUCAO'].map(op => (
              <button
                key={op}
                onClick={() => setFiltroOp(op)}
                className={`cursor-pointer px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  filtroOp === op
                    ? op === 'RETIRADA'  ? 'bg-orange-500/20 text-orange-400'
                    : op === 'DEVOLUCAO' ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-teal-500/20 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {op === 'TODOS' ? 'Todos' : op === 'RETIRADA' ? 'Retiradas' : 'Devoluções'}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleExportar}
          className="cursor-pointer flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-teal-900/30"
        >
          <Download size={14} /> Exportar
        </button>
      </div>

      {/* FILTROS - MOBILE */}
      <div className="md:hidden flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full bg-[#0a1628] border border-slate-700/40 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:border-teal-500/50 focus:outline-none transition-colors"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="cursor-pointer flex-1 bg-[#0a1628] border border-slate-700/40 rounded-lg py-2.5 text-xs font-bold text-teal-400 transition-all hover:border-teal-500/50"
          >
            {filterOpen ? 'Fechar Filtros' : 'Filtros'}
          </button>
          <button
            onClick={handleExportar}
            className="cursor-pointer flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-teal-900/30"
          >
            <Download size={14} />
          </button>
        </div>

        {filterOpen && (
          <div className="bg-[#0a1628] border border-slate-700/40 rounded-lg p-3 space-y-3">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-slate-400">Tipo de Operação:</p>
              {['TODOS', 'RETIRADA', 'DEVOLUCAO'].map(op => (
                <button
                  key={op}
                  onClick={() => {
                    setFiltroOp(op);
                    setFilterOpen(false);
                  }}
                  className={`cursor-pointer w-full px-3 py-2 rounded-md text-xs font-bold transition-all text-left ${
                    filtroOp === op
                      ? op === 'RETIRADA'  ? 'bg-orange-500/20 text-orange-400'
                      : op === 'DEVOLUCAO' ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-teal-500/20 text-teal-400'
                      : 'bg-[#060d1f] text-slate-400'
                  }`}
                >
                  {op === 'TODOS' ? '✓ Todos' : op === 'RETIRADA' ? '✓ Retiradas' : '✓ Devoluções'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TABELA - DESKTOP */}
      <div className="hidden md:block bg-[#0a1628] border border-slate-700/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#060d1f] text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-700/30">
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">Data e Hora</th>
                <th className="px-6 py-4 font-bold">Ferramenta</th>
                <th className="px-6 py-4 font-bold">Responsável</th>
                <th className="px-6 py-4 font-bold text-center">Operação</th>
                <th className="px-6 py-4 font-bold">Método</th>
                <th className="px-6 py-4 font-bold">Observação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {paginados.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 text-[11px] font-mono text-slate-600 group-hover:text-teal-400 transition-colors">{log.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">{log.dataHora}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-200 whitespace-nowrap">{log.ferramenta}</p>
                    <p className="text-[10px] text-slate-600 font-mono mt-0.5">{log.tagRfid}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-300 whitespace-nowrap">{log.responsavel}</p>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">{log.cargo}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold uppercase ${log.operacao === 'RETIRADA' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {log.operacao === 'RETIRADA' ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
                      {log.operacao}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded border ${log.metodo === 'MANUAL' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' : 'border-teal-500/20 text-teal-400 bg-teal-500/5'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${log.metodo === 'MANUAL' ? 'bg-amber-500' : 'bg-teal-400'}`} />
                      {log.metodo === 'RFID_AUTOMATICO' ? 'RFID AUTO' : 'MANUAL'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 max-w-[180px] truncate">
                    {log.observacao || <span className="text-slate-700">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {dadosFiltrados.length === 0 && (
          <div className="p-16 text-center text-slate-600 text-sm">Nenhum registro encontrado.</div>
        )}
        {/* PAGINAÇÃO - DESKTOP */}
        <div className="px-6 py-3 border-t border-slate-700/30 flex items-center justify-between flex-wrap gap-4">
          <span className="text-xs text-slate-700">
            {dadosFiltrados.length} registro{dadosFiltrados.length !== 1 ? 's' : ''} · página {pagina} de {totalPaginas}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs text-slate-400 border border-slate-700/40 px-3 py-1.5 rounded-lg hover:border-teal-500/30 transition-colors"
            >
              <ChevronLeft size={13} /> Anterior
            </button>
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina >= totalPaginas}
              className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-xs text-slate-400 border border-slate-700/40 px-3 py-1.5 rounded-lg hover:border-teal-500/30 transition-colors"
            >
              Próximo <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* CARDS - MOBILE */}
      <div className="md:hidden space-y-3">
        {paginados.length > 0 ? (
          paginados.map((log) => (
            <div key={log.id} className="bg-[#0a1628] border border-slate-700/30 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-xs text-slate-600 font-mono">ID {log.id}</p>
                  <p className="text-xs text-slate-400 mt-1">{log.dataHora}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold uppercase flex-shrink-0 ${log.operacao === 'RETIRADA' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {log.operacao === 'RETIRADA' ? <ArrowUpRight size={10} /> : <ArrowDownLeft size={10} />}
                  {log.operacao === 'RETIRADA' ? 'RET' : 'DEV'}
                </span>
              </div>

              <div className="border-t border-slate-700/20 pt-3 space-y-2">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Ferramenta</p>
                  <p className="text-sm text-slate-200 font-medium">{log.ferramenta}</p>
                  <p className="text-[9px] text-slate-600 font-mono mt-0.5">{log.tagRfid}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Responsável</p>
                    <p className="text-sm text-slate-300">{log.responsavel}</p>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">{log.cargo}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Método</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded border mt-1 ${log.metodo === 'MANUAL' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' : 'border-teal-500/20 text-teal-400 bg-teal-500/5'}`}>
                      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${log.metodo === 'MANUAL' ? 'bg-amber-500' : 'bg-teal-400'}`} />
                      {log.metodo === 'RFID_AUTOMATICO' ? 'AUTO' : 'MANUAL'}
                    </span>
                  </div>
                </div>

                {log.observacao && (
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Observação</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{log.observacao}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-600 text-sm">Nenhum registro encontrado.</div>
        )}
      </div>

      {/* PAGINAÇÃO - MOBILE */}
      <div className="md:hidden mt-6 flex flex-col gap-3">
        <div className="text-center text-xs text-slate-700">
          {dadosFiltrados.length} registro{dadosFiltrados.length !== 1 ? 's' : ''} · página {pagina} de {totalPaginas}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex-1 flex items-center justify-center gap-1 text-xs text-slate-400 border border-slate-700/40 px-3 py-2.5 rounded-lg hover:border-teal-500/30 transition-colors font-bold"
          >
            <ChevronLeft size={13} /> Anterior
          </button>
          <button
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={pagina >= totalPaginas}
            className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex-1 flex items-center justify-center gap-1 text-xs text-slate-400 border border-slate-700/40 px-3 py-2.5 rounded-lg hover:border-teal-500/30 transition-colors font-bold"
          >
            Próximo <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </main>
  );
}