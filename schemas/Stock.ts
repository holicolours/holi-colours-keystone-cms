import { integer, relationship, timestamp } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const Stock = list({
  access: {
    operation: {
      create: isSignedIn,
    },
    filter: {
      query: rules.canReadProducts,
      update: rules.canManageProducts,
      delete: rules.canManageProducts,
    },
  },
  fields: {
    product: relationship({
      ref: 'Product',
      ui: {
        hideCreate: true,
        itemView: { fieldMode: 'read'}
      },
    }),
    variant: relationship({
      ref: 'ProductVariant.stock',
      ui: {
        hideCreate: true,
        itemView: { fieldMode: 'read'}
      },
    }),
    stockQuantity: integer({ validation: { isRequired: true } }),
    dateOfPurchase: timestamp({ validation: { isRequired: false } }),
  },
});