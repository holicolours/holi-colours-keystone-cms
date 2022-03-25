import { integer, relationship } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const DiscountCondition = list({
  ui: {
    isHidden: true,
  },
  fields: {
    minimumItemsPerOrder: integer({ validation: { isRequired: true }, defaultValue: 1 }),
    productsIsIn: relationship({ 
      ref: 'Product',
      many: true,
      ui: {
        hideCreate: true
      }
    }),
  },
});