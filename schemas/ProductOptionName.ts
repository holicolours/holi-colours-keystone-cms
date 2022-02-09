import { text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const ProductOptionName = list({
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
    labelField: 'optionName',
  //   isHidden: true,
  //   listView: {
  //     initialColumns: ['title', 'image', 'regularPrice', 'enabled'],
    // },
  },
  fields: {
    optionName: text({ validation: { isRequired: true } }),
  },
});