import multer from "multer";

const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});

// ✅ Export the multer instance, NOT .any() chained
const upload = multer({ storage });

export default upload;