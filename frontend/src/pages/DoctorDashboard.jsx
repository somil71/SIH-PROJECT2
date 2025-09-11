import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { doctorAPI } from '../utils/api'
import { formatDate } from '../utils/api'
import MedicalDashboard from '../components/MedicalDashboard'
import { useAuth } from '../context/AuthContext'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [availability, setAvailability] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await doctorAPI.getDoctorAppointments(1, 20)
        setAppointments(res.appointments)
        // Load profile to read available slots
        try {
          const prof = await doctorAPI.getDoctorProfile()
          setAvailability(prof.doctor?.availableSlots || [])
        } catch {}
      } catch (e) {
        setError('Failed to load appointments')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome, Dr. {user?.name || 'Doctor'} 👨‍⚕️
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your patients, view appointments, and track medical outcomes
          </p>
        </motion.div>
        
        {/* Medical Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <MedicalDashboard userRole="doctor" />
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button className="bg-white rounded-xl shadow p-4 text-left">
            <div className="text-gray-500 text-sm">Today</div>
            <div className="text-2xl font-bold">{today}</div>
          </button>
          <button className="bg-white rounded-xl shadow p-4 text-left">
            <div className="text-gray-500 text-sm">Appointments</div>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </button>
          <button className="bg-white rounded-xl shadow p-4 text-left">
            <div className="text-gray-500 text-sm">Pending</div>
            <div className="text-2xl font-bold">{appointments.filter(a => ['scheduled','confirmed'].includes(a.status)).length}</div>
          </button>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
            {appointments.map((apt) => (
              <div key={apt._id} className="bg-white rounded-xl shadow p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{apt.patient?.name}</h3>
                    <p className="text-gray-600">{formatDate(apt.appointmentDate)} at {apt.appointmentTime}</p>
                    {apt.reason && <p className="text-gray-700 mt-1"><strong>Reason:</strong> {apt.reason}</p>}
                    {apt.symptoms && <p className="text-gray-700"><strong>Symptoms:</strong> {apt.symptoms}</p>}
                    {apt.medicalHistory && <p className="text-gray-700"><strong>History:</strong> {apt.medicalHistory}</p>}
                    {apt.currentMedications && <p className="text-gray-700"><strong>Meds:</strong> {apt.currentMedications}</p>}
                    {apt.allergies && <p className="text-gray-700"><strong>Allergies:</strong> {apt.allergies}</p>}
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-sm text-gray-600">Status: {apt.status}</div>
                    <div className="text-sm text-gray-600">Type: {apt.consultationType}</div>
                    {/* Call patient feature */}
                    {apt.patient?.phone && (
                      <a href={`tel:${apt.patient.phone}`} className="inline-block px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">Call Patient</a>
                    )}
                    {/* Confirm and WhatsApp notify */}
                    {apt.patient?.phone && (
                      <a
                        href={`https://wa.me/${(apt.patient.phone || '').replace('+','')}?text=${encodeURIComponent('Your appointment has been confirmed.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Confirm & WhatsApp
                      </a>
                    )}
                    {/* Add prescription (mock UI) */}
                    <button className="inline-block px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Prescription</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Manage Availability */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Manage Availability</h2>
            <button
              disabled={saving}
              onClick={async ()=>{
                try {
                  setSaving(true)
                  await doctorAPI.updateDoctorProfile({ availableSlots: availability })
                } catch {} finally { setSaving(false) }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >{saving? 'Saving...':'Save Changes'}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="p-2">Day</th>
                  <th className="p-2">Start</th>
                  <th className="p-2">End</th>
                  <th className="p-2">Available</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {availability.map((slot, idx)=> (
                  <tr key={idx} className="border-t">
                    <td className="p-2">
                      <select value={slot.day} onChange={(e)=>{
                        const next=[...availability]; next[idx]={...next[idx], day:e.target.value}; setAvailability(next)
                      }} className="px-2 py-1 border rounded">
                        {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map(d=> <option key={d} value={d}>{d}</option>)}
                      </select>
                    </td>
                    <td className="p-2"><input type="time" value={slot.startTime} onChange={(e)=>{ const next=[...availability]; next[idx]={...next[idx], startTime:e.target.value}; setAvailability(next) }} className="px-2 py-1 border rounded" /></td>
                    <td className="p-2"><input type="time" value={slot.endTime} onChange={(e)=>{ const next=[...availability]; next[idx]={...next[idx], endTime:e.target.value}; setAvailability(next) }} className="px-2 py-1 border rounded" /></td>
                    <td className="p-2"><input type="checkbox" checked={slot.isAvailable!==false} onChange={(e)=>{ const next=[...availability]; next[idx]={...next[idx], isAvailable:e.target.checked}; setAvailability(next) }} /></td>
                    <td className="p-2"><button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded" onClick={()=>{ setAvailability(prev=> prev.filter((_,i)=> i!==idx)) }}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button className="px-4 py-2 bg-gray-100 rounded" onClick={()=>{
              setAvailability(prev=> [...prev, { day:'monday', startTime:'09:00', endTime:'12:00', isAvailable:true }])
            }}>+ Add Slot</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard


