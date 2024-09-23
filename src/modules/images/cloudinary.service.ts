import { Injectable } from '@nestjs/common';
import { cloudinary } from 'src/config/cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImageToCloudinary(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImageFromCloudinary(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  async getImageDimensions( file: any ): Promise<{ width: number; height: number }> {
    const sharp = require('sharp');
    const metadata = await sharp(file.buffer).metadata();
    return { width: metadata.width, height: metadata.height };
  }
}
