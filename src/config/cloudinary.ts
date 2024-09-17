import { v2 as cloudinary } from 'cloudinary';
import { envs } from 'src/config/envs';

export const CloudinaryConfig = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: envs.cloudinaryCloudName,
      api_key: envs.cloudinaryKey,
      api_secret: envs.cloudinarySecret,
    });
  },
};