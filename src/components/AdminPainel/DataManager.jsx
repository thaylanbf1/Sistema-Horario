import { useState } from 'react';
import { useSchedule } from '../Schedule/ScheduleContext';
import { Edit2, Trash2, X } from 'lucide-react'; 
import axios from 'axios';

const DataManager = () => {
    const { 
        professores, disciplinas, cursos, salas, periodos, 
        recarregarDados 
    } = useSchedule();

    const [activeTab, setActiveTab] = useState('professores');
    const [editingItem, setEditingItem] = useState(null);

    const API_URL = 'http://localhost:3000';

    const config = {
        professores: { 
            title: 'Professores', endpoint: 'professor', list: professores, labelKey: 'nome',
            fields: { nome: 'nomeProf', email: 'emailProf', matricula: 'matriculaProf' } 
        },
        disciplinas: { 
            title: 'Disciplinas', endpoint: 'disciplina', list: disciplinas, labelKey: 'nome',
            fields: { nome: 'nomeDisciplina', matricula: 'matriculaDisciplina' }
        },
        cursos: { 
            title: 'Cursos', endpoint: 'curso', list: cursos, labelKey: 'nome',
            fields: { nome: 'nomeCurso', sigla: 'siglaCurso', cor: 'corCurso' }
        },
        salas: { 
            title: 'Salas', endpoint: 'sala', list: salas, labelKey: 'nome',
            fields: { nome: 'nomeSala', tipo: 'tipoSala' }
        },
        periodos: { 
            title: 'Períodos', endpoint: 'periodo', list: periodos, labelKey: 'descricao',
            fields: { semestre: 'semestre', descricao: 'descricao' } 
        },
    };

    const currentConfig = config[activeTab];

    const handleDelete = async (id) => {
        if (!window.confirm(`Tem certeza que deseja excluir?`)) return;
        try {
            await axios.delete(`${API_URL}/${currentConfig.endpoint}/delete`, { data: { id } });
            alert("Excluído com sucesso!");
            recarregarDados();
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir. Verifique se este item não está sendo usado em um horário.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = { id: editingItem.id };
            
            Object.keys(currentConfig.fields).forEach(frontKey => {
                const backKey = currentConfig.fields[frontKey];
                if (editingItem[frontKey] !== undefined) {
                    payload[backKey] = editingItem[frontKey];
                }
            });

            await axios.put(`${API_URL}/${currentConfig.endpoint}/update`, payload);
            
            alert("Atualizado com sucesso!");
            setEditingItem(null);
            recarregarDados();

        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar.");
        }
    };

    const renderEditInputs = () => {
        if (!editingItem) return null;
        
        return Object.keys(currentConfig.fields).map(frontKey => {
            const isColor = frontKey.toLowerCase().includes('cor');

            return (
                <div key={frontKey} className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 capitalize mb-1">
                        {frontKey}
                    </label>
                    
                    {isColor ? (
                        <div className="flex items-center gap-3 border p-2 rounded-lg">
                            <input 
                                type="color" 
                                className="h-10 w-16 border-none cursor-pointer bg-transparent" 
                                value={editingItem[frontKey] || '#000000'}
                                onChange={e => setEditingItem({ ...editingItem, [frontKey]: e.target.value })}
                            />
                            <span className="text-gray-500 text-sm font-mono">
                                {editingItem[frontKey]}
                            </span>
                        </div>
                    ) : (
                        <input 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={editingItem[frontKey] || ''}
                            onChange={e => setEditingItem({ ...editingItem, [frontKey]: e.target.value })}
                        />
                    )}
                </div>
            );
        });
    };

    return (
        <div className="mt-10 bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Gerenciar Cadastros</h3>
            
            <div className="flex gap-2 mb-4 border-b pb-2 overflow-x-auto">
                {Object.keys(config).map(key => (
                    <button 
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === key ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        {config[key].title}
                    </button>
                ))}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {currentConfig.list.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                        <div className="flex items-center gap-3">
                            {item.cor && (
                                <div 
                                    className="w-4 h-4 rounded-full shadow-sm" 
                                    style={{ backgroundColor: item.cor }} 
                                />
                            )}
                            <span className="font-medium text-gray-700">
                                {item[currentConfig.labelKey] || item.semestre || 'Sem Nome'}
                            </span>
                        </div>
                        
                        <div className="flex gap-2">
                            <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-all">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-full transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-100 scale-100 transition-transform">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Editar {currentConfig.title.slice(0, -1)}</h3>
                            <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdate}>
                            {renderEditInputs()}
                            
                            <div className="flex justify-end gap-3 mt-8">
                                <button 
                                    type="button" 
                                    onClick={() => setEditingItem(null)} 
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                                >
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataManager;