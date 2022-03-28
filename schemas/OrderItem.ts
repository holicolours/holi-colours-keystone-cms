import { integer, text, relationship, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';
import { cloudinaryImage } from '@keystone-6/cloudinary';

const uiHidden = 'hidden';
const uiReadOnly = 'read';

export const OrderItem = list({
  ui: {
    isHidden: true,
    labelField: 'item',
    listView: {
      initialColumns: ['order', 'item', 'image', 'sku', 'quantity', 'unitPriceINR', 'totalINR'],
      pageSize: 10,
    },
    hideCreate: true,
    hideDelete: true,
  },
  fields: {
    order: relationship({
      ref: 'Order.items',
      ui: {
        hideCreate: true,
        createView: { fieldMode: uiHidden },
        itemView: { fieldMode: uiReadOnly }
      }
    }),
    item: text({
      validation: { isRequired: true },
      ui: { itemView: { fieldMode: uiReadOnly } }
    }),
    image: cloudinaryImage({
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'fake',
        apiKey: process.env.CLOUDINARY_KEY || 'fake',
        apiSecret: process.env.CLOUDINARY_SECRET || 'fake',
        folder: 'Order Items',
      },
      ui: { itemView: { fieldMode: uiReadOnly } },
    }),
    sku: relationship({
      ref: 'Stock',
      many: false,
      ui: { itemView: { fieldMode: uiReadOnly } },
      label: 'SKU',
    }),
    quantity: integer({
      validation: { isRequired: true },
      ui: { itemView: { fieldMode: uiReadOnly } }
    }),
    unitPrice: integer({
      validation: { isRequired: true },
      ui: { itemView: { fieldMode: uiHidden } }
    }),
    unitPriceINR: virtual({
      label: 'Unit Price',
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let order = item as any;
          return '₹' + order.unitPrice;
        },
      }),
    }),
    total: integer({
      validation: { isRequired: true },
      ui: { itemView: { fieldMode: uiHidden } }
    }),
    totalINR: virtual({
      label: 'Total',
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let order = item as any;
          return '₹' + order.total;
        },
      }),
    }),
  },
});