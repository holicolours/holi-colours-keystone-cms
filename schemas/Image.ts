import { list } from '@keystone-6/core';
import { cloudinaryImage } from '@keystone-6/cloudinary';

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'fake',
  apiKey: process.env.CLOUDINARY_KEY || 'fake',
  apiSecret: process.env.CLOUDINARY_SECRET || 'fake',
  folder: 'holicoloursjewellery',
};

export const Image = list({
  ui: {
    isHidden: true,
  },
  fields: {
    image: cloudinaryImage({
      cloudinary,
    }),
  },
});