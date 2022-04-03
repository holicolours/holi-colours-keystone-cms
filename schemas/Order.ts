import { integer, text, relationship, virtual, select, timestamp, json } from '@keystone-6/core/fields';
import { list, graphql } from '@keystone-6/core';
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

const statuses: any = {
  'PP': {
    name: 'Pending payment',
    color: 'gray',
    sendNotificationOnChange: false
  },
  'PF': {
    name: 'Payment failed',
    color: 'red',
    sendNotificationOnChange: false
  },
  'OH': {
    name: 'On hold',
    color: 'yellow',
    sendNotificationOnChange: true,
    emailSubject: 'Your Holi Colours Jewellery order has been put on hold!',
    emailHeader: 'Your order is on hold',
    emailContent: 'Your order details are shown below for your reference.',
    emailAdditionalContent: 'We look forward to fulfilling your order soon.'
  },
  'PR': {
    name: 'Processing',
    color: 'green',
    sendNotificationOnChange: true,
    emailSubject: 'Your Holi Colours Jewellery order has been received!',
    emailHeader: 'Thank you for your order',
    emailContent: 'Your order has been received and is now being processed. Your order details are shown below for your reference.',
    emailAdditionalContent: 'Thanks for shopping with us.'
  },
  'DI': {
    name: 'Dispatched',
    color: 'blue',
    sendNotificationOnChange: true,
    emailSubject: 'Your Holi Colours Jewellery order has been dispatched!',
    emailHeader: 'Your order has been dispatched',
    emailContent: 'We have dispatched your order. Your order details are shown below for your reference.',
    emailAdditionalContent: 'Thanks for shopping with us.'
  },
  'CO': {
    name: 'Completed',
    color: 'gray',
    sendNotificationOnChange: true,
    emailSubject: 'Your Holi Colours Jewellery order is now complete',
    emailHeader: 'Thanks for shopping with us',
    emailContent: 'We have finished processing your order. Your order details are shown below for your reference.',
    emailAdditionalContent: 'Thanks for shopping with us.'
  },
  'CA': {
    name: 'Cancelled',
    color: 'gray',
    sendNotificationOnChange: true,
    emailSubject: 'Your Holi Colours Jewellery order has been cancelled',
    emailHeader: 'Your order has been cancelled',
    emailContent: 'Your order details are shown below for your reference.',
    emailAdditionalContent: 'Thanks for reading.'
  }
}

const uiHidden = 'hidden';
const uiReadOnly = 'read';

