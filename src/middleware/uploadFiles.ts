// //middleware/uploadFiles
import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { Readable } from "stream";
import { cloudinary } from "../../config";
import catchAsync from "../utils/catchAsync";
import path from "path";


const upload = multer({ storage: multer.memoryStorage() });
const uploadFiles = [
  upload.array("files"),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const originalName = file.originalname; // e.g., "demo2.txt"
      const ext = path.extname(originalName); // e.g., ".txt"
      const name = path.basename(originalName, ext).replace(/\s+/g, "_"); // e.g., "demo2"
      const publicId = `green-wealth/reports/${name}${ext}`; // Ensure ext included

      const url = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: undefined,
            public_id: publicId.replace(/\.[^.]+$/, ""),
            resource_type: "auto", // to support images, videos, pdfs, etc.
            format: ext.slice(1),
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          }
        );

        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(stream);
      });
      uploadedUrls.push(url);
    }
    console.log("UploadUrls: ", uploadedUrls);
    req.body.files = uploadedUrls;
    next();
  }),
];

export { uploadFiles };
