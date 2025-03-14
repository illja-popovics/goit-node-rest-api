import multer from "multer";
import path from "path";

const tempDir = path.join(process.cwd(), "temp");

// Налаштування `multer` для збереження файлів у тимчасовій папці
const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Ініціалізація `multer`
const upload = multer({ storage });

export default upload;
