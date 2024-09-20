import { v2 as cloudinary } from 'cloudinary';
import { envs } from 'src/config/envs';

cloudinary.config({
  cloud_name: envs.cloudinaryCloudName,
  api_key: envs.cloudinaryKey,
  api_secret: envs.cloudinarySecret,
});

export { cloudinary };