import { integer, select, text, relationship, float, virtual } from '@keystone-6/core/fields';
import { cloudinaryImage } from '@keystone-6/cloudinary';
import { graphql, list } from '@keystone-6/core';
var firebase = require('firebase-admin');

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'fake',
  apiKey: process.env.CLOUDINARY_KEY || 'fake',
  apiSecret: process.env.CLOUDINARY_SECRET || 'fake',
  folder: 'products',
};

function getPrice(variant: any) {
  let price;
  if (variant.salePrice) {
    price = variant.salePrice;
  } else {
    price = variant.regularPrice;
  }
  return price;
}

export const ProductVariant = list({
  ui: {
    labelField: 'title',
    isHidden: true,
    listView: {
      initialColumns: ['title', 'status', 'sku', 'image', 'price', 'status', 'stock'],
    },
  },
  fields: {
    product: relationship({
      ref: 'Product.variants',
      ui: {
        hideCreate: true,
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' }
      }
    }),
    options: relationship({
      ref: 'ProductOptionValue',
      many: true
    }),
    title: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item, args, context) {
          let variantTitle = '';
          let variant = item as any;
          variantTitle = context.query.ProductVariant.findOne({
            where: { id: variant.id },
            query: 'options { optionValue }'
          }).then((value) => {
            let title = value.options.map((v: { optionValue: any; }) => v.optionValue).join(" x ");
            return title ? title : 'Simple Product';
          }) as any;
          return variantTitle;
        },
      }),
    }),
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
    image: cloudinaryImage({
      cloudinary,
      label: 'Image',
    }),
    regularPrice: integer({ validation: { isRequired: true } }),
    salePrice: integer(),
    price: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve(item, args, context) {
          let variant = item as any;
          return getPrice(variant);
        },
      }),
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' }
      }
    }),
    salePercentage: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve(item, args, context) {
          let salePercentage;
          let variant = item as any;
          let price = getPrice(variant);
          salePercentage = Math.round(((variant.regularPrice - price) / variant.regularPrice) * 100);
          return salePercentage;
        },
      }),
      ui: {
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' }
      }
    }),
    length: float({ validation: { isRequired: false } }),
    width: float({ validation: { isRequired: false } }),
    height: float({ validation: { isRequired: false } }),
    weight: float({ validation: { isRequired: true } }),
    packageLength: float({ validation: { isRequired: true }, defaultValue: 0 }),
    packageWidth: float({ validation: { isRequired: true }, defaultValue: 0 }),
    packageHeight: float({ validation: { isRequired: true }, defaultValue: 0 }),
    sku: relationship({
      ref: 'Stock.variant',
      label: 'SKU',
      ui: {
        itemView: { fieldMode: 'read' },
        createView: { fieldMode: 'hidden' },
        // displayMode: 'cards',
        // cardFields: ['sku'],
        // inlineCreate: { fields: [] },
        // inlineEdit: { fields: ['inboundStock', 'vendor'] },
        // inlineConnect: false,
        // linkToItem: true
      }
    }),
    stock: virtual({
      field: graphql.field({
        type: graphql.Int,
        async resolve(item, args, context) {
          let variant = item as any;
          // console.log(variant);
          const s = await context.query.Stock.findOne({
            where: { id: variant.skuId },
            query: 'stock'
          }) as any;
          return s && s.stock ? s.stock : 0;
        },
      }),
    }),
  },
  hooks: {
    resolveInput: async ({
      listKey,
      operation,
      inputData,
      item,
      resolvedData,
      context,
    }) => {
      return resolvedData;
    },
    validateInput: async ({
      resolvedData,
      addValidationError,
    }) => {
      // addValidationError('Error!');
    },
  },
});