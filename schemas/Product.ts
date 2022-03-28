import { select, text, relationship, virtual, json, integer, timestamp } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import { graphql, list } from '@keystone-6/core';
var slugify = require('slugify');
var firebase = require('firebase-admin');

export const Product = list({
  ui: {
    listView: {
      initialColumns: ['name', 'status', 'sku', 'price', 'categories', 'options', 'variants'],
      pageSize: 10
    },
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
      },
      isIndexed: 'unique'
    }),
    slug: text({
      isIndexed: 'unique',
      ui: {
        createView: {
          fieldMode: 'hidden'
        },
        itemView: {
          fieldMode: 'hidden'
        }
      }
    }),
    url: virtual({
      label: 'URL',
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let product = item as any;
          return `https://holicoloursjewellery.in/products/${product.slug}`;
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
    sku: integer({
      label: 'SKU',
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      }
    }),
    description: text({
      ui: {
        displayMode: 'textarea',
        createView: { fieldMode: 'hidden' },
      },
    }),
    additionalInformation: document({
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
          superscript: true,
          subscript: true,
        },
        listTypes: true,
        alignment: true,
        headingLevels: [1, 2, 3, 4, 5, 6],
        blockTypes: {
          blockquote: true,
        },
        softBreaks: true,
      },
      links: true,
      dividers: true,
      label: 'Additional Information',
      ui: {
        createView: { fieldMode: 'hidden' },
      }
    }),
    options: relationship({
      ref: 'ProductOption.product',
      ui: {
        displayMode: 'cards',
        cardFields: ['option'],
        inlineCreate: { fields: ['optionName', 'optionValues'] },
        inlineEdit: { fields: ['optionName', 'optionValues'] },
        inlineConnect: false,
        createView: { fieldMode: 'hidden' },
      },
      many: true
    }),
    defaultVariantOptions: relationship({
      ref: 'VariantOption',
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
    colorPalette: relationship({
      ref: 'Color',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' }
      }
    }),
    categories: relationship({
      ref: 'Category.products',
      many: true,
      ui: {
        displayMode: 'select',
        createView: { fieldMode: 'hidden' },
      },
    }),
    tags: relationship({
      ref: 'Tag.products',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
      },
    }),
    variants: relationship({
      ref: 'ProductVariant.product',
      ui: {
        displayMode: 'cards',
        createView: { fieldMode: 'hidden' },
        cardFields: ['title', 'status', 'image', 'price', 'stock', 'sku'],
        inlineCreate: { fields: ['options', 'status', 'image', 'regularPrice', 'length', 'width', 'height', 'weight', 'packageLength', 'packageWidth', 'packageHeight'] },
        inlineConnect: false,
        linkToItem: true
      },
      many: true
    }),
    accessories: relationship({
      ref: 'Accessory.products',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
      }
    }),
    reviews: relationship({
      ref: 'Review.product',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        displayMode: 'count',
      }
    }),
    price: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item, args, context) {
          let priceRange = '';
          let product = item as any;
          priceRange = context.query.Product.findOne({
            where: { id: product.id },
            query: 'variants { regularPrice }'
          }).then((resp) => {
            let priceList = resp.variants.map((v: { regularPrice: any; }) => v.regularPrice);
            if (priceList.length == 0) {
              return '-';
            }
            let min = Math.min(...priceList);
            let max = Math.max(...priceList);
            if (min == max) {
              return '₹' + min;
            } else {
              return '₹' + min + ' - ₹' + max;
            }
          }) as any;
          return priceRange;
        },
      }),
      ui: {
        itemView: {
          fieldMode: 'hidden'
        }
      }
    }),
    saleCount: virtual({
      field: graphql.field({
        type: graphql.Int,
        resolve() {
          return 0;
        },
      }),
    }),
    additionalImages: relationship({
      ref: 'Image',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['image'],
        inlineCreate: { fields: ['image'] },
        inlineEdit: { fields: ['image'] },
        inlineConnect: false,
        linkToItem: false,
        createView: { fieldMode: 'hidden' },
      }
    }),
    videoEmbedLinks: relationship({
      ref: 'EmbedLink',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['embedLink'],
        inlineCreate: { fields: ['embedLink'] },
        inlineEdit: { fields: ['embedLink'] },
        inlineConnect: false,
        linkToItem: false,
        createView: { fieldMode: 'hidden' },
      }
    }),
    creationDate: timestamp({
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      }
    }),
    lastUpdatedDate: timestamp({
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      }
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
      const { name } = resolvedData;
      if (operation == 'create') {
        resolvedData.creationDate = new Date().toISOString();
        let productSequence = await firebase.database().ref().child("sequence").child("products")
          .transaction(function (currentValue: any) {
            return (currentValue || 0) + 1;
          });
        resolvedData.sku = productSequence.snapshot.val();
      }
      if (operation == 'create' || operation == 'update') {
        if (name) {
          resolvedData.slug = slugify(name.toLowerCase());
        }
        resolvedData.lastUpdatedDate = new Date().toISOString();
      }
      return resolvedData;
    },
    validateInput: async ({
      resolvedData,
      addValidationError,
    }) => {
      const { name } = resolvedData;
      if (name) {
        let format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (format.test(name)) {
          addValidationError('Product name can\'t contain special charecters!');
        }
      }
    },
    afterOperation: async ({ operation, item, context }) => {
      let product = item as any;

      if (operation == 'create' || operation == 'update') {
        const p = await context.query.Product.findOne({
          where: { id: product.id },
          query: 'variantsCount variants { id sku { id } }'
        }) as any;
        if (Array.isArray(p.variants)) {
          p.variants.forEach((v: { id: any, sku: any; }, index: any) => {
            if (!v.sku) {
              const stock = context.query.Stock.createOne({
                data: {
                  sku: product.sku + '-' + (index + 1),
                  product: {
                    connect: {
                      id: product.id
                    }
                  },
                  variant: {
                    connect: {
                      id: v.id
                    }
                  },
                },
                query: 'sku'
              })
            }
          });
        }
      }
    }
  },
});