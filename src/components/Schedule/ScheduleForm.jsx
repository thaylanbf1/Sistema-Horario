import { useState, useEffect } from 'react'
import { useSchedule } from './ScheduleContext'
import { diasSemana } from '../../data/data'; 

const ScheduleForm = ({ horarioEdit, onSave, onCancel }) => {

    const { 
        cursos, salas, periodos, professores, disciplinas, 
        adicionarPeriodo, adicionarProfessor, adicionarDisciplina, adicionarCurso, adicionarSala 
    } = useSchedule();

    const [creationMode, setCreationMode] = useState(null);

    const [formData, setFormData] = useState({
        cursoId: '', salaId: '', disciplinaId: '', professorId: '', periodoId: '',
        diaSemana: '', horarioInicio: '', horarioFim: '', dataInicio: '', dataFim: ''
    });

    const [newItemData, setNewItemData] = useState({});

    useEffect(() => {
        if (horarioEdit) {
            const periodo = periodos.find(p => p.id === horarioEdit.periodoId);
            setFormData({
                ...horarioEdit,
                cursoId: String(horarioEdit.cursoId || ''),
                salaId: String(horarioEdit.salaId || ''),
                periodoId: String(horarioEdit.periodoId || ''),
                professorId: String(horarioEdit.professor?.id || horarioEdit.professorId || ''),
                disciplinaId: String(horarioEdit.disciplina?.id || horarioEdit.disciplinaId || ''),
                dataInicio: horarioEdit.dataInicio || periodo?.dataInicio || '',
                dataFim: horarioEdit.dataFim || periodo?.dataFim || ''
            });
        }
    }, [horarioEdit, periodos]);

    const handleChange = (field, value) => {
        if (value === 'novo') {
            let mode = '';
            if (field === 'periodoId') mode = 'periodo';
            if (field === 'professorId') mode = 'professor';
            if (field === 'disciplinaId') mode = 'disciplina';
            if (field === 'cursoId') mode = 'curso';
            if (field === 'salaId') mode = 'sala';
            
            setCreationMode(mode);
            setNewItemData({});
        } else {
            setFormData({ ...formData, [field]: value });
            
            if (field === 'periodoId') {
                const p = periodos.find(item => item.id === parseInt(value));
                if (p) setFormData(prev => ({ ...prev, periodoId: value, dataInicio: p.dataInicio, dataFim: p.dataFim }));
            }
        }
    };

    const handleCreateItem = async (e) => {
        e.preventDefault();
        let newId = null;

        if (creationMode === 'periodo') {
            newId = await adicionarPeriodo({
                ...newItemData,
                dataInicio: new Date(newItemData.dataInicio).toISOString(),
                dataFim: new Date(newItemData.dataFim).toISOString()
            });
        }
        else if (creationMode === 'professor') newId = await adicionarProfessor(newItemData);
        else if (creationMode === 'disciplina') newId = await adicionarDisciplina(newItemData);
        else if (creationMode === 'curso') newId = await adicionarCurso(newItemData);
        else if (creationMode === 'sala') newId = await adicionarSala(newItemData);

        if (newId) {
            alert(`${creationMode.toUpperCase()} criado com sucesso!`);
            setFormData(prev => ({ ...prev, [creationMode + 'Id']: newId }));
            setCreationMode(null);
        }
    };

    const handleSubmitHorario = (e) => {
        e.preventDefault();
        
        try {
            if (formData.horarioInicio >= formData.horarioFim) {
                alert("⚠️ O horário de término deve ser maior que o horário de início.");
                return;
            }

            if (!formData.dataInicio || !formData.dataFim) {
                alert("Por favor, preencha as datas de início e fim.");
                return;
            }

            onSave({
                cursoId: parseInt(formData.cursoId),
                salaId: parseInt(formData.salaId),
                professorId: parseInt(formData.professorId),
                disciplinaId: parseInt(formData.disciplinaId),
                periodoId: parseInt(formData.periodoId),
                diaSemana: formData.diaSemana,
                horarioInicio: formData.horarioInicio,
                horarioFim: formData.horarioFim,
                dataInicio: new Date(formData.dataInicio).toISOString(),
                dataFim: new Date(formData.dataFim).toISOString()
            });

        } catch (error) {
            console.error("Erro ao preparar dados:", error);
            alert("Erro nos dados do formulário: " + error.message);
        }
    };

    const inputClass = "px-4 py-2.5 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none";

    if (creationMode) {
        return (
            <div className='bg-gray-50 p-8 rounded-lg mb-8 border border-green-200 shadow-sm'>
                <h3 className='text-xl font-bold text-green-800 mb-6'>
                    Novo Cadastro: {creationMode.toUpperCase()}
                </h3>
                <form onSubmit={handleCreateItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {creationMode === 'periodo' && (
                        <>
                            <input placeholder="Semestre (Ex: 2025.1)" className={inputClass} onChange={e => setNewItemData({...newItemData, semestre: e.target.value})} required />
                            <input placeholder="Descrição (Ex: 1º Bimestre)" className={inputClass} onChange={e => setNewItemData({...newItemData, descricao: e.target.value})} required />
                            <input type="date" className={inputClass} onChange={e => setNewItemData({...newItemData, dataInicio: e.target.value})} required />
                            <input type="date" className={inputClass} onChange={e => setNewItemData({...newItemData, dataFim: e.target.value})} required />
                        </>
                    )}

                    {creationMode === 'professor' && (
                        <>
                            <input placeholder="Nome" className={inputClass} onChange={e => setNewItemData({...newItemData, nomeProf: e.target.value})} required />
                            <input placeholder="Email" className={inputClass} onChange={e => setNewItemData({...newItemData, emailProf: e.target.value})} required />
                            <input placeholder="Matrícula" className={inputClass} onChange={e => setNewItemData({...newItemData, matriculaProf: e.target.value})} required />
                        </>
                    )}

                    {creationMode === 'disciplina' && (
                        <>
                            <input placeholder="Nome Disciplina" className={inputClass} onChange={e => setNewItemData({...newItemData, nomeDisciplina: e.target.value})} required />
                            <input placeholder="Código (Sigla)" className={inputClass} onChange={e => setNewItemData({...newItemData, matriculaDisciplina: e.target.value})} required />
                        </>
                    )}

                    {creationMode === 'sala' && (
                        <>
                            <input placeholder="Nome Sala (Ex: Lab 01)" className={inputClass} onChange={e => setNewItemData({...newItemData, nomeSala: e.target.value})} required />
                            <select className={inputClass} onChange={e => setNewItemData({...newItemData, tipoSala: e.target.value})} required>
                                <option value="">Selecione Tipo...</option>
                                <option value="sala">Sala de Aula</option>
                                <option value="laboratorio">Laboratório</option>
                            </select>
                        </>
                    )}

                    {creationMode === 'curso' && (
                        <>
                            <input placeholder="Nome Curso" className={inputClass} onChange={e => setNewItemData({...newItemData, nomeCurso: e.target.value})} required />
                            <input placeholder="Sigla" className={inputClass} onChange={e => setNewItemData({...newItemData, siglaCurso: e.target.value})} required />
                            
                            <div className='flex flex-col gap-2'>
                                <label className='text-sm font-semibold text-gray-700'>Cor de Identificação</label>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="color" 
                                        className="h-10 w-20 border border-gray-300 rounded cursor-pointer p-1" 
                                        onChange={e => setNewItemData({...newItemData, corCurso: e.target.value})} 
                                        defaultValue="#000000"
                                        required 
                                    />
                                    <span className="text-sm text-gray-500">Clique para escolher</span>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="col-span-full flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setCreationMode(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">Salvar {creationMode}</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmitHorario} className='bg-gray-50 p-8 rounded-lg mb-8 border border-gray-200 shadow-sm'>
            <h3 className='text-xl font-bold text-gray-900 mb-6'>{horarioEdit ? 'Editar Horário' : 'Novo Horário'}</h3>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
                
                {/* PERIODOS */}
                <div className='lg:col-span-4 flex flex-col gap-2'>
                    <label className='text-sm font-bold text-gray-700'>Período</label>
                    <select className={inputClass} value={formData.periodoId} onChange={e => handleChange('periodoId', e.target.value)} required>
                        <option value="">Selecione...</option>
                        {periodos.map(p => <option key={p.id} value={p.id}>{p.semestre} - {p.descricao}</option>)}
                        <option value="novo" className="font-bold text-blue-600">+ Criar novo período...</option>
                    </select>
                </div>

                {/* DATAS (EDITÁVEIS) */}
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-bold text-gray-700'>Data Início</label>
                    <input type="date" className={inputClass} value={formData.dataInicio} onChange={e => setFormData({...formData, dataInicio: e.target.value})} required />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-bold text-gray-700'>Data Fim</label>
                    <input type="date" className={inputClass} value={formData.dataFim} onChange={e => setFormData({...formData, dataFim: e.target.value})} required />
                </div>

                {/* DROPDOWNS COM OPÇÃO DE CRIAR */}
                {[
                    { label: 'Curso', field: 'cursoId', list: cursos, nameKey: 'nome', gender: 'o' },
                    { label: 'Sala', field: 'salaId', list: salas, nameKey: 'nome', gender: 'a' },
                    { label: 'Disciplina', field: 'disciplinaId', list: disciplinas, nameKey: 'nome', gender: 'a' },
                    { label: 'Professor', field: 'professorId', list: professores, nameKey: 'nome', gender: 'o' },
                ].map((item) => (
                    <div key={item.field} className='flex flex-col gap-2'>
                        <label className='text-sm font-bold text-gray-700'>{item.label}</label>
                        <select className={inputClass} value={formData[item.field]} onChange={e => handleChange(item.field, e.target.value)} required>
                            <option value="">Selecione...</option>
                            {item.list.map(i => <option key={i.id} value={i.id}>{i[item.nameKey]}</option>)}
                            <option value="novo" className="font-bold text-blue-600">
                                + Nov{item.gender} {item.label}
                            </option>
                        </select>
                    </div>
                ))}

                {/* DIA DA SEMANA */}
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-bold text-gray-700'>Dia</label>
                    <select className={inputClass} value={formData.diaSemana} onChange={e => setFormData({...formData, diaSemana: e.target.value})} required>
                        <option value="">Selecione...</option>
                        {diasSemana.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>


                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-bold text-gray-700'>Início</label>
                    <input 
                        type="time" 
                        className={inputClass} 
                        value={formData.horarioInicio} 
                        onChange={e => setFormData({...formData, horarioInicio: e.target.value})} 
                        required 
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='text-sm font-bold text-gray-700'>Fim</label>
                    <input 
                        type="time" 
                        className={inputClass} 
                        value={formData.horarioFim} 
                        onChange={e => setFormData({...formData, horarioFim: e.target.value})} 
                        required 
                    />
                </div>

            </div>

            <div className='flex gap-4 justify-end'>
                <button type='button' onClick={onCancel} className='px-6 py-2 border rounded-lg hover:bg-gray-50'>Cancelar</button>
                <button type='submit' className='px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700'>
                    {horarioEdit ? 'Atualizar Horário' : 'Salvar Horário'}
                </button>
            </div>
        </form>
    );
}

export default ScheduleForm