const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadPdf } = require('../controllers/upload.controller');

const uploadDir = path.join(__dirname, '../uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/pdf', upload.single('file'), uploadPdf);

module.exports = router;