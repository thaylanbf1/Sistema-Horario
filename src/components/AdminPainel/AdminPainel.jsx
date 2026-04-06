import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSchedule } from '../Schedule/ScheduleContext'
import {
    Plus, LayoutGrid, ClipboardList, Calendar, Database,
    CheckCircle2, XCircle, Clock, Building2, User, Users,
    AlignLeft, ChevronDown, ChevronUp, GraduationCap, BookOpen,
    Bell, Filter, Search, FileSpreadsheet
} from 'lucide-react'
import ScheduleForm from '../Schedule/ScheduleForm'
import ScheduleViiew from '../Schedule/ScheduleViiew'
import DataManager from './DataManager'
import MonthCalendar from '../Calendar/MonthCalendar'
import ImportarPlanilha from './ImportarPlanilha'
import MapaOcupacao from '../MapaOcupacao/MapaOcupacao'

const STATUS_STYLES = {
    pendente: { label: 'Pendente', bg: '#fef9c3', color: '#ca8a04', dot: '#eab308', border: '#fde68a' },
    aprovado: { label: 'Aprovado', bg: '#dcfce7', color: '#16a34a', dot: '#22c55e', border: '#bbf7d0' },
    recusado: { label: 'Recusado', bg: '#fee2e2', color: '#dc2626', dot: '#ef4444', border: '#fecaca' },
}

const PAPEL_STYLES = {
    aluno:     { label: 'Aluno',     bg: '#ede9fe', color: '#7c3aed' },
    professor: { label: 'Professor', bg: '#dbeafe', color: '#1d4ed8' },
}

