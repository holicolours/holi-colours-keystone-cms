import { list } from '@keystone-6/core';
import { text } from '@keystone-6/core/fields';

export const EmbedLink = list({
  ui: {
    isHidden: true,
  },
  fields: {
    embedLink: text({
      validation: { isRequired: true }
    }),
  },
});