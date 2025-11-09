import { useState } from 'react'
import { useSchedule } from './ScheduleContext'
import Filters from '../Filtros/Filters';

import ScheduleGridBySala from './ScheduleGridBySala';
import { Calendar } from 'lucide-react';

const ScheduleViiew = () => {
    const {cursos, salas, periodos, periodoAtivo, setPeriodoAtivo} = useSchedule();
    const [filters, setFilters] = useState({cursoId: '', salaId: '', diaSemana: ''})


    const periodoAtual = periodos.find(p => p.id === periodoAtivo)

    const formatarData = (dataISO) => {
      if(!dataISO) return ''
      const [ano, mes, dia] = dataISO.split('-')
        return `${dia}/${mes}`
      
    }


  return (
    <div className='bg-white rounded-lg shadow-sm p-8 ' >
        <div className='flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-200'>
          <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Grade de Horários
              </h2>
              <p className='text-gray-600'>
                Visualize os horários das aulas por curso, sala ou dia da semana
              </p>
              {periodoAtual && (
                <div className='flex items-center gap-2 mt-3 text-sm'>
                  <Calendar size={16} className='text-blue-600' />
                  <span className='font-semibold text-gray-600'>
                    Periodo: {formatarData(periodoAtual.dataInicio)} a {formatarData(periodoAtual.dataFim)}
                  </span>
                  <span className='text-gray-500'>•</span>
                  <span className='text-gray-600'>{periodoAtual.descricao}</span>
                </div>
              )}
          </div>
          <div className='flex flex-col sm:flex-row gap-3'>
            {periodos.length > 0 && (
              <select value={periodoAtivo} onChange={(e) => setPeriodoAtivo(parseInt(e.target.value))} className='px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-semibold focus:outline-nome focus:ring-2 focus:ring-blue-500 cursor-pointer'>
                {periodos.map(periodo => (
                  <option value={periodo.id} key={periodo.id}> {formatarData(periodo.dataInicio)} a {formatarData(periodo.dataFim)} - {periodo.descricao}</option>
                ))}
              </select> 
            )}
          </div>
        </div>
        
        {/* Legenda de Cursos */}
        <div className='mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
          <h3 className='text-sm font-semibold text-gray-700 mb-3'>Legenda de Cursos:</h3>
          <div className='flex flex-wrap gap-3'>
            {cursos.map(curso => (
              <div key={curso.id} className='flex items-center gap-2'>
                <div 
                  className='w-4 h-4 rounded'
                  style={{backgroundColor: curso.cor}}
                />
                <span className='text-sm text-gray-700'>
                  {curso.sigla} - {curso.nome}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <Filters 
          filters={filters} 
          setFilters={setFilters} 
          cursos={cursos}
          salas={salas}
        />
          <ScheduleGridBySala filters={filters} periodoAtivo={periodoAtivo} />
      </div>
  )
}

export default ScheduleViiew
