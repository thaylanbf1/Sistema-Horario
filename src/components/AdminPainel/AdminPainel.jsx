import { useState } from 'react'
import axios from 'axios'
import { useSchedule } from '../Schedule/ScheduleContext'
import {
    Plus, LayoutGrid, ClipboardList, Calendar,
    Database, CheckCircle2, XCircle, Clock,
    Building2, User, AlignLeft, ChevronDown, ChevronUp,
    Bell, Filter, Search
} from 'lucide-react'
import ScheduleForm from '../Schedule/ScheduleForm'
import ScheduleViiew from '../Schedule/ScheduleViiew'
import DataManager from './DataManager'
// ScheduleList removido — usa ScheduleViiew diretamente
import MonthCalendar from '../Calendar/MonthCalendar'

// ─── Mock de solicitações (substituir por fetch da API quando disponível) ───
const MOCK_SOLICITACOES = [
    {
        id: 1,
        solicitante: 'Ana Beatriz Silva',
        email: 'ana.silva@uepa.br',
        matricula: '2023001',
        papel: 'aluno',
        motivo: 'Palestra',
        descricao: 'Palestra de encerramento do semestre de Engenharia de Software com convidado externo.',
        sala: 'Lab 01',
        salaId: 1,
        diaSemana: 'Quarta',
        dataEvento: '18/03/2026',
        horario: '14:00 – 16:00',
        participantes: 45,
        observacoes: 'Necessário projetor e sistema de som.',
        status: 'pendente',
        criadoEm: '10/03/2026 09:14',
    },
    {
        id: 2,
        solicitante: 'Prof. Carlos Menezes',
        email: 'carlos.menezes@uepa.br',
        matricula: '789456',
        papel: 'professor',
        motivo: 'Reunião',
        descricao: 'Reunião do grupo de pesquisa GETIC para alinhamento do projeto de extensão.',
        sala: 'Sala 03',
        salaId: 3,
        diaSemana: 'Sexta',
        dataEvento: '20/03/2026',
        horario: '10:00 – 11:30',
        participantes: 12,
        observacoes: '',
        status: 'pendente',
        criadoEm: '11/03/2026 14:30',
    },
    {
        id: 3,
        solicitante: 'Marcos Oliveira',
        email: 'marcos.oliveira@uepa.br',
        matricula: '2022087',
        papel: 'aluno',
        motivo: 'Estudo em Grupo',
        descricao: 'Estudo em grupo para preparação da prova de Cálculo II.',
        sala: 'Sala 02',
        salaId: 2,
        diaSemana: 'Terça',
        dataEvento: '17/03/2026',
        horario: '08:00 – 10:00',
        participantes: 8,
        observacoes: '',
        status: 'aprovado',
        criadoEm: '09/03/2026 16:45',
    },
    {
        id: 4,
        solicitante: 'Prof. Fernanda Costa',
        email: 'fernanda.costa@uepa.br',
        matricula: '654321',
        papel: 'professor',
        motivo: 'Defesa / Apresentação',
        descricao: 'Defesa de TCC do aluno João Pedro Rodrigues — Banca avaliadora com 3 membros.',
        sala: 'Lab 02',
        salaId: 4,
        diaSemana: 'Quinta',
        dataEvento: '19/03/2026',
        horario: '09:00 – 11:00',
        participantes: 20,
        observacoes: 'Projetor obrigatório. Acesso antecipado 15 min antes.',
        status: 'recusado',
        criadoEm: '08/03/2026 11:20',
    },
]

const STATUS_STYLES = {
    pendente: { label: 'Pendente', bg: '#fef9c3', color: '#ca8a04', dot: '#eab308', border: '#fde68a' },
    aprovado: { label: 'Aprovado', bg: '#dcfce7', color: '#16a34a', dot: '#22c55e', border: '#bbf7d0' },
    recusado: { label: 'Recusado', bg: '#fee2e2', color: '#dc2626', dot: '#ef4444', border: '#fecaca' },
}

const PAPEL_STYLES = {
    aluno:     { label: 'Aluno',     bg: '#ede9fe', color: '#7c3aed' },
    professor: { label: 'Professor', bg: '#dbeafe', color: '#1d4ed8' },
}

