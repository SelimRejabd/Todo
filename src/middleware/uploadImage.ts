import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { Readable } from "stream";
import { cloudinary } from "../../config";
import catchAsync from "../utils/catchAsync";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Utility: Upload a buffer stream to Cloudinary
const uploadFileBuffer = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "uploads" },
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
};

// Utility: Upload a base64 image to Cloudinary
const uploadBase64Image = async (base64: string): Promise<string> => {
  const result = await cloudinary.uploader.upload(base64, {
    folder: "uploads",
  });
  return result.secure_url;
};

const uploadImage = (fields: string[]) => [
  upload.any(),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const uploads: Record<string, string[]> = {};
    const files = req.files as Express.Multer.File[];

    // 1. Handle file uploads in parallel
    await Promise.all(
      fields.map(async (field) => {
        const matchingFiles = files?.filter((f) => f.fieldname === field) || [];
        uploads[field] = [];

        const fileUploadPromises = matchingFiles.map((file) =>
          uploadFileBuffer(file)
        );
        const fileUrls = await Promise.all(fileUploadPromises);
        uploads[field].push(...fileUrls);
      })
    );

    // 2. Handle base64 uploads in parallel
    await Promise.all(
      fields.map(async (field) => {
        if (!uploads[field]) uploads[field] = [];

        const base64Data = req.body[field];

        if (
          typeof base64Data === "string" &&
          base64Data.startsWith("data:image")
        ) {
          const url = await uploadBase64Image(base64Data);
          uploads[field].push(url);
        } else if (Array.isArray(base64Data)) {
          const base64UploadPromises = base64Data
            .filter(
              (b64: string) =>
                typeof b64 === "string" && b64.startsWith("data:image")
            )
            .map((b64: string) => uploadBase64Image(b64));

          const urls = await Promise.all(base64UploadPromises);
          uploads[field].push(...urls);
        }
      })
    );

    // 3. Assign uploaded URLs to req.body
    for (const field of fields) {
      if (uploads[field]?.length === 1) {
        req.body[field] = uploads[field][0];
      } else if (uploads[field]?.length > 1) {
        req.body[field] = uploads[field];
      }
    }

    next();
  }),
];

export { uploadImage };