export const Order = list({
  ui: {
    labelField: 'orderNumber',
    listView: {
      initialColumns: ['orderNumber', 'orderDate', 'status', 'totalINR', 'customerFirstName'],
      initialSort: {
        field: 'orderNumber',
        direction: 'DESC'
      },
      pageSize: 10
    },
    hideCreate: true,
    hideDelete: true,
  },
  fields: {
    orderNumber: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
      db: { isNullable: false },
      ui: { itemView: { fieldMode: uiReadOnly } }
    }),
    orderDate: timestamp({
      ui: {
        itemView: { fieldMode: uiReadOnly }
      }
    }),
    status: select({
      options: [
        { label: 'Pending payment', value: 'PP' },
        { label: 'Payment failed', value: 'PF' },
        { label: 'On hold', value: 'OH' },
        { label: 'Processing', value: 'PR' },
        { label: 'Dispatched', value: 'DI' },
        { label: 'Completed', value: 'CO' },
        { label: 'Cancelled', value: 'CA' },
      ],
      defaultValue: 'PP',
      ui: {
        displayMode: 'select',
        createView: { fieldMode: 'hidden' },
      },
    }),
    items: relationship({
      ref: 'OrderItem.order',
      many: true,
      ui: {
        hideCreate: true,
        displayMode: 'select',
        itemView: { fieldMode: uiReadOnly }
      }
    }),
    subTotal: integer({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    subTotalINR: virtual({
      label: 'Subtotal',
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let order = item as any;
          return '₹' + order.subTotal;
        },
      }),
    }),
    shippingMethod: text({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    shippingCharge: integer({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    shipping: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let order = item as any;
          return '₹' + order.shippingCharge + ' (' + order.shippingMethod + ')';
        },
      }),
    }),
    discount: integer({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    discountINR: virtual({
      label: 'Discount',
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let order = item as any;
          return '₹' + order.discount;
        },
      }),
    }),
    total: integer({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
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
    customer: relationship({
      ref: 'Customer.orders',
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    customerFirstName: text({
      ui: { itemView: { fieldMode: uiHidden } }
    }),
    customerLastName: text({
      ui: { itemView: { fieldMode: uiHidden } }
    }),
    customerName: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let order = item as any;
          return order.customerFirstName + " " + order.customerLastName;
        },
      }),
    }),
    customerEmail: text({
      ui: { itemView: { fieldMode: uiReadOnly } }
    }),
    customerPhoneNumber: text({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    customerAlternatePhoneNumber: text({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    customerContact: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let order = item as any;
          let contact = order.customerPhoneNumber;
          if (order.customerAlternatePhoneNumber) {
            contact += '/' + order.customerAlternatePhoneNumber;
          }
          return contact;
        },
      }),
    }),
    shipToAddress1: text({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    shipToAddress2: text({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    shipToCity: text({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    shipToState: text({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    shipToCountry: text({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    shipToPostalCode: text({
      ui: {
        itemView: { fieldMode: uiHidden }
      }
    }),
    shipToAddress: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let order = item as any;
          let address = order.shipToAddress1
            + ", "
            + order.shipToAddress2
            + ', '
            + order.shipToCity
            + ' - '
            + order.shipToPostalCode
            + ', '
            + order.shipToState
            + ', '
            + order.shipToCountry;
          return address;
        },
      }),
    }),
    notes: relationship({
      ref: 'OrderNote.order',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['note', 'date'],
        inlineCreate: { fields: ['note'] },
        inlineConnect: false,
        linkToItem: true
      }
    }),
    orderJSON: json({
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
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
      if (operation == 'create') {
        resolvedData.orderDate = new Date().toISOString();
      }
      return resolvedData;
    },
    afterOperation: async ({ operation, item, originalItem, context }) => {
      let orderInput = item as any;
      let originalOrder = originalItem as any;
      let order = orderInput.orderJSON;

      console.log('Status: ' + originalOrder.status + ' => ' + orderInput.status);

      if (order && originalOrder.status != orderInput.status && statuses[orderInput.status].sendNotificationOnChange) {
        const mailClient = createMailClient();
        const orderConfirmationEmail = new email();

        let orderConfirmationHtmlMessage = await orderConfirmationEmail
          .render('order/html', {
            orderId: orderInput.orderNumber,
            order: order,
            creationDate: orderInput.orderDate,
            header: statuses[orderInput.status].emailHeader,
            content: statuses[orderInput.status].emailContent,
            additionalContent: statuses[orderInput.status].emailAdditionalContent
          })
          .then((data: any) => {
            return data;
          })
          .catch(console.error);

        const orderConfirmationEmailResponse = await mailClient.sendMail({
          from: '"Holi Colours Jewellery" <holicoloursit@gmail.com>',
          to: `${order.customer.firstName} ${order.customer.lastName} <${order.customer.email}>`,
          subject: statuses[orderInput.status].emailSubject,
          html: orderConfirmationHtmlMessage
        });

        console.log(orderConfirmationEmailResponse);
      }

      // if (order && Array.isArray(order.cart.products) && order.cart.products.length > 0) {
      //   let variants = await context.db.ProductVariant.findMany({
      //     where: {
      //       id: { in: order.cart.products.map((v: { vid: any; }) => v.vid) }
      //     }
      //   }) as any;
      //   // console.log(variants);
      //   let orderItems = await context.query.OrderItem.findMany({
      //     where: { order: { orderNumber: { equals: orderInput.orderNumber } } },
      //     query: ' id sku { variant { id } }'
      //   }) as any;
      //   console.log(JSON.stringify(orderItems));
      //   let updateData: { where: { id: any; }; data: { image: any; }; }[] = [];
      //   await orderItems.forEach((oI: any) => {
      //     variants.some((v: any) => {
      //       if (oI.sku && oI.sku.variant.id == v.id) {
      //         updateData.push({
      //           where: { id: oI.id },
      //           data: {
      //             image: v.image
      //           }
      //         });
      //         return true;
      //       }
      //       return false;
      //     });
      //   });
      //   console.log(updateData);
      //   await context.db.OrderItem.updateMany({
      //     data: updateData
      //   });
      // }
    }
  },
});