import{User, LogOut} from 'lucide-react'
import AdminPainel from '../AdminPainel/AdminPainel'
const Protection = ({onLogOut}) => {
  const adminUser = localStorage.getItem('adminUser') || 'Admin'

  return (
  
    <div className="min-h-screen bg-gray-50">

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-purple-700 to-indigo-600 flex items-center justify-center">
                <User size={20} className='text-white'/>
              </div>

            <div>
              <span className='block text-sm font-semibold text-gray-900'>
                {adminUser}
              </span>
              <span className='block text-xs text-gray-500'>Administrador</span>
            </div>
          </div>
          
          <button onClick={onLogOut} className='flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold'>
            <LogOut size={18}/> Sair 
          </button>
          </div>
        </div>
      </div>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-2.5 py-8'>
        <AdminPainel/>
      </main>
    </div>
  )
}

export default Protection
