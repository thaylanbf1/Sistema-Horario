import React from 'react'
import { useSchedule } from './ScheduleContext'
import { Edit2, Trash2, Calendar } from 'lucide-react'

const ScheduleList = ({ onEdit }) => {
    const { horarios, cursos, salas, removerHorario } = useSchedule()

    const formatarData = (dataISO) => {
        if (!dataISO) return ''
        const [ano, mes, dia] = dataISO.split('-')
        return `${dia}/${mes}`
    }

  return (
   <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
                Horários Cadastrados
            </h3>
            <div className="flex flex-col gap-4">
                {horarios.map(h => {
                    const curso = cursos.find(c => c.id === h.cursoId);
                    const sala = salas.find(s => s.id === h.salaId);
                    return (
                        <div 
                            key={h.id} 
                            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <strong className="text-gray-900">{h.disciplina}</strong>
                                    <span 
                                        className="px-2.5 py-1 rounded text-sm font-semibold"
                                        style={{
                                            backgroundColor: curso?.cor + '20',
                                            color: curso?.cor,
                                            border: `1px solid ${curso?.cor}`
                                        }}
                                    >
                                        {curso?.sigla}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span>{h.professor}</span>
                                    <span>{h.diaSemana} • {h.horarioInicio} - {h.horarioFim}</span>
                                    <span>{sala?.nome}</span>
                                    <span>Semestre: {h.semestre}</span>
                                    {h.dataInicio && h.dataFim && (
                                        <span className='flex items-center gap-1'>
                                            <Calendar size={14} />
                                            {formatarData(h.dataInicio)} até {formatarData(h.dataFim)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => onEdit(h)} 
                                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:scale-110 transition-all"
                                    title="Editar"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => removerHorario(h.id)} 
                                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 hover:scale-110 transition-all"
                                    title="Excluir"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
  )
}

export default ScheduleList