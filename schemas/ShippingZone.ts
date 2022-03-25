import { integer, relationship, text, timestamp, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const ShippingZone = list({
  ui: {
    listView: {
      initialColumns: ['name', 'country', 'state', 'methods'],
    },
  },
  fields: {
    name: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let zone = item as any;
          return `${zone.countryCode}:${zone.stateCode}`;
        },
      }),
    }),
    country: text({ validation: { isRequired: true } }),
    countryCode: text({ validation: { isRequired: true } }),
    state: text({ validation: { isRequired: true } }),
    stateCode: text({ validation: { isRequired: true } }),
    methods: relationship({
      ref: 'ShippingMethod.zones',
      many: true
    }),
  },
});