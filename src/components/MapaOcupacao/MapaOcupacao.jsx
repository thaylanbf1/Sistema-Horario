import React, { useState } from 'react';
import { 
  Search, Clock, MapPin, GraduationCap, FileText, Download, Calendar
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Shift = { MANHA: 'MANHA', TARDE: 'TARDE' };

const SLOTS = [
  { label: "07:30-08:20", shift: Shift.MANHA },
  { label: "08:20-09:10", shift: Shift.MANHA },
  { label: "09:10-10:00", shift: Shift.MANHA },
  { label: "10:00-10:15", shift: Shift.MANHA, isBreak: true },
  { label: "10:15-11:05", shift: Shift.MANHA },
  { label: "11:05-11:55", shift: Shift.MANHA },
  
  { label: "13:30-14:20", shift: Shift.TARDE },
  { label: "14:20-15:10", shift: Shift.TARDE },
  { label: "15:10-16:00", shift: Shift.TARDE },
  { label: "16:00-16:15", shift: Shift.TARDE, isBreak: true },
  { label: "17:05-17:55", shift: Shift.TARDE },
  { label: "17:55-18:45", shift: Shift.TARDE },
];

const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default function MapaOcupacao() {
  const [filtroTurno, setFiltroTurno] = useState('todos');
  const [filtroCurso, setFiltroCurso] = useState('Eng. Software');
  const [filtroTurma, setFiltroTurma] = useState('2024.1');
  const [filtroSala, setFiltroSala] = useState('todas');
  const [buscaProfessor, setBuscaProfessor] = useState('');

  // --- EXPORTAR EXCEL 
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
   
    const tables = document.querySelectorAll('table[id^="tabela-mapa"]');
    tables.forEach((table, index) => {
      const ws = XLSX.utils.table_to_sheet(table);
      XLSX.utils.book_append_sheet(wb, ws, `Turno ${index + 1}`);
    });
    XLSX.writeFile(wb, `Mapa_Ocupacao_UEPA.xlsx`);
  };

  // --- EXPORTAR PDF ---
  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(14);
    doc.setTextColor(28, 26, 163);
    doc.text("UNIVERSIDADE DO ESTADO DO PARÁ - CAMPUS ANANINDEUA", 14, 15);
    
    let finalY = 22;
    const tables = document.querySelectorAll('table[id^="tabela-mapa"]');
    
    tables.forEach((table, index) => {
      autoTable(doc, {
        html: table,
        startY: finalY + 10,
        theme: 'grid',
        headStyles: { fillColor: [28, 26, 163] },
        styles: { fontSize: 7 },
      });
      finalY = doc.lastAutoTable.finalY;
    });

    doc.save(`Mapa_Ocupacao_UEPA.pdf`);
  };

  
  const RenderTabelaTurno = ({ titulo, turnoAlvo }) => {
    const slotsFiltrados = SLOTS.filter(s => s.shift === turnoAlvo);

    return (
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-6 rounded-full ${turnoAlvo === Shift.MANHA ? 'bg-sky-500' : 'bg-orange-500'}`}></div>
          <h2 className="text-lg font-black text-slate-700 uppercase tracking-wide">{titulo}</h2>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <table id={`tabela-mapa-${turnoAlvo}`} className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1c1aa3] text-white">
                <th className="p-4 text-left text-xs font-black uppercase border-r border-white/10">Horário</th>
                {WEEKDAYS.map(day => (
                  <th key={day} className="p-4 border-l border-white/10 text-center text-xs font-black uppercase">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slotsFiltrados.map((slot, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className={`p-4 text-[10px] font-black border-r border-slate-100 ${slot.isBreak ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                    {slot.label}
                  </td>
                  {WEEKDAYS.map(day => (
                    <td key={day} className={`p-2 border-l border-slate-50 ${slot.isBreak ? 'bg-amber-50/20' : ''}`}>
                      {!slot.isBreak && (
                        <div className="min-h-[70px] p-2 rounded-lg border border-blue-100 bg-blue-50/30">
                          <p className="text-[8px] font-black text-blue-900 uppercase tracking-tighter">{filtroCurso} {filtroTurma}</p>
                          <p className="text-[9px] text-blue-700 font-bold mt-1">Thiago Conte</p>
                          <p className="text-[8px] text-blue-500 mt-2 font-bold uppercase">
                            {filtroSala === 'todas' ? (WEEKDAYS.indexOf(day) % 2 === 0 ? 'Sala 03' : 'LABINF') : filtroSala}
                          </p>
                        </div>
                      )}
                      {slot.isBreak && <div className="text-center text-[8px] font-black text-amber-400 uppercase tracking-widest">Pausa</div>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      
      {/* PAINEL DE FILTROS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl font-black text-[#1c1aa3]">MAPA DE OCUPAÇÃO</h1>
          <div className="flex gap-2">
            <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all border border-red-100">
              <FileText size={16} /> PDF
            </button>
            <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100">
              <Download size={16} /> EXCEL
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Professor</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input value={buscaProfessor} onChange={e => setBuscaProfessor(e.target.value)} placeholder="Thiago Conte" className="bg-transparent w-full outline-none text-xs" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Turno</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold">
              <Clock size={16} className="text-slate-400" />
              <select value={filtroTurno} onChange={e => setFiltroTurno(e.target.value)} className="bg-transparent w-full outline-none">
                <option value="todos">Todos</option>
                <option value="MANHA">Manhã</option>
                <option value="TARDE">Tarde</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Curso</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold">
              <GraduationCap size={16} className="text-slate-400" />
              <select value={filtroCurso} onChange={e => setFiltroCurso(e.target.value)} className="bg-transparent w-full outline-none">
                <option>Eng. Software</option>
                <option>Eng. Florestal</option>
                <option>Matemática</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Turma</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold">
              <Calendar size={16} className="text-slate-400" />
              <select value={filtroTurma} onChange={e => setFiltroTurma(e.target.value)} className="bg-transparent w-full outline-none">
                <option>2024.1</option>
                <option>2024.2</option>
                <option>2023.1</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Sala</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold">
              <MapPin size={16} className="text-slate-400" />
              <select value={filtroSala} onChange={e => setFiltroSala(e.target.value)} className="bg-transparent w-full outline-none">
                <option value="todas">Todas</option>
                <option>Sala 01</option>
                <option>Sala 03</option>
                <option>LABINF</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCOS DE TURNO */}
      {(filtroTurno === 'todos' || filtroTurno === 'MANHA') && (
        <RenderTabelaTurno titulo="TURNO: MANHÃ" turnoAlvo={Shift.MANHA} />
      )}

      {(filtroTurno === 'todos' || filtroTurno === 'TARDE') && (
        <RenderTabelaTurno titulo="TURNO: TARDE" turnoAlvo={Shift.TARDE} />
      )}

    </div>
  );
}