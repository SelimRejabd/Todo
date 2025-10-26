import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { Readable } from "stream";
import { cloudinary } from "../../config";
import catchAsync from "../utils/catchAsync";
import path from "path";

// Memory storage for Multer
const storage = multer.memoryStorage();

// Multer configuration for multiple fields
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Max 100MB per file
    files: 100 // Max 100 files total
  }
});

// Upload middleware: accept both "images" and "files"
const uploadFarmFiles = [
  upload.fields([
    { name: "images", maxCount: 25 },
    { name: "files", maxCount: 100 },
    { name: "videos", maxCount: 5 }
  ]),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const fileGroups = req.files as {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
      files?: Express.Multer.File[];
    };
    const uploadedImages: string[] = [];
    const uploadedVideos: string[] = [];
    const uploadedDocs: string[] = [];
    // Helper: Upload buffer to Cloudinary
    const uploadToCloudinary = (file: Express.Multer.File, folder: string) => {
      return new Promise<string>((resolve, reject) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
        const publicId = `${folder}/${name}`;

        const cloudStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            resource_type: "auto", // auto-detect type
            format: ext.slice(1)
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          }
        );

        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(cloudStream);
      });
    };

    // Process images
    if (fileGroups.images) {
      for (const file of fileGroups.images) {
        const url = await uploadToCloudinary(file, "green-wealth/farms/images");
        uploadedImages.push(url);
      }
    }
    // Process videos
    if (fileGroups.videos) {
      for (const file of fileGroups.videos) {
        const url = await uploadToCloudinary(file, "green-wealth/farms/videos");
        uploadedVideos.push(url);
      }
    }

    // Process documents/files
    if (fileGroups.files) {
      for (const file of fileGroups.files) {
        const url = await uploadToCloudinary(file, "green-wealth/farms/files");
        uploadedDocs.push(url);
      }
    }

    // Attach URLs to req.body
    req.body.images = uploadedImages;
    req.body.videos = uploadedVideos;
    req.body.files = uploadedDocs;

    console.log("Uploaded Images :", uploadedImages);
    console.log("Uploaded Videos :", uploadedVideos);
    console.log("Uploaded Files:", uploadedDocs);

    next();
  })
];

export { uploadFarmFiles };
