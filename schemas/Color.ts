import { list } from '@keystone-6/core';
import { cloudinaryImage } from '@keystone-6/cloudinary';
import { text } from '@keystone-6/core/fields';

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'fake',
  apiKey: process.env.CLOUDINARY_KEY || 'fake',
  apiSecret: process.env.CLOUDINARY_SECRET || 'fake',
  folder: 'holicoloursjewellery',
};

export const Color = list({
  ui: {
    isHidden: true,
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
      },
      isIndexed: 'unique'
    }),
    hexColor: text({
      label: 'HEX Color',
      validation: {
        isRequired: true,
      },
      isIndexed: 'unique'
    }),
  },
});