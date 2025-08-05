import multer from 'multer';
import path from 'path';

// File storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.mp3', '.wav', '.m4a', '.ogg', '.jpg', '.png', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) cb(null, true);
  else cb(new Error('Unsupported file format'), false);
};

const upload = multer({ storage, fileFilter });

export default upload;
