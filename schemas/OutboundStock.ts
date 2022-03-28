import { integer, relationship, timestamp, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';

export const OutboundStock = list({
  ui: {
    isHidden: true,
    labelField: 'title',
    hideDelete: true,
    listView: {
      pageSize: 10,
    }
  },
  fields: {
    title: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item, args, context) {
          let outboundStock = item as any;
          const order = await context.query.Order.findOne({
            where: { id: outboundStock.orderId },
            query: 'orderNumber'
          }) as any;
          return outboundStock.stockQuantity + ' (Order ' + order.orderNumber + ')';
        },
      }),
      ui: {
        createView: { fieldMode: 'hidden' },
      }
    }),
    sku: relationship({
      ref: 'Stock.outboundStock',
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
    order: relationship({
      ref: 'Order',
      many: false,
      ui: {
        itemView: { fieldMode: 'read'},
      }
    }),
  },
});