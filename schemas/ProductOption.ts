import { relationship, text, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';
import { rules, isSignedIn, permissions } from '../access';

export const ProductOption = list({
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
          optionlabel = context.query.ProductOption.findOne({
            where: { id: option.id },
            query: 'id optionName { optionName } optionValues { optionValue }'
          }).then((value) => {
            return value.optionName.optionName + ' (' + value.optionValues.map((v: { optionValue: any; }) => v.optionValue).join(", ") + ')';
          }) as any;
          return optionlabel;
        },
      }),
    }),
    product: relationship({
      ref: 'Product.options',
      // ui: {
      //   hideCreate: true,
      //   itemView: { fieldMode: 'read' }
      // }
    }),
    // optionName: text(),
    // optionValues: text(),
    optionName: relationship({
      ref: 'ProductOptionName',
    }),
    optionValues: relationship({
      ref: 'ProductOptionValue',
      many: true
    }),
  },
});