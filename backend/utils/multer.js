const multer = require('multer');
const path = require('path');

// Configurazione storage per Multer
const storage = multer.diskStorage({
  destination: 'uploads/', // Cartella dove salvare i file
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

// Filtrare solo immagini
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo di file non supportato'), false);
  }
};

// Limite dimensione file (2MB)
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter
});

module.exports = upload;
