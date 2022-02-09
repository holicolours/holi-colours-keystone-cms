import { relationship } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const ProductOption = list({
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
  // ui: {
  // labelField: 'optionName',
  //   isHidden: true,
  //   listView: {
  //     initialColumns: ['title', 'image', 'regularPrice', 'enabled'],
  //   },
  // },
  fields: {
    product: relationship({
      ref: 'Product.options',
      ui: {
        // hideCreate: true,
        // itemView: { fieldMode: 'read'}
      }
    }),
    optionName: relationship({
      ref: 'ProductOptionName',
    }),
    optionValues: relationship({
      ref: 'ProductOptionValue',
      many: true
    }),
  },
  hooks: {
    resolveInput: async ({
      listKey,
      operation,
      inputData,
      item,
      resolvedData,
      context,
    }) => {
      console.log(resolvedData);
      return resolvedData;
    },
  },
});