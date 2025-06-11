// uploadRoutes.js
const express = require('express');
const router = express.Router();
// const upload = require('../middleware/uploadMiddleware.js'); // No longer needed for this specific route
const { fetchUploads, uploadMaterial, deleteUpload } = require('../controllers/uploadController.js')

router.get('/subjects/:sid/uploads' , fetchUploads)
router.post('/subjects/:sid/uploads', uploadMaterial); // <-- CHANGED: Removed upload.single('file')
router.delete('/uploads/:id' , deleteUpload)

module.exports = router;