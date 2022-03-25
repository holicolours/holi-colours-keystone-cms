import { integer, relationship, select, text, timestamp, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';
var firebase = require('firebase-admin');

export const Stock = list({
  ui: {
    labelField: 'sku',
    hideCreate: true,
    hideDelete: true,
    listView: {
      initialColumns: ['sku', 'product', 'variant', 'status', 'stock'],
      initialSort: {
        field: 'sku',
        direction: 'ASC'
      }
    },
  },
  fields: {
    sku: text({
      label: 'SKU',
      isIndexed: 'unique',
      validation: { isRequired: true },
      db: { isNullable: false },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      }
    }),
    product: relationship({
      ref: 'Product',
      ui: {
        hideCreate: true,
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    variant: relationship({
      ref: 'ProductVariant.sku',
      ui: {
        hideCreate: true,
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    status: select({
      options: [
        { label: 'In Stock', value: 'IS' },
        { label: 'Out of Stock', value: 'OS' },
      ],
      defaultValue: 'OS',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    stock: integer({
      validation: { isRequired: true },
      defaultValue: 0,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
      }
    }),
    virtualStock: virtual({
      label: 'Stock',
      field: graphql.field({
        type: graphql.Int,
        async resolve(item) {
          let stock = item as any;
          let stockQuantity = 0;
          await firebase.database().ref().child("stock").child(stock.sku).get().then((snapshot: { exists: () => any; val: () => any; }) => {
            if (snapshot.exists()) {
              stockQuantity = snapshot.val();
            }
          }).catch((error: any) => {
            console.error(error);
          });
          return stockQuantity ? stockQuantity : 0;
        },
      }),
      ui: {
        createView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
      }
    }),
    inboundStock: relationship({
      ref: 'InboundStock.sku',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['title'],
        inlineCreate: { fields: ['stockQuantity', 'dateOfPurchase'] },
        inlineConnect: false,
        linkToItem: true,
        removeMode: 'none',
      }
    }),
    outboundStock: relationship({
      ref: 'OutboundStock.sku',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      }
    }),
    inventoryLocation: text({
      validation: { isRequired: true }
    }),
    vendor: relationship({
      ref: 'Vendor.skus',
      many: false,
    }),
    subscribedCustomers: relationship({ 
      ref: 'Customer.skuSubscriptions', 
      many: true,
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
      const { stock } = resolvedData;
      resolvedData.status = stock > 0 ? 'IS' : 'OS';
      return resolvedData;
    },
    afterOperation: async ({ operation, inputData, item, context }) => {
      const stock = item as any;
      const stockInput = inputData as any;
      if (operation == 'update') {
        if (stockInput.stock == undefined) {
          const s = await context.query.Stock.findOne({
            where: { id: stock.id },
            query: 'inboundStock { stockQuantity } outboundStock { stockQuantity }'
          }) as any;
          if (Array.isArray(s.inboundStock) && Array.isArray(s.outboundStock)) {
            let newStock = s.inboundStock.map((v: { stockQuantity: any; }) => v.stockQuantity).reduce((partialSum: any, a: any) => partialSum + a, 0) + s.outboundStock.map((v: { stockQuantity: any; }) => v.stockQuantity).reduce((partialSum: any, a: any) => partialSum + a, 0);
            await context.db.Stock.updateOne({
              where: { id: stock.id },
              data: {
                stock: newStock
              }
            });
            await firebase.database().ref().child("stock").child(stock.sku).set(newStock);
          }
        }
      }
    }
  }
});