// ─────────────────────────────────────────────────────────────────────────────

const AdminPainel = () => {
    const { adicionarHorario, atualizarHorario } = useSchedule()

    // ── Abas ──
    const [activeTab, setActiveTab] = useState('horarios')

    // ── Horários ──
    const [showForm, setShowForm]       = useState(false)
    const [horarioEdit, setHorarioEdit] = useState(null)

    // ── Solicitações ──
    const [solicitacoes, setSolicitacoes] = useState(MOCK_SOLICITACOES)
    const [filtroStatus, setFiltroStatus] = useState('todos')
    const [busca, setBusca]               = useState('')
    const [expandedId, setExpandedId]     = useState(null)
    const [motivoRecusa, setMotivoRecusa] = useState({})

    const pendentes = solicitacoes.filter(s => s.status === 'pendente').length

    // ── Handlers: Horários ──
    const handleSave = async (dados) => {
        try {
            const payload = {
                id_turma:            parseInt(dados.cursoId),
                id_sala:             parseInt(dados.salaId),
                matricula_prof:      dados.professor,
                id_disciplina:       dados.disciplina,
                dia:                 dados.diaSemana,
                hora_inicio:         dados.horarioInicio,
                hora_fim:            dados.horarioFim,
                data_inicio_bimestre: new Date(dados.dataInicio).toISOString(),
                data_fim_bimestre:    new Date(dados.dataFim).toISOString(),
            }
            if (horarioEdit) {
                await axios.patch(`http://localhost:3000/alocacoes/${horarioEdit.id}`, payload)
                atualizarHorario(horarioEdit.id, payload)
            } else {
                const res = await axios.post('http://localhost:3000/alocacoes', payload)
                adicionarHorario(res.data)
            }
            alert('Salvo com sucesso!')
            setShowForm(false)
            setHorarioEdit(null)
        } catch (err) {
            alert(`Erro: ${err.response?.data?.message || 'Erro ao conectar.'}`)
        }
    }

    const handleEdit   = (h) => { setHorarioEdit(h); setShowForm(true) }
    const handleCancel = ()  => { setShowForm(false); setHorarioEdit(null) }

    // ── Handlers: Solicitações ──
    const handleAprovar = (id) => {
        setSolicitacoes(prev =>
            prev.map(s => s.id === id ? { ...s, status: 'aprovado' } : s)
        )
        setExpandedId(null)
        // TODO: axios.patch(`/solicitacao/${id}`, { status: 'aprovado' })
    }

    const handleRecusar = (id) => {
        setSolicitacoes(prev =>
            prev.map(s => s.id === id
                ? { ...s, status: 'recusado', motivoRecusa: motivoRecusa[id] || '' }
                : s
            )
        )
        setExpandedId(null)
        setMotivoRecusa(prev => ({ ...prev, [id]: '' }))
        // TODO: axios.patch(`/solicitacao/${id}`, { status: 'recusado', motivo: motivoRecusa[id] })
    }

    // Solicitações filtradas
    const solicitacoesFiltradas = solicitacoes.filter(s => {
        if (filtroStatus !== 'todos' && s.status !== filtroStatus) return false
        if (busca && !s.solicitante.toLowerCase().includes(busca.toLowerCase()) &&
            !s.descricao.toLowerCase().includes(busca.toLowerCase()) &&
            !s.sala.toLowerCase().includes(busca.toLowerCase())) return false
        return true
    })

    // ── Tabs config ──
    const TABS = [
        { key: 'horarios',     label: 'Horários',      Icon: LayoutGrid,   badge: null     },
        { key: 'solicitacoes', label: 'Solicitações',   Icon: ClipboardList, badge: pendentes > 0 ? pendentes : null },
        { key: 'calendario',   label: 'Calendário',    Icon: Calendar,     badge: null     },
        { key: 'cadastros',    label: 'Cadastros',      Icon: Database,     badge: null     },
    ]

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* ── Header do painel ── */}
            <div className="px-8 py-6 border-b border-gray-100"
                style={{ background: 'linear-gradient(135deg, #1c1aa3 0%, #150355 100%)' }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white">Painel Administrativo</h2>
                        <p className="text-blue-200 text-sm mt-0.5">SCA UEPA — Gestão de Alocações</p>
                    </div>

                    {activeTab === 'horarios' && (
                        <button
                            onClick={() => setShowForm(true)}
                            disabled={showForm}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
                            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}
                        >
                            <Plus size={16} />
                            Novo Horário
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-6">
                    {TABS.map(({ key, label, Icon, badge }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                            style={activeTab === key
                                ? { background: 'rgba(255,255,255,0.2)', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }
                                : { color: 'rgba(255,255,255,0.55)', hover: 'rgba(255,255,255,0.1)' }
                            }
                            onMouseEnter={e => activeTab !== key && (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                            onMouseLeave={e => activeTab !== key && (e.currentTarget.style.background = 'transparent')}
                        >
                            <Icon size={15} />
                            {label}
                            {badge && (
                                <span className="ml-0.5 w-5 h-5 rounded-full bg-yellow-400 text-gray-900 text-[10px] font-black flex items-center justify-center">
                                    {badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Conteúdo das abas ── */}
            <div className="p-8">

                {/* ════ ABA: HORÁRIOS ════ */}
                {activeTab === 'horarios' && (
                    <div>
                        {showForm && (
                            <ScheduleForm
                                horarioEdit={horarioEdit}
                                onSave={handleSave}
                                onCancel={handleCancel}
                            />
                        )}
                        <ScheduleViiew />
                    </div>
                )}

                {/* ════ ABA: SOLICITAÇÕES ════ */}
                {activeTab === 'solicitacoes' && (
                    <div>
                        {/* Cabeçalho + filtros */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Solicitações de Agendamento</h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {pendentes > 0
                                        ? `${pendentes} solicitaç${pendentes > 1 ? 'ões pendentes' : 'ão pendente'} aguardando análise`
                                        : 'Nenhuma solicitação pendente'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Busca */}
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={busca}
                                        onChange={e => setBusca(e.target.value)}
                                        placeholder="Buscar..."
                                        className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 w-44 transition-all"
                                    />
                                </div>

                                {/* Filtro de status */}
                                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                                    {['todos', 'pendente', 'aprovado', 'recusado'].map(s => (
                                        <button key={s} onClick={() => setFiltroStatus(s)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150"
                                            style={filtroStatus === s
                                                ? { background: 'white', color: '#1c1aa3', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                                                : { color: '#6b7280' }
                                            }>
                                            {s === 'todos' ? 'Todos' : STATUS_STYLES[s]?.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cards de solicitações */}
                        {solicitacoesFiltradas.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="font-semibold">Nenhuma solicitação encontrada</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {solicitacoesFiltradas.map(s => {
                                    const st      = STATUS_STYLES[s.status]
                                    const papel   = PAPEL_STYLES[s.papel] || PAPEL_STYLES.aluno
                                    const aberto  = expandedId === s.id

                                    return (
                                        <div key={s.id}
                                            className="rounded-2xl border overflow-hidden transition-all duration-200"
                                            style={{ borderColor: aberto ? '#1c1aa330' : '#f0f0f0' }}>

                                            {/* Linha principal — clicável */}
                                            <button
                                                onClick={() => setExpandedId(aberto ? null : s.id)}
                                                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                {/* Barra lateral de status */}
                                                <div className="w-1 self-stretch rounded-full shrink-0"
                                                    style={{ background: st.dot }} />

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="font-black text-gray-800 text-sm">{s.solicitante}</span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                            style={{ background: papel.bg, color: papel.color }}>
                                                            {papel.label}
                                                        </span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                            style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                                                            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle"
                                                                style={{ background: st.dot }} />
                                                            {st.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate">{s.motivo} — {s.descricao}</p>
                                                    <div className="flex flex-wrap gap-3 mt-1.5 text-[11px] text-gray-400">
                                                        <span className="flex items-center gap-1"><Building2 size={10} />{s.sala}</span>
                                                        <span className="flex items-center gap-1"><Calendar size={10} />{s.diaSemana}, {s.dataEvento}</span>
                                                        <span className="flex items-center gap-1"><Clock size={10} />{s.horario}</span>
                                                        <span className="flex items-center gap-1"><User size={10} />{s.participantes} participantes</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="text-[10px] text-gray-400 hidden sm:block">{s.criadoEm}</span>
                                                    {aberto
                                                        ? <ChevronUp size={16} className="text-gray-400" />
                                                        : <ChevronDown size={16} className="text-gray-400" />
                                                    }
                                                </div>
                                            </button>

                                            {/* Painel expandido */}
                                            {aberto && (
                                                <div className="border-t border-gray-100 bg-gray-50 px-6 py-5"
                                                    style={{ animation: 'fadeInDown 0.15s ease' }}>
                                                    <div className="grid sm:grid-cols-2 gap-6 mb-5">
                                                        {/* Detalhes */}
                                                        <div className="space-y-3">
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detalhes da solicitação</p>
                                                            <InfoRow icon={<User size={13} />}      label="Solicitante" value={`${s.solicitante} — ${s.matricula}`} />
                                                            <InfoRow icon={<AlignLeft size={13} />}  label="E-mail"      value={s.email} />
                                                            <InfoRow icon={<Building2 size={13} />}  label="Sala"        value={s.sala} />
                                                            <InfoRow icon={<Calendar size={13} />}   label="Data"        value={`${s.diaSemana}, ${s.dataEvento}`} />
                                                            <InfoRow icon={<Clock size={13} />}      label="Horário"     value={s.horario} />
                                                            <InfoRow icon={<User size={13} />}       label="Participantes" value={s.participantes} />
                                                        </div>

                                                        <div className="space-y-3">
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição do evento</p>
                                                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                                                <p className="text-sm font-bold text-gray-700 mb-1">{s.motivo}</p>
                                                                <p className="text-sm text-gray-600 leading-relaxed">{s.descricao}</p>
                                                                {s.observacoes && (
                                                                    <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                                                                        📌 {s.observacoes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Ações — só para pendentes */}
                                                    {s.status === 'pendente' && (
                                                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                                            {/* Campo de motivo de recusa */}
                                                            <div className="flex-1">
                                                                <input
                                                                    value={motivoRecusa[s.id] || ''}
                                                                    onChange={e => setMotivoRecusa(prev => ({ ...prev, [s.id]: e.target.value }))}
                                                                    placeholder="Motivo da recusa (opcional)..."
                                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300/40 focus:border-red-300 transition-all"
                                                                />
                                                            </div>
                                                            <div className="flex gap-2 shrink-0">
                                                                <button onClick={() => handleRecusar(s.id)}
                                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all hover:-translate-y-0.5"
                                                                    style={{ borderColor: '#ef4444', color: '#ef4444', background: '#fef2f2' }}>
                                                                    <XCircle size={15} />
                                                                    Recusar
                                                                </button>
                                                                <button onClick={() => handleAprovar(s.id)}
                                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                                                    style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}>
                                                                    <CheckCircle2 size={15} />
                                                                    Aprovar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Feedback para aprovado/recusado */}
                                                    {s.status !== 'pendente' && (
                                                        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                                            {s.status === 'aprovado'
                                                                ? <><CheckCircle2 size={14} className="text-green-500" /><span className="text-xs text-green-600 font-semibold">Aprovada — notificação enviada ao solicitante</span></>
                                                                : <><XCircle size={14} className="text-red-400" /><span className="text-xs text-red-500 font-semibold">Recusada{s.motivoRecusa ? ` — ${s.motivoRecusa}` : ''}</span></>
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ════ ABA: CALENDÁRIO ════ */}
                {activeTab === 'calendario' && (
                    <MonthCalendar />
                )}

                {/* ════ ABA: CADASTROS ════ */}
                {activeTab === 'cadastros' && (
                    <DataManager />
                )}
            </div>

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

// Componente auxiliar de linha de info
const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400 shrink-0">{icon}</span>
        <span className="text-gray-400 text-xs w-20 shrink-0">{label}</span>
        <span className="text-gray-700 font-medium">{value}</span>
    </div>
)

export default AdminPainel
