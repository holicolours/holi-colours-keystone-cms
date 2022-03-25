import { relationship, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const Vendor = list({
  fields: {
    name: text({ validation: { isRequired: true } }),
    mobileNumber: text({ validation: { isRequired: false } }),
    address: text({ ui: { displayMode: 'textarea'} }),
    skus: relationship( { 
      ref: 'Stock.vendor', 
      many: true,
      label: 'SKUs',
      ui: {
        createView: { fieldMode: 'hidden' },
      }
    })
  },
});