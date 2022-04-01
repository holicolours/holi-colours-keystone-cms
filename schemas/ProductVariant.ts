import { integer, select, text, relationship, float, virtual, checkbox } from '@keystone-6/core/fields';
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
    listView: {
      initialColumns: ['title', 'status', 'sku', 'image', 'price', 'status', 'stock'],
      pageSize: 10,
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
      ref: 'VariantOption.variant',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        displayMode: 'cards',
        cardFields: ['option'],
        inlineCreate: { fields: ['optionName', 'optionValue'] },
        inlineEdit: { fields: ['optionName', 'optionValue'] },
        inlineConnect: false,
      }
    }),
    title: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item, args, context) {
          let variantTitle = '';
          let variant = item as any;
          variantTitle = context.query.ProductVariant.findOne({
            where: { id: variant.id },
            query: 'options { optionName { optionName } optionValue { optionValue } }'
          }).then((value) => {
            let title = value.options.map((v: { optionName: { optionName: string; }; optionValue: { optionValue: string; }; }) => v.optionName.optionName + ': ' + v.optionValue.optionValue).join(", ");
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
    defaultVariant: checkbox({
      defaultValue: false,
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
    length: float({ validation: { isRequired: true }, defaultValue: 0 }),
    width: float({ validation: { isRequired: true }, defaultValue: 0 }),
    height: float({ validation: { isRequired: true }, defaultValue: 0 }),
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
      }
    }),
    stock: virtual({
      field: graphql.field({
        type: graphql.Int,
        async resolve(item, args, context) {
          let variant = item as any;
          if (!variant.skuId) return 0;
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
      item,
      addValidationError,
    }) => {
      let variant = item as any;
      const { defaultVariant } = resolvedData;
      if (defaultVariant && !variant.image) {
        addValidationError('Default variant should have an image uploaded!');
      }
    },
    afterOperation: async ({ operation, item, originalItem, context }) => {
      let variantInput = item as any;
      let originalVariant = originalItem as any;

      if (operation == "create" || operation == "update") {
        if (variantInput.defaultVariant && variantInput.defaultVariant != originalVariant.defaultVariant) {
          let v = await context.query.ProductVariant.findOne({
            where: { id: variantInput.id },
            query: ' product { variants { id defaultVariant } } '
          }) as any;
          let updateData: { where: { id: any; }; data: { defaultVariant: boolean; }; }[] = [];
          v.product.variants.forEach((v: any) => {
            if (v.defaultVariant && v.id != variantInput.id) {
              updateData.push({
                where: { id: v.id },
                data: {
                  defaultVariant: false
                }
              });
            }
          });
          if (updateData.length > 0) {
            await context.db.ProductVariant.updateMany({
              data: updateData
            });
          }
        }
      }
    }
  },
});