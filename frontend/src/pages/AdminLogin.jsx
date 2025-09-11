import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { devAdminLogin } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    // Admin login placeholder - treat specific email as admin
    if (email === 'admin@site.com' && password.length >= 4) {
      devAdminLogin()
      navigate('/admin')
    } else {
      setError('Invalid admin credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Login</h1>
        <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Admin Email" type="email" className="w-full px-3 py-2 border rounded" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 border rounded" />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
          <p className="text-xs text-gray-500">Use admin@site.com for demo access</p>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin


