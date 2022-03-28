import { text, relationship, timestamp, select, integer, float } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';

export const Offer = list({
  ui: {
    labelField: 'couponCode'
  },
  fields: {
    couponCode: text({ validation: { isRequired: true } }),
    startDate: timestamp({ validation: { isRequired: true } }),
    endDate: timestamp({ validation: { isRequired: true } }),
    minimumItemsPerOrder: integer({ validation: { isRequired: true }, defaultValue: 1 }),
    discountAmount: float({ validation: { isRequired: true }, defaultValue: 0 }),
    freeShipping: select({
      options: [
        { label: 'Yes', value: 'Y' },
        { label: 'No', value: 'N' },
      ],
      defaultValue: 'N',
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
    offerText: text({ validation: { isRequired: true } }),
    offerImage: relationship({
      ref: 'Image',
      ui: {
        displayMode: 'cards',
        cardFields: ['image'],
        inlineCreate: { fields: ['image'] },
        inlineEdit: { fields: ['image'] },
        inlineConnect: false,
        linkToItem: false
      }
    }),
  },
  hooks: {
    validateInput: async ({
      resolvedData,
      addValidationError,
    }) => {
      const { couponCode } = resolvedData;
      if (couponCode) {
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (format.test(couponCode)) {
          addValidationError('Coupon code can\'t contain special charecters!');
        }
      }
    },
  },
});