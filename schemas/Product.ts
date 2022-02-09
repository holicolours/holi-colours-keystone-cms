import { select, text, relationship, virtual, json } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import { graphql, list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'fake',
  apiKey: process.env.CLOUDINARY_KEY || 'fake',
  apiSecret: process.env.CLOUDINARY_SECRET || 'fake',
  folder: 'products',
};

export const Product = list({
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
    listView: {
      initialColumns: ['name', 'status', 'variants'],
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
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    additionalInformation: document({
      formatting: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1],
      ],
      links: true,
      dividers: true,
      label: 'Additional Information'
    }),
    options: relationship({
      ref: 'ProductOption.product',
      ui: {
        displayMode: 'select',
        // cardFields: ['optionName', 'optionValues'],
        // inlineCreate: { fields: ['optionName', 'optionValues'] },
        // inlineEdit: { fields: ['optionName', 'optionValues'] },
        // inlineConnect: false,
        // linkToItem: true
      },
      many: true
    }),
    variants: relationship({
      ref: 'ProductVariant.product',
      ui: {
        displayMode: 'select',
        // cardFields: ['title', 'image', 'regularPrice', 'stock'],
        // inlineCreate: { fields: ['title', 'enabled', 'defaultVariant', 'image', 'regularPrice', 'length', 'width', 'weight', 'height', 'stock'] },
        // inlineEdit: { fields: ['title', 'enabled', 'defaultVariant', 'image', 'regularPrice', 'length', 'width', 'weight', 'height', 'stock'] },
        // inlineConnect: false,
        // linkToItem: true
      },
      many: true
    }),
    stock: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve() {
          return 0;
        },
      }),
    }),
    vendor: relationship( { ref: 'Vendor.products', many: false })
  },
});