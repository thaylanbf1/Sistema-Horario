import { useState } from 'react'
import { useSchedule } from './ScheduleContext'
import Filters from '../Filtros/Filters'
import ScheduleGridBySala from './ScheduleGridBySala'
import MonthCalendar from '../Calendar/MonthCalendar'
import ExportICSModal from '../Calendar/ExportICSModal'
import { Calendar, LayoutGrid, Download } from 'lucide-react'

const ScheduleViiew = ({ readOnly }) => {
    const { cursos, salas, periodos, periodoAtivo, setPeriodoAtivo } = useSchedule()
    const [filters, setFilters]       = useState({ cursoId: '', salaId: '', diaSemana: '' })
    const [viewMode, setViewMode]     = useState('grade') // 'grade' | 'calendario'
    const [showExport, setShowExport] = useState(false)

    const periodoAtual = periodos.find(p => p.id === periodoAtivo)

    const formatarData = (dataISO) => {
        if (!dataISO) return ''
        const [, mes, dia] = dataISO.split('-')
        return `${dia}/${mes}`
    }

    return (
        <div className='bg-white rounded-lg shadow-sm p-8'>

            {/* ── Cabeçalho ── */}
            <div className='flex justify-between items-start mb-6 pb-6 border-b-2 border-gray-200'>
                <div>
                    <h2 className='text-3xl font-bold text-gray-900 mb-2'>Grade de Horários</h2>
                    <p className='text-gray-600'>
                        Visualize os horários das aulas por curso, sala ou dia da semana
                    </p>
                    {periodoAtual && (
                        <div className='flex items-center gap-2 mt-3 text-sm'>
                            <Calendar size={16} className='text-blue-600' />
                            <span className='font-semibold text-gray-600'>
                                Período: {formatarData(periodoAtual.dataInicio)} a {formatarData(periodoAtual.dataFim)}
                            </span>
                            <span className='text-gray-400'>•</span>
                            <span className='text-gray-600'>{periodoAtual.descricao}</span>
                        </div>
                    )}
                </div>

                <div className='flex flex-col sm:flex-row items-end gap-3'>
                    {/* Botão exportar .ics */}
                    <button
                        onClick={() => setShowExport(true)}
                        className='flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'
                        style={{ borderColor: '#1c1aa3', color: '#1c1aa3', background: '#1c1aa308' }}
                    >
                        <Download size={15} />
                        Exportar .ics
                    </button>

                    {/* Seletor de período */}
                    {periodos.length > 0 && (
                        <select
                            value={periodoAtivo}
                            onChange={e => setPeriodoAtivo(parseInt(e.target.value))}
                            className='px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm'
                        >
                            {periodos.map(periodo => (
                                <option value={periodo.id} key={periodo.id}>
                                    {formatarData(periodo.dataInicio)} a {formatarData(periodo.dataFim)} — {periodo.descricao}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* ── Toggle de visualização ── */}
            <div className='flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6'>
                <button
                    onClick={() => setViewMode('grade')}
                    className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200'
                    style={viewMode === 'grade'
                        ? { background: 'linear-gradient(135deg, #1c1aa3, #3730a3)', color: 'white', boxShadow: '0 2px 8px rgba(28,26,163,0.35)' }
                        : { color: '#6b7280' }
                    }
                >
                    <LayoutGrid size={15} />
                    Grade por Sala
                </button>
                <button
                    onClick={() => setViewMode('calendario')}
                    className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200'
                    style={viewMode === 'calendario'
                        ? { background: 'linear-gradient(135deg, #1c1aa3, #3730a3)', color: 'white', boxShadow: '0 2px 8px rgba(28,26,163,0.35)' }
                        : { color: '#6b7280' }
                    }
                >
                    <Calendar size={15} />
                    Calendário Mensal
                </button>
            </div>

            {/* ── View: Grade ── */}
            {viewMode === 'grade' && (
                <>
                    <div className='mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                        <h3 className='text-sm font-semibold text-gray-700 mb-3'>Legenda de Cursos:</h3>
                        <div className='flex flex-wrap gap-3'>
                            {cursos.map(curso => (
                                <div key={curso.id} className='flex items-center gap-2'>
                                    <div className='w-4 h-4 rounded' style={{ backgroundColor: curso.cor }} />
                                    <span className='text-sm text-gray-700'>{curso.sigla} — {curso.nome}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Filters filters={filters} setFilters={setFilters} cursos={cursos} salas={salas} />
                    <ScheduleGridBySala filters={filters} periodoAtivo={periodoAtivo} />
                </>
            )}

            {/* ── View: Calendário ── */}
            {viewMode === 'calendario' && (
                <MonthCalendar />
            )}

            {/* ── Modal de exportação .ics ── */}
            {showExport && (
                <ExportICSModal onClose={() => setShowExport(false)} />
            )}
        </div>
    )
}

export default ScheduleViiew
