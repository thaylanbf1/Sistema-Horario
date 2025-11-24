import { useState } from "react"
import {Shield, AlertCircle, User, Lock} from 'lucide-react'

const Login = ({onLoginSuccess}) => {
    const [formData, setFormData] = useState({
        username: '',
        password:''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

    const ADMIN_CREDENTIALS = {
        username:'admin',
        password:'admin456'
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        setTimeout(() => {
            if(formData.username === ADMIN_CREDENTIALS.username && formData.password === ADMIN_CREDENTIALS.password){
                localStorage.setItem('isAdminAuthenticated', true)
                localStorage.setItem('adminUser', formData.username)
                onLoginSuccess()
            }else{
                setError('Usuario ou senha incorretos')
                setLoading('false')
            }
        }, 1000)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        })
        setError('')
    }

  return (
     <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-[#3f86e4d5] via-[#814be6] to-slate-950 relative overflow-hidden">
            {/* Efeitos de fundo decorativos */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-[#282e697a] rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Card principal */}
            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4338e0d3] shadow-lg shadow-purple-500/50">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Painel Administrativo
                    </h1>
                    <p className="text-sm text-white">
                        Assessoria Pedagógica - Área Restrita
                    </p>
                </div>

                {/* Formulário */}
                <div className="backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mensagem de erro */}
                        {error && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {/* Campo Usuário */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="username" 
                                className="text-sm font-semibold text-white flex items-center gap-2"
                            >
                                <User size={18} />
                                Usuário
                            </label>
                            <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} 
                            placeholder="Digite seu usuário" 
                            required 
                            autoComplete="username"
                            className="w-full px-4 py-3 rounded-lg bg-[#22184d] border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"/>
                        </div>

                        {/* Campo Senha */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="password" 
                                className="text-sm font-semibold text-white flex items-center gap-2"
                            >
                                <Lock size={18} />
                                Senha
                            </label>
                            <div className="relative">
                                <input 
                                type={showPassword ? 'text' : 'password'} 
                                id="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                                placeholder="Digite sua senha" 
                                autoComplete="current-password"
                                className="w-full px-4 py-3  rounded-lg bg-[#22184d] border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"/>
                            </div>
                        </div>

                        {/* Botão de Login */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="relative w-full rounded-lg py-3 px-4 font-semibold text-white 
                                     bg-linear-to-r from-[#22184d] to-indigo-600 
                                     hover:from-purple-700 hover:to-indigo-700 
                                     focus:outline-none focus:ring-4 focus:ring-purple-500/50
                                     transition-all duration-200 transform active:scale-95 
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     shadow-lg shadow-purple-500/50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Entrando...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Lock size={20} />
                                    Entrar no Painel
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Informações de teste */}
                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                        <p className="text-xs text-slate-400 text-center">
                            💡 <strong className="text-slate-300">Credenciais de teste:</strong>
                            <br />
                            Usuário: <code className="text-purple-400">admin</code> | 
                            Senha: <code className="text-purple-400">admin456</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Login
