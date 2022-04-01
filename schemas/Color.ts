import { list } from '@keystone-6/core';
import { text } from '@keystone-6/core/fields';

export const Color = list({
  ui: {
    isHidden: true,
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
      },
      isIndexed: 'unique'
    }),
    hexColor: text({
      label: 'HEX Color',
      validation: {
        isRequired: true,
      },
      isIndexed: 'unique'
    }),
  },
});