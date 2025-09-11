import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authenticateToken } from '../middleware/auth.js'
import Report from '../models/Report.js'

const router = express.Router()

const uploadDir = path.resolve('uploads/reports')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir) },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'))
  }
})
const upload = multer({ storage })

// Upload report (patient)
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ message: 'No file uploaded' })
    const report = await Report.create({
      owner: req.user._id,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/reports/${path.basename(file.path)}`
    })
    res.json({ report })
  } catch (e) { res.status(500).json({ message: 'Upload failed' }) }
})

// List my reports (patient)
router.get('/mine', authenticateToken, async (req, res) => {
  const reports = await Report.find({ owner: req.user._id }).sort({ createdAt: -1 })
  res.json({ reports })
})

export default router


