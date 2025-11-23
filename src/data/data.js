// dados mockados

export const initialData = {
    cursos: [
        {id: 1, nome: "Engenharia de Software", sigla: 'EngSoft', cor: '#3b82f6'},
        {id: 2, nome: "Engenharia Florestal", sigla: 'EngFlor', cor: '#10b981'},
        {id: 3, nome: "Matemática", sigla: 'Mat', cor: '#f59e0b'}
    ],
    salas: [
        {id: 1, nome: 'sala 1 ', tipo:'sala'},
        {id: 2, nome: 'sala 2 ', tipo:'sala'},
        {id: 3, nome: 'sala 3 ', tipo:'sala'},
        {id: 4, nome: 'sala 4 ', tipo:'sala'},
        {id: 5, nome: 'sala 5 ', tipo:'sala'},
        {id: 6, nome: 'Lab Info ', tipo:'laboratorio'},
        {id: 7, nome: 'Lab MultiUso', tipo:'laboratorio'},
    ],

    periodos: [
        {id: 1, semestre: '2025.1', dataInicio: '2025-08-09', dataFim: '2025-10-08', descricao: 'Primeiro Bimestre'},
        {id: 2, semestre: '2025.1', dataInicio: '2025-10-09', dataFim: '2025-12-15', descricao: 'Segundo Bimestre'},
        {id: 3, semestre: '2025.2', dataInicio: '2026-02-10', dataFim: '2026-04-15', descricao: 'Terceiro Bimestre'},
    ],

   horarios: [
       // SEGUNDA - SALA 3 - Eng. Software
        {id: 1, cursoId: 1, salaId: 3, periodoId: 1, disciplina: 'Programação I', professor: 'Prof. Silva', diaSemana: 'Segunda', horarioInicio: '07:30', horarioFim: '10:00', semestre: '2025.1', dataInicio: '2025-08-09', dataFim: '2025-10-08'},
        {id: 2, cursoId: 1, salaId: 3, periodoId: 2, disciplina: 'Banco de Dados', professor: 'Prof. Costa', diaSemana: 'Segunda', horarioInicio: '10:00', horarioFim: '13:30', semestre: '2025.1', dataInicio: '2025-08-09', dataFim: '2025-10-08'},
        {id: 3, cursoId: 1, salaId: 3, periodoId: 3, disciplina: 'Eng. Software', professor: 'Prof. Mendes', diaSemana: 'Segunda', horarioInicio: '14:00', horarioFim: '16:00', semestre: '2025.1', dataInicio: '2025-08-09', dataFim: '2025-10-08'},
        
        // SEGUNDA - SALA 2 - Matemática (SIMULTÂNEO!)
        {id: 4, cursoId: 3, salaId: 2, periodoId: 2, disciplina: 'Cálculo I', professor: 'Prof. Rocha', diaSemana: 'Segunda', horarioInicio: '07:30', horarioFim: '10:00', semestre: '2025.1', dataInicio: '2025-08-09', dataFim: '2025-10-08'},
        {id: 5, cursoId: 3, salaId: 2, periodoId: 1, disciplina: 'Álgebra Linear', professor: 'Prof. Lima', diaSemana: 'Segunda', horarioInicio: '10:00', horarioFim: '13:30', semestre: '2025.1', dataInicio: '2025-08-09', dataFim: '2025-10-08'},
        
        // SEGUNDA - LAB INFO - Eng. Florestal (SIMULTÂNEO!)
        {id: 6, cursoId: 2, salaId: 6, periodoId: 3, disciplina: 'Geoprocessamento', professor: 'Prof. Souza', diaSemana: 'Segunda', horarioInicio: '07:30', horarioFim: '10:00', semestre: '2025.1', dataInicio: '2025-07-09', dataFim: '2025-07-15'},
        
        // TERÇA - SALA 3 - Eng. Software
        {id: 7, cursoId: 1, salaId: 3, periodoId: 3, disciplina: 'Algoritmos', professor: 'Prof. Santos', diaSemana: 'Terça', horarioInicio: '07:30', horarioFim: '10:00', semestre: '2025.1', dataInicio: '2025-01-09', dataFim: '2025-01-20'},
        
        // TERÇA - SALA 1 - Matemática
        {id: 8, cursoId: 3, salaId: 1, periodoId: 1, disciplina: 'Estatística', professor: 'Prof. Alves', diaSemana: 'Terça', horarioInicio: '14:00', horarioFim: '16:00', semestre: '2025.1', dataInicio: '2025-11-09', dataFim: '2025-11-25'},
        
        // QUARTA - LAB INFO - Eng. Florestal
        {id: 9, cursoId: 2, salaId: 6, periodoId: 1, disciplina: 'Sensoriamento Remoto', professor: 'Prof. Barros', diaSemana: 'Quarta', horarioInicio: '10:00', horarioFim: '13:30', semestre: '2025.1', dataInicio: '2025-08-09', dataFim: '2025-10-08'},
    ]
}

export const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export const horariosLivres = [
]