import { text, relationship, timestamp, float } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';

export const Sale = list({
  ui: {
    labelField: 'saleCode'
  },
  fields: {
    saleCode: text({ validation: { isRequired: true } }),
    startDate: timestamp({ validation: { isRequired: true } }),
    endDate: timestamp({ validation: { isRequired: true } }),
    productsIsIn: relationship({ 
      ref: 'Product',
      many: true,
      ui: {
        hideCreate: true
      }
    }),
    discountPercentage: float({ validation: { isRequired: true }, defaultValue: 0 }),
  },
  hooks: {
    validateInput: async ({
      resolvedData,
      addValidationError,
    }) => {
      const { saleCode } = resolvedData;
      if (saleCode) {
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (format.test(saleCode)) {
          addValidationError('Sale code can\'t contain special charecters!');
        }
      }
    },
  },
});