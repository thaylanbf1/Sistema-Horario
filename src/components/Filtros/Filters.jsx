import { diasSemana } from "../../data/data"
import { BookOpen, Calendar } from "lucide-react"

const Filters = ({filters, setFilters, cursos, salas}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BookOpen size={18} className="text-[#153d64]" />
                Curso
            </label>
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-grey-900
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all" value={filters.cursoId} onChange={(e) => setFilters({...filters, cursoId: e.target.value})}>
                <option value="">Todos os Cursos</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
        </div>

        {/* div retirada por ja existir função que a substitui */}
        {/* <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Users size={18} className="text-[#153d64]"/>
                Sala/Laboratório
            </label>
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all" value={filters.salaId} onChange={(e) => setFilters({...filters, salaId: e.target.value})}>
                <option value="">Todas as salas</option>
                {salas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
        </div> */}

        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar size={18} className="text-[#153d64]"/>
                Dia da Semana
            </label>
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all" value={filters.diaSemana} onChange={(e) => setFilters({...filters, diaSemana: e.target.value})}>
                <option value="">Todas os dias</option>
                {diasSemana.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
        </div>
    </div>
  )
}

export default Filters
