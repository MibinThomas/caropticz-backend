import multer from "multer";
import path from "path";
// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("public/images")); 
  },
  filename: (req, file, cb) => {
    const filename = `image-${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

// Validate image file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, JPG, and WEBP files are allowed!"), false);
  }
};

// Multer config
const multerConfig = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Reusable upload middleware
const upload = (fieldName, isMultiple = false) => {
  const uploadMiddleware = isMultiple
    ? multerConfig.fields([{ name: fieldName, maxCount: 10 }])
    : multerConfig.single(fieldName);

  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Multer error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
};

export default upload;

