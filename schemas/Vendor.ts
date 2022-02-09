import { relationship, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const Vendor = list({
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
    name: text({ validation: { isRequired: true } }),
    mobileNumber: text({ validation: { isRequired: false } }),
    address: text({ ui: { displayMode: 'textarea'} }),
    products: relationship( { ref: 'Product.vendor', many: true })
  },
});