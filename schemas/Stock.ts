import { integer, relationship, select, text, timestamp, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';
var firebase = require('firebase-admin');
const nodemailer = require("nodemailer");
const email = require('email-templates');

function createMailClient() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, //587,
    secure: true, // true for 465, false for other ports
    auth: {
      type: 'OAuth2',
      user: "holicoloursit@gmail.com",
      clientId: "423060301267-s6n8tr6hqo5j0cc8eglcdrvucth6tp50.apps.googleusercontent.com",
      clientSecret: "06pMsRcPf8hx46E5hLTtpix5",
      refreshToken: "1//0gMkZK7iqoeJGCgYIARAAGBASNwF-L9Ir4nttI8NZCe5EWcmH_ev1CfGiO1M85-Bru9LP54BM_lwa7idlW3oZDtwy1S4j7w2zRqw",
    }
  });
}

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
      },
      pageSize: 10
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
    inventoryLocation: text({}),
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
      console.log(stockInput.stock);
      if (operation == 'update') {
        let s;
        if (!isNaN(stockInput.stock) || stockInput.inboundStock || stockInput.outboundStock) {
          s = await context.query.Stock.findOne({
            where: { id: stock.id },
            query: 'product { name } variant { title } inboundStock { stockQuantity } outboundStock { stockQuantity } stock'
          }) as any;
        }
        if (stockInput.stock == undefined && (stockInput.inboundStock || stockInput.outboundStock)) {
          if (Array.isArray(s.inboundStock) && Array.isArray(s.outboundStock)) {
            let newStock = s.inboundStock.map((v: { stockQuantity: any; }) => v.stockQuantity).reduce((partialSum: any, a: any) => partialSum + a, 0) + s.outboundStock.map((v: { stockQuantity: any; }) => v.stockQuantity).reduce((partialSum: any, a: any) => partialSum + a, 0);
            if (!isNaN(newStock) && newStock != s.stock) {
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

        if (!isNaN(stockInput.stock)) {
          const mailClient = createMailClient();

          let lowStockThreshold = 2;

          if (stockInput.stock <= lowStockThreshold && stockInput.stock > 0 && stockInput.stock < s.stock) {
            const lowStockEmail = new email();

            let lowStockHtmlMessage = await lowStockEmail
              .render('stock_low/html', {
                lowStockThreshold: lowStockThreshold,
                sku: stock.sku,
                productName: s.product.name,
                variant: s.variant.title,
                stock: stockInput.stock,
              })
              .then((data: any) => {
                return data;
              })
              .catch(console.error);

            const lowStockEmailResponse = await mailClient.sendMail({
              from: '"Holi Colours Jewellery" <holicoloursit@gmail.com>',
              to: `"Holi Colours Jewellery" <holicoloursit@gmail.com>`,
              subject: 'Low Stock Notification',
              html: lowStockHtmlMessage
            });

            console.log(lowStockEmailResponse);
          }
          if (stockInput.stock <= 0) {
            const outOfStockEmail = new email();

            let outOfStockHtmlMessage = await outOfStockEmail
              .render('stock_empty/html', {
                sku: stock.sku,
                productName: s.product.name,
                variant: s.variant.title,
                stock: stockInput.stock,
              })
              .then((data: any) => {
                return data;
              })
              .catch(console.error);

            const outOfStockEmailResponse = await mailClient.sendMail({
              from: '"Holi Colours Jewellery" <holicoloursit@gmail.com>',
              to: `"Holi Colours Jewellery" <holicoloursit@gmail.com>`,
              subject: 'Out of Stock Notification',
              html: outOfStockHtmlMessage
            });

            console.log(outOfStockEmailResponse);
          }
        }
      }
    }
  }
});