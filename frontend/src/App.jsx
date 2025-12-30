import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import SignUp from './components/SignUp'
import NotesDashboard from './components/NotesDashboard'

function App() {
  const { user, loading, logOut } = useAuth()
  const [showSignUp, setShowSignUp] = useState(false)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl font-bold text-gray-800">Loading...</h2>
      </div>
    )
  }

  // User is logged in
  if (user) {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-8 py-6 shadow-lg">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">📝 Note Taking App</h1>
            <div className="flex items-center gap-6">
              <span className="text-lg">Welcome, {user.displayName || user.email}</span>
              <button 
                onClick={logOut}
                className="px-6 py-2 bg-white bg-opacity-20 text-white font-semibold rounded-lg border border-white hover:bg-opacity-30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto">
          <NotesDashboard />
        </main>
      </div>
    )
  }

  // User is not logged in, show auth forms
  return (
    <>
      {showSignUp ? (
        <SignUp onSwitchToLogin={() => setShowSignUp(false)} />
      ) : (
        <Login onSwitchToSignUp={() => setShowSignUp(true)} />
      )}
    </>
  )
}

export default App
