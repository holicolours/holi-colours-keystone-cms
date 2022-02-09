import { integer, select, text, relationship } from '@keystone-6/core/fields';
import { cloudinaryImage } from '@keystone-6/cloudinary';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'fake',
  apiKey: process.env.CLOUDINARY_KEY || 'fake',
  apiSecret: process.env.CLOUDINARY_SECRET || 'fake',
  folder: 'products',
};

export const ProductVariant = list({
  access: {
    operation: {
      create: isSignedIn,
    },
    filter: {
      query: rules.canReadProducts,
      update: rules.canManageProducts,
      delete: rules.canManageProducts,
    },
  },
  ui: {
    labelField: 'title',
    isHidden: true,
    listView: {
      initialColumns: ['title', 'image', 'regularPrice', 'enabled'],
    },
  },
  fields: {
    product: relationship({
      ref: 'Product.variants',
      ui: {
        // hideCreate: true,
        // itemView: { fieldMode: 'read'}
      } 
    }),
    title: text({ validation: { isRequired: true } }),
    enabled: select({
      options: [
        { label: 'Yes', value: 'YES' },
        { label: 'No', value: 'NO' },
      ],
      defaultValue: 'YES',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    defaultVariant: select({
      options: [
        { label: 'Yes', value: 'YES' },
        { label: 'No', value: 'NO' },
      ],
      defaultValue: 'NO',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    image: cloudinaryImage({
      cloudinary,
      label: 'Image',
    }),
    regularPrice: integer({ validation: { isRequired: true } }),
    salePrice: integer(),
    length: integer({ validation: { isRequired: true } }),
    width: integer({ validation: { isRequired: true } }),
    height: integer({ validation: { isRequired: true } }),
    weight: integer({ validation: { isRequired: true } }),
    stock: relationship( { 
      ref: 'Stock.variant',
      ui: {
        displayMode: 'cards',
        cardFields: ['stockQuantity', 'dateOfPurchase'],
        inlineCreate: { fields: ['stockQuantity', 'dateOfPurchase'] },
        inlineEdit: { fields: ['stockQuantity', 'dateOfPurchase'] },
        inlineConnect: false,
        linkToItem: true
      }
    })
    // packageLength: integer({ validation: { isRequired: true } }),
    // packageWidth: integer({ validation: { isRequired: true } }),
    // packageHeight: integer({ validation: { isRequired: true } }),
  },
});