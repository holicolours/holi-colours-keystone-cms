import { integer, text, relationship, virtual, select, timestamp, json } from '@keystone-6/core/fields';
import { list, graphql } from '@keystone-6/core';

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
    cartJSON: json({
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
  },
});