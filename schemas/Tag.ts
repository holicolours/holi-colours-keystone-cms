import { text, relationship } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';

export const Tag = list({
  ui: {
    isHidden: true,
    labelField: 'tag',
  },
  fields: {
    products: relationship({
      ref: 'Product.tags',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' }
      }
    }),
    tag: text({
      validation: {
        isRequired: true,
      },
      isIndexed: 'unique'
    }),
  },
  hooks: {
    validateInput: async ({
      resolvedData,
      addValidationError,
    }) => {
      const { tag } = resolvedData;
      if (tag) {
        var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (format.test(tag)) {
          addValidationError('Tag can\'t contain spaces and special charecters!');
        }
      }
    },
  },
});