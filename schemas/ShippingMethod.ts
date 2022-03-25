import { integer, relationship, text, timestamp, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const ShippingMethod = list({
  ui: {
    listView: {
      initialColumns: ['name', 'method', 'zones', 'formula'],
      initialSort: {
        field: 'name',
        direction: 'DESC'
      }
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    method: text({ validation: { isRequired: true } }),
    zones: relationship({
      ref: 'ShippingZone.methods',
      many: true
    }),
    expectedDeliveryText: text(),
    formula: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          let formula = '';
          let method = item as any;
          if (method.baseCost && method.baseCost != 0) {
            formula = `₹${method.baseCost} + `;
          }
          formula += `₹${method.charge} per ${method.perEachKg} kg`;
          if (method.overKg && method.overKg != 0) {
            formula += ` over ${method.overKg} kg`;
          }
          return formula;
        },
      }),
    }),
    baseCost: integer({ validation: { isRequired: true } }),
    charge: integer({ validation: { isRequired: true } }),
    perEachKg: integer({ validation: { isRequired: true } }),
    overKg: integer({ validation: { isRequired: true } }),
  },
});