import { relationship, text, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';

export const VariantOption = list({
  ui: {
    labelField: 'option',
    isHidden: true,
  },
  fields: {
    option: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item, args, context) {
          let optionlabel = '';
          let option = item as any;
          optionlabel = context.query.VariantOption.findOne({
            where: { id: option.id },
            query: 'id optionName { optionName } optionValue { optionValue }'
          }).then((value) => {
            return value.optionName.optionName + ' (' + value.optionValue.optionValue + ')';
          }) as any;
          return optionlabel;
        },
      }),
    }),
    variant: relationship({
      ref: 'ProductVariant.options',
      ui: {
        hideCreate: true,
        itemView: { fieldMode: 'read' }
      }
    }),
    optionName: relationship({
      ref: 'ProductOptionName',
      ui: {
        hideCreate: true,
      }
    }),
    optionValue: relationship({
      ref: 'ProductOptionValue',
      ui: {
        hideCreate: true,
      }
    }),
  },
});