const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;  // Use promises-based fs module for async operations
const sharp = require('sharp');

// Temp storage for multer (before compression)
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'temp_uploads/';  // Temporary folder for initial upload
    // Ensure the directory exists, if not, create it
    fs.mkdir(uploadPath, { recursive: true }).catch(console.error);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueName = Date.now() + '-' + baseName.replace(/\s+/g, '-') + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: tempStorage });

// Compress images and move them to the 'uploads' folder
const compressImages = async (req, res, next) => {
  try {
    if (!req.files) return next();  // If no files, proceed to the next middleware

    const compressedImages = [];

    // Process each uploaded file
    for (const file of req.files) {
      const outputFilename = `compressed-${file.filename}`;
      const outputPath = path.join('uploads', outputFilename);

      // Resize and compress the image using sharp
      await sharp(file.path)
        .resize({ width: 800 }) // Resize width to 800px (optional)
        .jpeg({ quality: 70 })  // Compress JPEG quality
        .toFile(outputPath);

      // Log compression success
      console.log(`Image compressed and saved to ${outputPath}`);

      // Clean up the temporary file after processing
      try {
        await fs.unlink(file.path);  // Delete the temp file
        console.log(`Successfully deleted temp file: ${file.path}`);
      } catch (err) {
        console.error(`Failed to delete temp file: ${file.path}`, err);
      }

      // Push the compressed image details to the response object
      compressedImages.push({
        filename: outputFilename,
        path: outputPath,
        originalname: file.originalname
      });
    }

    // Add the compressed files info to the request for further processing
    req.compressedFiles = compressedImages;
    next();  // Move to the next middleware or route handler
  } catch (error) {
    console.error("Error compressing images:", error);
    next(error);  // Pass error to next error handler
  }
};

module.exports = { upload, compressImages };
