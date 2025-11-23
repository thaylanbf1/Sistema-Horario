import { useState } from 'react'
import { useSchedule } from './ScheduleContext'
import { diasSemana, horariosLivres as horariosPadrao } from '../../data/data'
import { Building2 } from 'lucide-react'
import ScheduleCell from './ScheduleCell'

const ScheduleGridBySala = ({filters, periodoAtivo}) => {
    const {horarios, cursos, salas} = useSchedule()
    

    const [salasAtivas, setSalasAtivas] = useState(null)

    if (!salasAtivas && salas.length > 0) {
        setSalasAtivas(salas[0].id);
    }

    const salasFiltradas = filters.salaId ? salas.filter(s => s.id === parseInt(filters.salaId) ) : salas
    
    const salaAtual = salas.find(s => s.id === salasAtivas) || salasFiltradas[0]

    const horariosDaSala = horarios.filter(h => {
        if(salaAtual && h.salaId !== salaAtual.id) return false
        if(filters.cursoId && h.cursoId !== parseInt(filters.cursoId)) return false
        if(filters.diaSemana && h.diaSemana !== filters.diaSemana) return false
        if(periodoAtivo && h.periodoId !== periodoAtivo) return false
        return true
    })

    const horariosNoBanco = horariosDaSala.map(h => h.horarioInicio);
    
    const linhasDaGrade = [...new Set([...horariosPadrao, ...horariosNoBanco])].sort();

    const diasExibir = filters.diaSemana ? [filters.diaSemana] : diasSemana

    if (!salaAtual) return <div className="p-8 text-center text-gray-500">Carregando salas...</div>

  return (
     <div>
            {/* Abas de Salas */}
            <div className='flex gap-2 mb-6 overflow-x-auto pb-2'>
                {salasFiltradas.map(sala => (
                    <button
                        key={sala.id}
                        onClick={() => setSalasAtivas(sala.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                            salasAtivas === sala.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Building2 size={18} />
                        <div className='text-left'>
                            <div className='text-sm'>{sala.nome}</div>
                            <div className='text-xs opacity-80'>
                                {sala.tipo}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            
            {/* Info da Sala Atual */}
            <div className='mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                <div className='flex justify-between items-start gap-4'>
                    <div className='flex-1'>
                        <h3 className='font-bold text-blue-900 text-lg mb-1'>{salaAtual.nome}</h3>
                        <p className='text-sm text-blue-700'>
                            {horariosDaSala.length} horário(s) ocupado(s) nesta sala
                        </p>
                    </div>
                    <div className='text-right shrink-0'>
                        <div className='text-xs text-blue-600 font-semibold uppercase mb-1'>Tipo</div>
                        <div className='text-sm text-blue-900 capitalize font-medium'>{salaAtual.tipo}</div>
                    </div>
                </div>
            </div>
            
            {/* Grade da Sala */}
            <div className='overflow-x-auto'>
                <div className='min-w-[800px]'>
                    {/* Header */}
                    <div className='grid gap-px bg-gray-300 mb-px' 
                         style={{gridTemplateColumns: `100px repeat(${diasExibir.length}, 1fr)`}}>
                        <div className='bg-gray-900 text-white p-4 font-bold text-center'>
                            Horário
                        </div>
                        {diasExibir.map(dia => (
                            <div key={dia} className='bg-[#f00] text-white p-4 font-semibold text-center'>
                                {dia}
                            </div>
                        ))}
                    </div>

                    {/* Linhas de horários*/}
                    {linhasDaGrade.map(horario => (
                        <div key={horario} 
                             className='grid gap-px bg-gray-300 mb-px' 
                             style={{gridTemplateColumns: `100px repeat(${diasExibir.length}, 1fr)`}}>
                            
                            {/* Coluna da Hora */}
                            <div className='bg-gray-100 p-4 font-semibold text-center text-gray-900 flex items-center justify-center'>
                                {horario}
                            </div>

                            {/* Colunas dos Dias */}
                            {diasExibir.map(dia => {
                                const h = horariosDaSala.find(
                                    item => item.diaSemana === dia && item.horarioInicio === horario
                                )
                                const curso = cursos.find(c => c.id === h?.cursoId)
                                
                                return(
                                    <div key={`${dia}-${horario}`} className='bg-white min-h-[100px]'>
                                        <ScheduleCell horario={h} curso={curso} sala={salaAtual} />
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
  )
}

export default ScheduleGridBySala