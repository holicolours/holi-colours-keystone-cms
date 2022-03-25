import { integer, relationship, select } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const DiscountAction = list({
  ui: {
    isHidden: true,
  },
  fields: {
    discountAmount: integer(),
    discountPercentage: integer(),
    freeShipping: select({
      options: [
        { label: 'Yes', value: 'YES' },
        { label: 'No', value: 'NO' },
      ],
      defaultValue: 'NO',
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    isSale: select({
      options: [
        { label: 'Yes', value: 'YES' },
        { label: 'No', value: 'NO' },
      ],
      defaultValue: 'NO',
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    freebieProducts: relationship({ 
      ref: 'Product',
      many: true,
      ui: {
        hideCreate: true
      }
    }),
  },
});