import { integer, relationship, timestamp, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';

export const InboundStock = list({
  ui: {
    isHidden: true,
    labelField: 'title',
    hideCreate: true,
    hideDelete: true,
    listView: {
      initialColumns: ['sku', 'title', 'stockQuantity', 'dateOfPurchase'],
      initialSort: {
        field: 'dateOfPurchase',
        direction: 'DESC'
      },
      pageSize: 10,
    },
  },
  fields: {
    title: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let inboundStock = item as any;
          let title = '';
          var options = { year: 'numeric', month: 'long', day: 'numeric' };
          if (inboundStock.stockQuantity > 0) {
            title += '+';
          } else {
            title += '-'
          }
          title += Math.abs(inboundStock.stockQuantity) + ' (' + inboundStock.dateOfPurchase.toLocaleDateString("en-US", options) + ')';
          return title;
        },
      }),
      ui: {
        createView: { fieldMode: 'hidden' },
      }
    }),
    sku: relationship({
      ref: 'Stock.inboundStock',
      many: false,
      label: 'SKU',
      ui: {
        hideCreate: true,
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read'},
      }
    }),
    stockQuantity: integer({
      validation: { isRequired: true },
      ui: {
        itemView: { fieldMode: 'read'},
      }
    }),
    dateOfPurchase: timestamp({ 
      validation: { isRequired: true },
      defaultValue: {
        kind: 'now'
      },
      ui: {
        itemView: { fieldMode: 'read'},
      }
    }),
  },
});