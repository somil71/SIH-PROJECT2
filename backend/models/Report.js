import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  url: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('Report', reportSchema)


