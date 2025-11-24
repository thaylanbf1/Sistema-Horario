import {Clock} from 'lucide-react'

const ScheduleCell = ({horario, curso, sala}) => {
    if(!horario){
        return(
            <div className='p-4 text-center text-gray-400'>
                <span className='text-xs'>Disponivel</span>
            </div>
        );
    }
    
  return (
    <div className='p-3 h-full  flex flex-col gap-2 border-l-4 border-blue-500 hover:bg-gray-50 transition-all duration-200 hover:translate-x-1' style={{borderLeft: `4px solid ${curso?.cor || '#3b82f6'}`, backgroundColor: `${curso?.cor}10`}}>
      <div className=' flex justify-between items-start gap-2'>
        <span className=' font-bold text-gray-900 text-[14px] leading-tight'>
            {horario.disciplina}
        </span>
         <span className='w-[50px] flex items-center gap-1 text-[9px] text-gray-600 whitespace-nowrap'>
            <Clock size={14} />
            {horario.horarioInicio} - {horario.horarioFim}
         </span>
      </div>
      <div className='flex justify-between items-center text-[14px] text-gray-700'>
        <span>{horario.professor}</span>
        <span className='bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-semibold' style={{backgroundColor: curso?.cor, color: 'white'}}>
            {curso?.sigla}
        </span>
      </div>
      <div className="text-xs text-gray-600 font-semibold">
        <span className='font-semibold'>{sala?.nome}</span>
        <span className='text-gray-400'>•</span>
        <span className='text-gray-500'>{sala?.tipo}</span>
      </div>
    </div>
  )
}

export default ScheduleCell
