import { text, relationship, timestamp, select, integer } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const Discount = list({
  ui: {
    labelField: 'couponCode'
  },
  fields: {
    couponCode: text({ validation: { isRequired: true } }),
    startDate: timestamp({ validation: { isRequired: true } }),
    endDate: timestamp({ validation: { isRequired: true } }),
    discountCondition: relationship({
      ref: 'DiscountCondition',
      many: false,
      ui: {
        displayMode: 'cards',
        cardFields: ['minimumItemsPerOrder', 'productsIsIn'],
        inlineCreate: { fields: ['minimumItemsPerOrder', 'productsIsIn'] },
        inlineEdit: { fields: ['minimumItemsPerOrder', 'productsIsIn'] },
        inlineConnect: false,
        linkToItem: false
      },
    }),
    discountAction: relationship({
      ref: 'DiscountAction',
      many: false,
      ui: {
        displayMode: 'cards',
        cardFields: ['discountAmount', 'discountPercentage', 'freeShipping', 'isSale', 'freebieProducts'],
        inlineCreate: { fields: ['discountAmount', 'discountPercentage', 'freeShipping', 'isSale', 'freebieProducts'] },
        inlineEdit: { fields: ['discountAmount', 'discountPercentage', 'freeShipping', 'isSale', 'freebieProducts'] },
        inlineConnect: false,
        linkToItem: false
      },
    }),
    offerText: text({ validation: { isRequired: true } }),
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