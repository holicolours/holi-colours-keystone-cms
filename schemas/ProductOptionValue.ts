import { text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const ProductOptionValue = list({
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
  ui: {
    labelField: 'optionValue',
  //   isHidden: true,
  //   listView: {
  //     initialColumns: ['title', 'image', 'regularPrice', 'enabled'],
  //   },
  },
  fields: {
    optionValue: text({ validation: { isRequired: true } }),
  },
});