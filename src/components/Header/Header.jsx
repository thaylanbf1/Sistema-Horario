import logo from '../../assets/logouepa.png'
import { LogOut, GraduationCap, BookOpen, Shield } from 'lucide-react'

const roleLabels = {
  admin:     { label: 'Administrador', Icon: Shield },
  aluno:     { label: 'Aluno',          Icon: GraduationCap },
  professor: { label: 'Professor',      Icon: BookOpen },
}

const Header = ({ isAdmin, setIsAdmin, userRole, onLogOut }) => {
  const roleInfo = userRole ? roleLabels[userRole] : null
  const RoleIcon = roleInfo?.Icon

  return (
    <header className='bg-[#1c1aa3c4] shadow-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          <div className='flex items-center gap-3'>
            <img src={logo} alt="Logo UEPA" className='max-w-[100px]' />
          </div>

          <div className='flex items-center gap-3'>
            {/* Badge do usuário logado (aluno/professor) */}
            {userRole && !isAdmin && roleInfo && (
              <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm'>
                <RoleIcon size={15} />
                <span className='font-semibold'>{roleInfo.label}</span>
              </div>
            )}

            {/* Botão logout para aluno/professor */}
            {userRole && !isAdmin && onLogOut && (
              <button
                onClick={onLogOut}
                className='flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-500/70 hover:-translate-y-0.5 transition-all duration-200 shadow-sm text-sm'
              >
                <LogOut size={16} />
                Sair
              </button>
            )}

            {/* Botão painel admin (apenas quando não logado como aluno/prof) */}
            {!userRole && (
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className='bg-[#ec1f1fc4] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#3230b3] hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md'
              >
                {isAdmin ? 'Visualizar grade' : 'Login'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
