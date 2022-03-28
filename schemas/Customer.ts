import { text, relationship, virtual, checkbox, select } from '@keystone-6/core/fields';
import { list, graphql } from '@keystone-6/core';
import { isSignedIn, rules } from '../access';

const uiHidden = 'hidden';
const uiReadOnly = 'read';

export const Customer = list({
  ui: {
    labelField: 'email',
    listView: {
      initialColumns: ['firstName', 'lastName', 'email', 'phoneNumber'],
      pageSize: 10,
    },
  },
  fields: {
    uid: text({
      ui: {
        createView: { fieldMode: uiHidden },
        itemView: { fieldMode: uiHidden },
        listView: { fieldMode: uiHidden } 
      }
    }),
    firstName: text({
      ui: { itemView: { fieldMode: uiReadOnly } }
    }),
    lastName: text({
      ui: { itemView: { fieldMode: uiReadOnly } }
    }),
    email: text({
      ui: { itemView: { fieldMode: uiReadOnly } }
    }),
    status: select({
      options: [
        { label: 'Registered User', value: 'R' },
        { label: 'Guest User', value: 'G' },
      ],
      defaultValue: 'G',
      ui: {
        displayMode: 'segmented-control',
        itemView: { fieldMode: uiReadOnly },
      },
    }),
    phoneNumber: text({
      ui: { itemView: { fieldMode: uiReadOnly } }
    }),
    alternatePhoneNumber: text({
      ui: { itemView: { fieldMode: uiReadOnly } }
    }),
    shipToAddress: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let customer = item as any;
          let address = customer.shipToAddress1
            + ", "
            + customer.shipToAddress2
            + ', '
            + customer.shipToCity
            + ' - '
            + customer.shipToPostalCode
            + ', '
            + customer.shipToState
            + ', '
            + customer.shipToCountry;
          return address;
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
    skuSubscriptions: relationship({ 
      ref: 'Stock.subscribedCustomers', 
      many: true,
      label: 'SKU Subscriptions',
    }),
    orders: relationship({ ref: 'Order.customer', many: true }),
    reviews: relationship({ ref: 'Review.customerEmail', many: true }),
  },
});