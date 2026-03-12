import { useState } from "react"
import { Shield, AlertCircle, User, Lock, Eye, EyeOff, GraduationCap, BookOpen, Users } from 'lucide-react'
import logo from '../../assets/logouepa.png'

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({ username: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [activeRole, setActiveRole] = useState('admin') // 'admin' | 'aluno' | 'professor'

    const CREDENTIALS = {
        admin:     { username: 'admin',     password: 'admin456' },
        aluno:     { username: 'aluno',     password: 'aluno123' },
        professor: { username: 'professor', password: 'prof123'  },
    }

    const roleConfig = {
        admin:     { label: 'Administrador', icon: Shield,      color: '#1c1aa3', desc: 'Acesso completo ao sistema' },
        aluno:     { label: 'Aluno',          icon: GraduationCap, color: '#7c3aed', desc: 'Visualizar grade de horários' },
        professor: { label: 'Professor',      icon: BookOpen,    color: '#1d4ed8', desc: 'Consultar disponibilidade de salas' },
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        setTimeout(() => {
            const cred = CREDENTIALS[activeRole]
            if (formData.username === cred.username && formData.password === cred.password) {
                localStorage.setItem('isAdminAuthenticated', activeRole === 'admin' ? 'true' : 'false')
                localStorage.setItem('adminUser', formData.username)
                localStorage.setItem('userRole', activeRole)
                onLoginSuccess(activeRole)
            } else {
                setError('Usuário ou senha incorretos')
                setLoading(false)
            }
        }, 1000)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const CurrentIcon = roleConfig[activeRole].icon

    return (
        <div className="min-h-screen flex items-center justify-center p-4"
            style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1c1aa3 50%, #150355 100%)' }}>

            {/* Orbs decorativos */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', filter: 'blur(60px)', animation: 'pulse 4s ease-in-out infinite' }} />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, #1c1aa3, transparent)', filter: 'blur(60px)', animation: 'pulse 4s ease-in-out infinite 2s' }} />
            </div>

            {/* Card principal — split layout */}
            <div className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex"
                style={{ minHeight: '520px', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>

                {/* ── Painel esquerdo: formulário ── */}
                <div className="flex-1 bg-white flex flex-col justify-center px-10 py-10">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <img src={logo} alt="Logo UEPA" className="h-10 object-contain" />
                        <div>
                            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#1c1aa3' }}>SCA UEPA</p>
                            <p className="text-[10px] text-gray-400 tracking-wide">Sistema Cronos de Alocação</p>
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
                        Bem-vindo
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">Selecione seu perfil e faça login</p>

                    {/* Seletor de perfil */}
                    <div className="flex gap-2 mb-6">
                        {Object.entries(roleConfig).map(([key, cfg]) => {
                            const Icon = cfg.icon
                            const isActive = activeRole === key
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => { setActiveRole(key); setError(''); setFormData({ username: '', password: '' }) }}
                                    className="cursor-pointer flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all duration-200 text-center"
                                    style={{
                                        borderColor: isActive ? cfg.color : '#e5e7eb',
                                        backgroundColor: isActive ? cfg.color + '12' : 'transparent',
                                        color: isActive ? cfg.color : '#6b7280',
                                        transform: isActive ? 'translateY(-2px)' : 'none',
                                        boxShadow: isActive ? `0 4px 16px ${cfg.color}30` : 'none',
                                    }}>
                                    <Icon size={18} />
                                    <span className="text-[11px] font-bold">{cfg.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Erro */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl mb-4 text-sm">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Usuário"
                                required
                                autoComplete="username"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50 focus:outline-none focus:ring-2 transition-all"
                                style={{ focusBorderColor: roleConfig[activeRole].color }}
                                onFocus={e => e.target.style.borderColor = roleConfig[activeRole].color}
                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Senha"
                                required
                                autoComplete="current-password"
                                className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50 focus:outline-none focus:ring-2 transition-all"
                                onFocus={e => e.target.style.borderColor = roleConfig[activeRole].color}
                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                            />
                            <button type="button" onClick={() => setShowPassword(p => !p)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <p className="text-xs text-right -mt-2" style={{ color: roleConfig[activeRole].color }}>
                            <span className="cursor-pointer hover:underline">Esqueceu a senha?</span>
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer w-full py-3 rounded-xl font-bold text-white text-sm tracking-wide transition-all duration-200 disabled:opacity-60"
                            style={{
                                background: `linear-gradient(135deg, ${roleConfig[activeRole].color}, #7c3aed)`,
                                boxShadow: `0 8px 24px ${roleConfig[activeRole].color}50`,
                            }}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Entrando...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <CurrentIcon size={16} />
                                    Entrar como {roleConfig[activeRole].label}
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Hint de credenciais */}
                    <p className="mt-5 text-[11px] text-gray-400 text-center">
                        Teste — {activeRole}: <span className="font-mono text-gray-500">{CREDENTIALS[activeRole].username}</span> / <span className="font-mono text-gray-500">{CREDENTIALS[activeRole].password}</span>
                    </p>
                </div>

                {/* ── Painel direito: ilustração / info ── */}
                <div className="hidden md:flex w-80 flex-col items-center justify-center px-10 py-10 relative overflow-hidden"
                    style={{ background: `linear-gradient(160deg, #1c1aa3 0%, #150355 60%, #7c3aed 100%)` }}>

                    {/* Formas geométricas decorativas */}
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
                        style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
                        style={{ background: 'white', transform: 'translate(-30%, 30%)' }} />
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full opacity-5"
                        style={{ background: 'white', transform: 'translate(-50%, -50%)' }} />

                    <div className="relative z-10 text-center">
                        {/* Ícone animado */}
                        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center"
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                            }}>
                            <CurrentIcon size={36} className="text-white" />
                        </div>

                        <h2 className="text-2xl font-black text-white mb-3 leading-tight">
                            {activeRole === 'admin' ? 'Painel Admin' :
                             activeRole === 'aluno' ? 'Olá, Aluno!' : 'Olá, Professor!'}
                        </h2>
                        <p className="text-sm text-blue-200 leading-relaxed mb-8">
                            {activeRole === 'admin'
                                ? 'Gerencie horários, salas, professores e toda a grade acadêmica.'
                                : activeRole === 'aluno'
                                ? 'Consulte a disponibilidade de salas e visualize a grade de horários.'
                                : 'Verifique os horários das turmas e a disponibilidade das salas.'}
                        </p>

                        {/* Feature list */}
                        <div className="flex flex-col gap-3 text-left">
                            {(activeRole === 'admin'
                                ? ['Gerenciar alocações', 'Cadastrar professores', 'Configurar salas e cursos']
                                : ['Ver grade de horários', 'Consultar disponibilidade', 'Filtrar por curso e dia']
                            ).map((feat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                        style={{ background: 'rgba(255,255,255,0.2)' }}>
                                        <span className="text-white text-[10px] font-bold">{i + 1}</span>
                                    </div>
                                    <span className="text-sm text-blue-100">{feat}</span>
                                </div>
                            ))}
                        </div>

                        {/* Badge de acesso */}
                        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}>
                            <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse 2s infinite' }} />
                            {activeRole === 'admin' ? 'Acesso Completo' : 'Somente Visualização'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
