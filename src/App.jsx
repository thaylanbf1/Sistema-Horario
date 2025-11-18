import { useEffect, useState } from 'react'
import Header from './components/Header/Header'
import { ScheduleProvider } from './components/Schedule/ScheduleContext'
import ScheduleViiew from './components/Schedule/ScheduleViiew'
import Footer from './components/Footer/Footer'
import Login from './components/Login/Login'
import Protection from './components/Protection/Protection'

function App() {

  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true'
    setIsAuthenticated(authStatus)
  }, [])

  const handleSuccessLogin = () =>{
    setIsAuthenticated(true)
    setIsAdmin(true)
  } 

  const handleLogOut = () =>{
    localStorage.removeItem('isAdminAuthenticated')
    localStorage.removeItem('adminUser')
    setIsAuthenticated(false)
    setIsAdmin(false)
  }

  return (
    <ScheduleProvider>
      {isAdmin && isAuthenticated ? (
        <>
          
          <Protection onLogOut={handleLogOut}/>
          <Footer />
        </>
      ) : isAdmin && !isAuthenticated ? (
        <>
          <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>
          <Login onLoginSuccess={handleSuccessLogin} />
        </>
      ) : (
        <div className='min-h-screen bg-gray-50'>
        <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>
        <main className='max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-8'>
          <ScheduleViiew/> 
        </main>
         <Footer />
      </div>
      )}
    </ScheduleProvider>
  )
}

export default App
