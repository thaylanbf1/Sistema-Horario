import { useState } from 'react'
import { useSchedule } from '../Schedule/ScheduleContext'
import { Plus } from 'lucide-react'
import ScheduleForm from '../Schedule/ScheduleForm'
import ScheduleList from '../Schedule/ScheduleList'
import DataManager from './DataManager'; 

const AdminPainel = () => {
    const { adicionarHorario, atualizarHorario, removerHorario } = useSchedule()
    
    const [showForm, setShowForm] = useState(false)
    const [horarioEdit, setHorarioEdit] = useState(null)

    const handleSave = (horario) => {
        if(horarioEdit){
            atualizarHorario(horarioEdit.id, horario)
        } else {
            adicionarHorario(horario)
import axios from 'axios' 

const AdminPainel = () => {
    const { adcionarHorario, atualizarHorario } = useSchedule()
    const [showForm, setShowForm] = useState(false)
    const [horarioEdit, setHorarioEdit] = useState(null)

const handleSave = async (dadosDoFormulario) => {
        console.log("Dados vindos do formulário:", dadosDoFormulario);

        try {
            const payload = {
                id_turma: parseInt(dadosDoFormulario.cursoId), 
                id_sala: parseInt(dadosDoFormulario.salaId),   
                matricula_prof: dadosDoFormulario.professor,   
                id_disciplina: dadosDoFormulario.disciplina,   
                
                dia: dadosDoFormulario.diaSemana,              
                hora_inicio: dadosDoFormulario.horarioInicio,  
                hora_fim: dadosDoFormulario.horarioFim,        
                
                data_inicio_bimestre: new Date(dadosDoFormulario.dataInicio).toISOString(),
                data_fim_bimestre: new Date(dadosDoFormulario.dataFim).toISOString()
            };

            // ENVIAR PARA O BACKEND
            if (horarioEdit) {
                await axios.patch(`http://localhost:3000/alocacoes/${horarioEdit.id}`, payload);
                atualizarHorario(horarioEdit.id, payload); 
            } else {
                const resposta = await axios.post('http://localhost:3000/alocacoes', payload);
                adcionarHorario(resposta.data); 
            }

            alert("Salvo com sucesso!");
            setShowForm(false);
            setHorarioEdit(null);

        } catch (error) {
            console.error("Erro ao salvar:", error);
            const mensagemErro = error.response?.data?.message || "Erro ao conectar com o servidor.";
            alert(`Erro: ${mensagemErro}`);
        }
    }

    const handleEdit = (horario) => {
        setHorarioEdit(horario)
        setShowForm(true)
    }

    const handleCancel = () => {
        setShowForm(false)
        setHorarioEdit(null)
    }

  return (
    <div className='rounded-lg shadow-sm p-8'>
      <div className='flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-200'>
        <div>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Painel Administrativo</h2>
        </div>

        <button 
            onClick={() => setShowForm(true)} 
            className='flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-700 hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50' 
            disabled={showForm}
        >
            <Plus size={20} /> 
            Novo Horario
        </button>
      </div>

    return (
        <div className=' rounded-lg shadow-smp-8'>
            <div className='flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-200'>
                <div>
                    <h2 className='text-3xl font-bold text-gray-900 mb-2'>Painel Administrativo</h2>
                </div>

                <button onClick={() => setShowForm(true)} className='flex items-center gap-2 px-6 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-700 hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0' disabled={showForm}>
                    <Plus size={20} />
                    Novo Horario
                </button>
            </div>

      <ScheduleList onEdit={handleEdit} />
      <DataManager />  
    </div>
  )
            {showForm && (
                <ScheduleForm horarioEdit={horarioEdit} onSave={handleSave} onCancel={handleCancel} />
            )}

            <ScheduleList onEdit={handleEdit} />
        </div>
    )
}

export default AdminPainel