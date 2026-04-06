import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Filter, Calendar, 
  Search, X, MapPin, User, BookOpen, Clock, GraduationCap
} from 'lucide-react';

// Definição dos Turnos (Simulando o Enum Shift)
const Shift = {
  MANHA: 'MANHA',
  TARDE: 'TARDE'
};

// Horários exatos enviados por você
const SLOTS = [
  { label: "07:30-08:20", shift: Shift.MANHA },
  { label: "08:20-09:10", shift: Shift.MANHA },
  { label: "09:10-10:00", shift: Shift.MANHA },
  { label: "10:00-10:15", shift: Shift.MANHA, isBreak: true }, // Intervalo
  { label: "10:15-11:05", shift: Shift.MANHA },
  { label: "11:05-11:55", shift: Shift.MANHA },

  { label: "13:30-14:20", shift: Shift.TARDE },
  { label: "14:20-15:10", shift: Shift.TARDE },
  { label: "15:10-16:00", shift: Shift.TARDE },
  { label: "16:00-16:15", shift: Shift.TARDE, isBreak: true }, // Intervalo
  { label: "17:05-17:55", shift: Shift.TARDE },
  { label: "17:55-18:45", shift: Shift.TARDE },
];

const WEEKDAYS = [
  { key: 1, label: "Segunda" },
  { key: 2, label: "Terça" },
  { key: 3, label: "Quarta" },
  { key: 4, label: "Quinta" },
  { key: 5, label: "Sexta" },
  { key: 6, label: "Sábado" },
];

export default function MapaOcupacao() {
  // Estados para os Filtros
  const [filtroSala, setFiltroSala] = useState('todas');
  const [filtroTurno, setFiltroTurno] = useState('todos');
  const [filtroCurso, setFiltroCurso] = useState('todos');
  const [buscaProfessor, setBuscaProfessor] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // Função para renderizar as tabelas por seção
  const renderTableSection = (title, shiftKey, colorClass) => {
    // Filtra os horários pelo turno
    const sectionSlots = SLOTS.filter(s => s.shift === shiftKey);
    
    // Se o filtro de turno estiver ativo e não for este turno, não renderiza a seção
    if (filtroTurno !== 'todos' && filtroTurno !== shiftKey) return null;

    return (
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-2 h-7 rounded-full ${colorClass}`}></div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
          <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg border border-slate-200">
            {sectionSlots.length} Slots
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase w-32">Horário</th>
                  {WEEKDAYS.map(day => (
                    <th key={day.key} className="p-4 border-l border-slate-100 text-center">
                      <span className="text-sm font-bold text-slate-700">{day.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sectionSlots.map((slot, index) => (
                  <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                    <td className={`p-4 text-xs font-bold border-r border-slate-50 ${slot.isBreak ? 'bg-amber-50/50 text-amber-600' : 'text-slate-500'}`}>
                      {slot.label}
                    </td>
                    {WEEKDAYS.map(day => (
                      <td key={day.key} className={`p-2 border-l border-slate-50 relative ${slot.isBreak ? 'bg-amber-50/20' : ''}`}>
                        {slot.isBreak ? (
                          <div className="h-10 flex items-center justify-center">
                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.2em]">Intervalo</span>
                          </div>
                        ) : (
                          // Exemplo de Card de Aula com Filtro de Curso (Fictício para visualização)
                          <div className="min-h-[85px] p-3 rounded-xl border border-blue-100 bg-blue-50/40 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group">
                             <div className="text-[10px] font-black text-blue-900 leading-tight uppercase mb-1">Eng. Software</div>
                             <div className="text-[11px] text-blue-700 font-medium line-clamp-1 italic group-hover:text-blue-900">Dr. Thiago Conte</div>
                             <div className="mt-2 flex items-center justify-between">
                                <span className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded border border-blue-100 text-blue-600">Sala 01</span>
                             </div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* BARRA DE FILTROS SUPERIOR */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          
          {/* Busca Professor */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar professor..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              value={buscaProfessor}
              onChange={(e) => setBuscaProfessor(e.target.value)}
            />
          </div>

          {/* Filtro Turno */}
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            <select 
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none"
              value={filtroTurno}
              onChange={(e) => setFiltroTurno(e.target.value)}
            >
              <option value="todos">Todos os Turnos</option>
              <option value={Shift.MANHA}>Manhã</option>
              <option value={Shift.TARDE}>Tarde</option>
            </select>
          </div>

          {/* Filtro Sala */}
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            <select 
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none"
              value={filtroSala}
              onChange={(e) => setFiltroSala(e.target.value)}
            >
              <option value="todas">Todas as Salas</option>
              <option value="sala01">Sala 01</option>
              <option value="sala02">Sala 02</option>
              <option value="lab01">Laboratório 01</option>
            </select>
          </div>

          {/* Filtro Curso */}
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-slate-400" />
            <select 
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none"
              value={filtroCurso}
              onChange={(e) => setFiltroCurso(e.target.value)}
            >
              <option value="todos">Todos os Cursos</option>
              <option value="soft">Eng. Software</option>
              <option value="flor">Eng. Florestal</option>
              <option value="mat">Matemática</option>
            </select>
          </div>

          <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">GRADE ACADÊMICA</h1>
            <p className="text-slate-500">Visualização semanal por turmas e salas.</p>
        </div>

        {/* Renderiza Turno da Manhã */}
        {renderTableSection("Turno da Manhã", Shift.MANHA, "bg-sky-500")}

        {/* Renderiza Turno da Tarde */}
        {renderTableSection("Turno da Tarde", Shift.TARDE, "bg-orange-500")}
      </div>
    </div>
  );
}