import { text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const ProductOptionValue = list({
  ui: {
    labelField: 'optionValue',
    isHidden: true,
  },
  fields: {
    optionValue: text({ validation: { isRequired: true } }),
  },
});