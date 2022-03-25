import { select, text, relationship, integer } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'fake',
  apiKey: process.env.CLOUDINARY_KEY || 'fake',
  apiSecret: process.env.CLOUDINARY_SECRET || 'fake',
  folder: 'products',
};

export const Accessory = list({
  ui: {
    listView: {
      initialColumns: ['name', 'status', 'price'],
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    status: select({
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Published', value: 'PUBLISHED' },
      ],
      defaultValue: 'DRAFT',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    price: integer({ validation: { isRequired: true } }),
    products: relationship( { ref: 'Product.accessories', many: true }),
  },
});