const AdminPainel = () => {
    const { adicionarHorario, atualizarHorario } = useSchedule()

    const [activeTab, setActiveTab]     = useState('horarios')
    const [showForm, setShowForm]       = useState(false)
    const [horarioEdit, setHorarioEdit] = useState(null)
    const [showImport, setShowImport]   = useState(false)

    // ── Solicitações ──
    const [solicitacoes, setSolicitacoes] = useState([])
    const [loadingSols, setLoadingSols]   = useState(true)
    const [filtroStatus, setFiltroStatus] = useState('todos')
    const [busca, setBusca]               = useState('')
    const [expandedId, setExpandedId]     = useState(null)
    const [motivoRecusa, setMotivoRecusa] = useState({})

    const carregarSolicitacoes = async () => {
        setLoadingSols(true)
        try {
            const res = await axios.get('http://localhost:3000/solicitacao/all')
            setSolicitacoes(res.data.map(s => ({
                id:           s.idSolicitacao,
                solicitante:  s.solicitante,
                email:        s.email,
                matricula:    s.matricula,
                papel:        s.papel,
                motivo:       s.motivo,
                descricao:    s.descricao,
                sala:         s.sala?.nomeSala || '',
                salaId:       s.salaId,
                diaSemana:    s.diaSemana,
                dataEvento:   s.dataEvento || '',
                horario:      `${s.horarioInicio} – ${s.horarioFim}`,
                participantes: s.participantes,
                observacoes:  s.observacoes || '',
                status:       s.status,
                motivoRecusa: s.motivoRecusa || '',
                criadoEm:     new Date(s.criadoEm).toLocaleString('pt-BR'),
            })))
        } catch (err) {
            console.error('Erro ao carregar solicitações:', err)
        } finally {
            setLoadingSols(false)
        }
    }

    useEffect(() => { carregarSolicitacoes() }, [])

    // ── Usuários ──
    const [usuarios, setUsuarios] = useState([])

    const carregarUsuarios = async () => {
        try {
            const res = await axios.get('http://localhost:3000/usuario/all')
            setUsuarios(res.data)
        } catch (err) {
            console.error('Erro ao carregar usuários:', err)
        }
    }

    useEffect(() => { carregarUsuarios() }, [])

    const handleAprovarUsuario = async (id) => {
        try {
            await axios.patch(`http://localhost:3000/usuario/aprovar/${id}`)
            setUsuarios(prev => prev.map(u => u.idUsuario === id ? { ...u, status: 'aprovado' } : u))
        } catch (err) { alert(err.response?.data?.message || 'Erro ao aprovar.') }
    }

    const handleRecusarUsuario = async (id) => {
        try {
            await axios.patch(`http://localhost:3000/usuario/recusar/${id}`)
            setUsuarios(prev => prev.map(u => u.idUsuario === id ? { ...u, status: 'recusado' } : u))
        } catch (err) { alert(err.response?.data?.message || 'Erro ao recusar.') }
    }

    const handleDeletarUsuario = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return
        try {
            await axios.delete(`http://localhost:3000/usuario/delete/${id}`)
            setUsuarios(prev => prev.filter(u => u.idUsuario !== id))
        } catch (err) { alert('Erro ao excluir usuário.') }
    }

    const pendentesUsuarios = usuarios.filter(u => u.status === 'pendente').length
    const pendentes = solicitacoes.filter(s => s.status === 'pendente').length

    // ── Handlers Horários ──
    const handleSave = async (dados) => {
        try {
            if (horarioEdit) { await atualizarHorario(horarioEdit.id, dados) }
            else             { await adicionarHorario(dados) }
            setShowForm(false)
            setHorarioEdit(null)
        } catch (err) {
            alert(`Erro: ${err.response?.data?.message || err.message || 'Erro ao conectar.'}`)
        }
    }

    const handleEdit   = (h) => { setHorarioEdit(h); setShowForm(true) }
    const handleCancel = ()  => { setShowForm(false); setHorarioEdit(null) }

    const handleGoToCadastros = (tab) => {
        sessionStorage.setItem('cadastrosTab', tab)
        setShowForm(false)
        setActiveTab('cadastros')
    }

    const handleReturnToHorarios = () => {
        setActiveTab('horarios')
        setShowForm(true)
        setHorarioEdit(null)
    }

    // ── Handlers Solicitações ──
    const handleAprovar = async (id) => {
        try {
            await axios.patch(`http://localhost:3000/solicitacao/aprovar/${id}`)
            setSolicitacoes(prev => prev.map(s => s.id === id ? { ...s, status: 'aprovado' } : s))
            setExpandedId(null)
        } catch (err) { alert(err.response?.data?.message || 'Erro ao aprovar solicitação.') }
    }

    const handleRecusar = async (id) => {
        try {
            await axios.patch(`http://localhost:3000/solicitacao/recusar/${id}`, {
                motivoRecusa: motivoRecusa[id] || ''
            })
            setSolicitacoes(prev => prev.map(s => s.id === id
                ? { ...s, status: 'recusado', motivoRecusa: motivoRecusa[id] || '' } : s
            ))
            setExpandedId(null)
            setMotivoRecusa(prev => ({ ...prev, [id]: '' }))
        } catch (err) { alert(err.response?.data?.message || 'Erro ao recusar solicitação.') }
    }

    const solicitacoesFiltradas = solicitacoes.filter(s => {
        if (filtroStatus !== 'todos' && s.status !== filtroStatus) return false
        if (busca && !s.solicitante.toLowerCase().includes(busca.toLowerCase()) &&
            !s.descricao.toLowerCase().includes(busca.toLowerCase()) &&
            !s.sala.toLowerCase().includes(busca.toLowerCase())) return false
        return true
    })

    const TABS = [
        { key: 'horarios',     label: 'Horários',     Icon: LayoutGrid,    badge: null },
        { key: 'solicitacoes', label: 'Solicitações',  Icon: ClipboardList, badge: pendentes > 0 ? pendentes : null },
        { key: 'calendario',   label: 'Calendário',   Icon: Calendar,      badge: null },
        { key: 'mapa',         label: 'Grade',          Icon: Calendar,      badge: null },
        { key: 'cadastros',    label: 'Cadastros',    Icon: Database,      badge: null },
        { key: 'usuarios',     label: 'Usuários',     Icon: Users,         badge: pendentesUsuarios > 0 ? pendentesUsuarios : null },
    ]

    // ── Render de usuário ──
    const UsuarioCard = ({ u, showAprovar, showDesativar, showReativar }) => {
        const PapelIcon = u.papel === 'professor' ? BookOpen : GraduationCap
        const papelCfg  = u.papel === 'professor'
            ? { label: 'Professor', bg: '#dbeafe', color: '#1d4ed8' }
            : { label: 'Aluno',     bg: '#ede9fe', color: '#7c3aed' }
        return (
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: u.status === 'recusado' ? '#f3f4f6' : papelCfg.bg }}>
                        <PapelIcon size={16} style={{ color: u.status === 'recusado' ? '#9ca3af' : papelCfg.color }} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-800 text-sm">{u.nome}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                                style={u.status === 'recusado'
                                    ? { background: '#f3f4f6', color: '#9ca3af' }
                                    : { background: papelCfg.bg, color: papelCfg.color }}>
                                <PapelIcon size={10} />
                                {papelCfg.label}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">@{u.username} · {u.email}</p>
                        {u.telefone  && <p className="text-xs text-gray-400 mt-0.5">{u.telefone}</p>}
                        {u.matricula && <p className="text-xs text-gray-400 mt-0.5">Matrícula: {u.matricula} · Curso: {u.curso}</p>}
                        {u.siape     && <p className="text-xs text-gray-400 mt-0.5">SIAPE: {u.siape} · Depto: {u.departamento}</p>}
                    </div>
                </div>
                <div className={showAprovar ? "flex gap-2 shrink-0 ml-4" : "flex gap-2 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity"}>
                    {showAprovar && (
                        <>
                            <button onClick={() => handleRecusarUsuario(u.idUsuario)}
                                className="px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all hover:-translate-y-0.5"
                                style={{ borderColor: '#ef4444', color: '#ef4444', background: '#fef2f2' }}>
                                Recusar
                            </button>
                            <button onClick={() => handleAprovarUsuario(u.idUsuario)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}>
                                Aprovar
                            </button>
                        </>
                    )}
                    {showDesativar && (
                        <button onClick={() => handleRecusarUsuario(u.idUsuario)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                            style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
                            Desativar
                        </button>
                    )}
                    {showReativar && (
                        <button onClick={() => handleAprovarUsuario(u.idUsuario)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                            style={{ borderColor: '#16a34a', color: '#16a34a', background: '#f0fdf4' }}>
                            Ativar
                        </button>
                    )}
                    {!showAprovar && (
                        <button onClick={() => handleDeletarUsuario(u.idUsuario)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            style={{ background: '#fee2e2', color: '#dc2626' }}>
                            <XCircle size={13} />
                            Excluir
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100"
                style={{ background: 'linear-gradient(135deg, #1c1aa3 0%, #150355 100%)' }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white">Painel Administrativo</h2>
                        <p className="text-blue-200 text-sm mt-0.5">SCA UEPA — Gestão de Alocações</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowImport(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}>
                            <FileSpreadsheet size={16} />
                                Relatórios
                        </button>
                        {activeTab === 'horarios' && (
                            <button onClick={() => setShowForm(true)} disabled={showForm}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 hover:-translate-y-0.5"
                                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}>
                                <Plus size={16} />
                                Novo Horário
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex gap-1 mt-6 overflow-x-auto">
                    {TABS.map(({ key, label, Icon, badge }) => (
                        <button key={key} onClick={() => setActiveTab(key)}
                            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
                            style={activeTab === key
                                ? { background: 'rgba(255,255,255,0.2)', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }
                                : { color: 'rgba(255,255,255,0.55)' }}
                            onMouseEnter={e => activeTab !== key && (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                            onMouseLeave={e => activeTab !== key && (e.currentTarget.style.background = 'transparent')}>
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

            {/* Conteúdo */}
            <div className="p-8">
            {/* ════ MAPA DE OCUPAÇÃO ════ */}
    {activeTab === 'mapa' && (
        <MapaOcupacao />
    )}

                {/* ════ HORÁRIOS ════ */}
                {activeTab === 'horarios' && (
                    <div>
                        {showForm && (
                            <ScheduleForm
                                horarioEdit={horarioEdit}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onGoToCadastros={handleGoToCadastros}
                                restoreDraft={!horarioEdit}
                            />
                        )}
                        <ScheduleViiew isAdmin={true} />
                    </div>
                )}

                {/* ════ SOLICITAÇÕES ════ */}
                {activeTab === 'solicitacoes' && (
                    <div>
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
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input value={busca} onChange={e => setBusca(e.target.value)}
                                        placeholder="Buscar..."
                                        className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30 w-44 transition-all" />
                                </div>
                                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                                    {['todos', 'pendente', 'aprovado', 'recusado'].map(s => (
                                        <button key={s} onClick={() => setFiltroStatus(s)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                                            style={filtroStatus === s
                                                ? { background: 'white', color: '#1c1aa3', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                                                : { color: '#6b7280' }}>
                                            {s === 'todos' ? 'Todos' : STATUS_STYLES[s]?.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {solicitacoesFiltradas.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="font-semibold">Nenhuma solicitação encontrada</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {solicitacoesFiltradas.map(s => {
                                    const st    = STATUS_STYLES[s.status]
                                    const papel = PAPEL_STYLES[s.papel] || PAPEL_STYLES.aluno
                                    const aberto = expandedId === s.id
                                    return (
                                        <div key={s.id} className="rounded-2xl border overflow-hidden transition-all"
                                            style={{ borderColor: aberto ? '#1c1aa330' : '#f0f0f0' }}>
                                            <button onClick={() => setExpandedId(aberto ? null : s.id)}
                                                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors">
                                                <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: st.dot }} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="font-black text-gray-800 text-sm">{s.solicitante}</span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                            style={{ background: papel.bg, color: papel.color }}>
                                                            {papel.label}
                                                        </span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                            style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                                                            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle" style={{ background: st.dot }} />
                                                            {st.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate">{s.motivo} — {s.descricao}</p>
                                                    <div className="flex flex-wrap gap-3 mt-1.5 text-[11px] text-gray-400">
                                                        <span className="flex items-center gap-1"><Building2 size={10} />{s.sala}</span>
                                                        <span className="flex items-center gap-1"><Calendar size={10} />{s.diaSemana}{s.dataEvento ? `, ${s.dataEvento}` : ''}</span>
                                                        <span className="flex items-center gap-1"><Clock size={10} />{s.horario}</span>
                                                        <span className="flex items-center gap-1"><User size={10} />{s.participantes} participantes</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="text-[10px] text-gray-400 hidden sm:block">{s.criadoEm}</span>
                                                    {aberto ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                                </div>
                                            </button>

                                            {aberto && (
                                                <div className="border-t border-gray-100 bg-gray-50 px-6 py-5"
                                                    style={{ animation: 'fadeInDown 0.15s ease' }}>
                                                    <div className="grid sm:grid-cols-2 gap-6 mb-5">
                                                        <div className="space-y-3">
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detalhes da solicitação</p>
                                                            <InfoRow icon={<User size={13} />}     label="Solicitante" value={`${s.solicitante} — ${s.matricula}`} />
                                                            <InfoRow icon={<AlignLeft size={13} />} label="E-mail"      value={s.email} />
                                                            <InfoRow icon={<Building2 size={13} />} label="Sala"        value={s.sala} />
                                                            <InfoRow icon={<Calendar size={13} />}  label="Data"        value={`${s.diaSemana}${s.dataEvento ? `, ${s.dataEvento}` : ''}`} />
                                                            <InfoRow icon={<Clock size={13} />}     label="Horário"     value={s.horario} />
                                                            <InfoRow icon={<User size={13} />}      label="Participantes" value={s.participantes} />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descrição do evento</p>
                                                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                                                <p className="text-sm font-bold text-gray-700 mb-1">{s.motivo}</p>
                                                                <p className="text-sm text-gray-600 leading-relaxed">{s.descricao}</p>
                                                                {s.observacoes && (
                                                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Observações</p>
                                                                        <p className="text-sm text-gray-600 leading-relaxed">{s.observacoes}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {s.status === 'pendente' && (
                                                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                                            <div className="flex-1">
                                                                <input value={motivoRecusa[s.id] || ''}
                                                                    onChange={e => setMotivoRecusa(prev => ({ ...prev, [s.id]: e.target.value }))}
                                                                    placeholder="Motivo da recusa (opcional)..."
                                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300/40 transition-all" />
                                                            </div>
                                                            <div className="flex gap-2 shrink-0">
                                                                <button onClick={() => handleRecusar(s.id)}
                                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all hover:-translate-y-0.5"
                                                                    style={{ borderColor: '#ef4444', color: '#ef4444', background: '#fef2f2' }}>
                                                                    <XCircle size={15} />
                                                                    Recusar
                                                                </button>
                                                                <button onClick={() => handleAprovar(s.id)}
                                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                                                                    style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}>
                                                                    <CheckCircle2 size={15} />
                                                                    Aprovar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

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

                {/* ════ CALENDÁRIO ════ */}
                {activeTab === 'calendario' && <MonthCalendar />}

                {/* ════ CADASTROS ════ */}
                {activeTab === 'cadastros' && (
                    <DataManager onReturnToHorarios={handleReturnToHorarios} />
                )}

                {/* ════ USUÁRIOS ════ */}
                {activeTab === 'usuarios' && (
                    <div>
                        <div className="mb-6">
                            <h3 className="text-xl font-black text-gray-900">Gerenciar Usuários</h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {pendentesUsuarios > 0 ? `${pendentesUsuarios} usuário(s) aguardando aprovação` : 'Nenhuma aprovação pendente'}
                            </p>
                        </div>

                        {/* Pendentes */}
                        {usuarios.filter(u => u.status === 'pendente').length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                    <h4 className="text-sm font-bold text-gray-600">
                                        Aguardando Aprovação ({usuarios.filter(u => u.status === 'pendente').length})
                                    </h4>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {usuarios.filter(u => u.status === 'pendente').map(u => {
                                        const PapelIcon = u.papel === 'professor' ? BookOpen : GraduationCap
                                        const papelCfg  = u.papel === 'professor'
                                            ? { label: 'Professor', bg: '#dbeafe', color: '#1d4ed8' }
                                            : { label: 'Aluno',     bg: '#ede9fe', color: '#7c3aed' }
                                        return (
                                            <div key={u.idUsuario}
                                                className="flex items-center justify-between p-4 bg-white rounded-xl border border-yellow-100 shadow-sm">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: papelCfg.bg }}>
                                                        <PapelIcon size={16} style={{ color: papelCfg.color }} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-bold text-gray-800 text-sm">{u.nome}</span>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                                                                style={{ background: papelCfg.bg, color: papelCfg.color }}>
                                                                <PapelIcon size={10} />{papelCfg.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500">@{u.username} · {u.email}</p>
                                                        {u.telefone  && <p className="text-xs text-gray-400 mt-0.5">{u.telefone}</p>}
                                                        {u.matricula && <p className="text-xs text-gray-400 mt-0.5">Matrícula: {u.matricula} · Curso: {u.curso}</p>}
                                                        {u.siape     && <p className="text-xs text-gray-400 mt-0.5">SIAPE: {u.siape} · Depto: {u.departamento}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 shrink-0 ml-4">
                                                    <button onClick={() => handleRecusarUsuario(u.idUsuario)}
                                                        className="px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all hover:-translate-y-0.5"
                                                        style={{ borderColor: '#ef4444', color: '#ef4444', background: '#fef2f2' }}>
                                                        Recusar
                                                    </button>
                                                    <button onClick={() => handleAprovarUsuario(u.idUsuario)}
                                                        className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:-translate-y-0.5"
                                                        style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}>
                                                        Aprovar
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Ativos */}
                        {usuarios.filter(u => u.status === 'aprovado').length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-2 h-2 rounded-full bg-green-400" />
                                    <h4 className="text-sm font-bold text-gray-600">
                                        Usuários Ativos ({usuarios.filter(u => u.status === 'aprovado').length})
                                    </h4>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {usuarios.filter(u => u.status === 'aprovado').map(u => {
                                        const PapelIcon = u.papel === 'professor' ? BookOpen : GraduationCap
                                        const papelCfg  = u.papel === 'professor'
                                            ? { label: 'Professor', bg: '#dbeafe', color: '#1d4ed8' }
                                            : { label: 'Aluno',     bg: '#ede9fe', color: '#7c3aed' }
                                        return (
                                            <div key={u.idUsuario}
                                                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all group">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: papelCfg.bg }}>
                                                        <PapelIcon size={16} style={{ color: papelCfg.color }} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-bold text-gray-800 text-sm">{u.nome}</span>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                                                                style={{ background: papelCfg.bg, color: papelCfg.color }}>
                                                                <PapelIcon size={10} />{papelCfg.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500">@{u.username} · {u.email}</p>
                                                        {u.telefone  && <p className="text-xs text-gray-400 mt-0.5">{u.telefone}</p>}
                                                        {u.matricula && <p className="text-xs text-gray-400 mt-0.5">Matrícula: {u.matricula} · Curso: {u.curso}</p>}
                                                        {u.siape     && <p className="text-xs text-gray-400 mt-0.5">SIAPE: {u.siape} · Depto: {u.departamento}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleRecusarUsuario(u.idUsuario)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                                                        style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
                                                        Desativar
                                                    </button>
                                                    <button onClick={() => handleDeletarUsuario(u.idUsuario)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                        style={{ background: '#fee2e2', color: '#dc2626' }}>
                                                        <XCircle size={13} /> Excluir
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Recusados */}
                        {usuarios.filter(u => u.status === 'recusado').length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-2 h-2 rounded-full bg-red-400" />
                                    <h4 className="text-sm font-bold text-gray-600">
                                        Recusados ({usuarios.filter(u => u.status === 'recusado').length})
                                    </h4>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {usuarios.filter(u => u.status === 'recusado').map(u => {
                                        const PapelIcon = u.papel === 'professor' ? BookOpen : GraduationCap
                                        const papelCfg  = u.papel === 'professor'
                                            ? { label: 'Professor', bg: '#dbeafe', color: '#1d4ed8' }
                                            : { label: 'Aluno',     bg: '#ede9fe', color: '#7c3aed' }
                                        return (
                                            <div key={u.idUsuario}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-70 hover:opacity-100 transition-all group">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gray-200">
                                                        <PapelIcon size={16} className="text-gray-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-bold text-gray-500 text-sm">{u.nome}</span>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 bg-gray-100 text-gray-400">
                                                                <PapelIcon size={10} />{papelCfg.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-400">@{u.username} · {u.email}</p>
                                                        {u.telefone  && <p className="text-xs text-gray-400 mt-0.5">{u.telefone}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleAprovarUsuario(u.idUsuario)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all"
                                                        style={{ borderColor: '#16a34a', color: '#16a34a', background: '#f0fdf4' }}>
                                                        Ativar
                                                    </button>
                                                    <button onClick={() => handleDeletarUsuario(u.idUsuario)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                        style={{ background: '#fee2e2', color: '#dc2626' }}>
                                                        <XCircle size={13} /> Excluir
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {usuarios.length === 0 && (
                            <div className="text-center py-16 text-gray-400">
                                <Users size={40} className="mx-auto mb-3 opacity-30" />
                                <p className="font-semibold">Nenhum usuário cadastrado ainda</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showImport && (
                <ImportarPlanilha
                    onClose={() => setShowImport(false)}
                    onImportado={() => setShowImport(false)}
                />
            )}

            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400 shrink-0">{icon}</span>
        <span className="text-gray-400 text-xs w-20 shrink-0">{label}</span>
        <span className="text-gray-700 font-medium">{value}</span>
    </div>
)

export default AdminPainel