import { text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const ProductOptionName = list({
  ui: {
    labelField: 'optionName',
    isHidden: true,
  },
  fields: {
    optionName: text({ validation: { isRequired: true } }),
  },
});