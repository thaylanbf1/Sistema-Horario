import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ScheduleContext = createContext();

export const useSchedule = () => {
    const context = useContext(ScheduleContext);
    if (!context) throw new Error('useSchedule deve ser usado dentro de ScheduleProvider');
    return context;
};

export const ScheduleProvider = ({ children }) => {
    const [cursos, setCursos] = useState([]);
    const [salas, setSalas] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [periodoAtivo, setPeriodoAtivo] = useState(null);

    const API_URL = 'http://localhost:3000';

    const recarregarDados = async () => {
        try {
            console.log("Atualizando dados...");
            const [resCursos, resSalas, resPeriodos, resAlocacoes, resProfs, resDiscs] = await Promise.all([
                axios.get(`${API_URL}/curso/all`),
                axios.get(`${API_URL}/sala/all`),
                axios.get(`${API_URL}/periodo/all`),
                axios.get(`${API_URL}/alocacao/all`),
                axios.get(`${API_URL}/professor/all`),
                axios.get(`${API_URL}/disciplina/all`)
            ]);

            setCursos(resCursos.data.map(c => ({ id: c.idCurso, nome: c.nomeCurso, sigla: c.siglaCurso, cor: c.corCurso })));
            setSalas(resSalas.data.map(s => ({ id: s.idSala, nome: s.nomeSala, tipo: s.tipoSala })));
            setProfessores(resProfs.data.map(p => ({ id: p.id || p.idProfessor, nome: p.nomeProf, email: p.emailProf, matricula: p.matriculaProf })));
            setDisciplinas(resDiscs.data.map(d => ({ id: d.idDisciplina, nome: d.nomeDisciplina, matricula: d.matriculaDisciplina })));
            
            const periodosFmt = resPeriodos.data.map(p => ({
                id: p.idPeriodo,
                semestre: p.semestre,
                descricao: p.descricao,
                dataInicio: p.dataInicio ? p.dataInicio.split('T')[0] : '',
                dataFim: p.dataFim ? p.dataFim.split('T')[0] : ''
            }));
            setPeriodos(periodosFmt);
            
            if (periodosFmt.length > 0 && !periodoAtivo) setPeriodoAtivo(periodosFmt[0].id);

            setHorarios(resAlocacoes.data.map(aloc => ({
                id: aloc.idAlocacao,
                diaSemana: aloc.diaSemana,
                horarioInicio: aloc.horarioInicio,
                horarioFim: aloc.horarioFim,
                dataInicio: aloc.dataInicio ? aloc.dataInicio.split('T')[0] : '',
                dataFim: aloc.dataFim ? aloc.dataFim.split('T')[0] : '',
                cursoId: aloc.cursoId,
                salaId: aloc.salaId,
                periodoId: aloc.periodoId,
                disciplina: aloc.disciplina?.nomeDisciplina,
                professor: aloc.professor?.nomeProf,
                semestre: aloc.periodo?.semestre
            })));

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    };

    useEffect(() => {
        recarregarDados();
    }, []);

    const createItem = async (endpoint, data, stateSetter, formatter) => {
        try {
            const response = await axios.post(`${API_URL}${endpoint}`, data);
            const novoItem = formatter(response.data);
            stateSetter(prev => [...prev, novoItem]);
            return novoItem.id;
        } catch (error) {
            console.error(`Erro ao criar:`, error);
            alert("Erro ao salvar.");
            return null;
        }
    };

    const adicionarPeriodo = (d) => createItem('/periodo/create', d, setPeriodos, (r) => ({ id: r.idPeriodo, semestre: r.semestre, descricao: r.descricao, dataInicio: r.dataInicio.split('T')[0], dataFim: r.dataFim.split('T')[0] }));
    const adicionarProfessor = (d) => createItem('/professor/create', d, setProfessores, (r) => ({ id: r.id || r.idProfessor, nome: r.nomeProf, email: r.emailProf, matricula: r.matriculaProf }));
    const adicionarDisciplina = (d) => createItem('/disciplina/create', d, setDisciplinas, (r) => ({ id: r.idDisciplina, nome: r.nomeDisciplina, matricula: r.matriculaDisciplina }));
    const adicionarCurso = (d) => createItem('/curso/create', d, setCursos, (r) => ({ id: r.idCurso, nome: r.nomeCurso, sigla: r.siglaCurso, cor: r.corCurso }));
    const adicionarSala = (d) => createItem('/sala/create', d, setSalas, (r) => ({ id: r.idSala, nome: r.nomeSala, tipo: r.tipoSala }));

    const adicionarHorario = async (novoHorario) => {
        try {
            await axios.post(`${API_URL}/alocacao/create`, novoHorario);
            recarregarDados(); 
            alert("Horário salvo!");
        } catch (error) {
            console.error(error); alert("Erro ao salvar horário.");
        }
    };

    const atualizarHorario = async (id, dados) => {
        try {
            await axios.put(`${API_URL}/alocacao/update`, { id, ...dados });
            recarregarDados();
            alert("Horário atualizado!");
        } catch (error) { console.error(error); alert("Erro ao atualizar."); }
    }

    const removerHorario = async (id) => {
        if (!window.confirm("Tem certeza?")) return;
        try {
            await axios.delete(`${API_URL}/alocacao/delete`, { data: { id } });
            setHorarios(prev => prev.filter(h => h.id !== id));
            alert("Excluído!");
        } catch (error) { console.error(error); alert("Erro ao excluir."); }
    }

    return (
        <ScheduleContext.Provider value={{
            cursos, salas, periodos, horarios, professores, disciplinas, periodoAtivo, setPeriodoAtivo,
            adicionarHorario, atualizarHorario, removerHorario,
            adicionarPeriodo, adicionarProfessor, adicionarDisciplina, adicionarCurso, adicionarSala,
            recarregarDados 
        }}>
            {children}
        </ScheduleContext.Provider>
    );
};