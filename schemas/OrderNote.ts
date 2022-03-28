import { integer, text, relationship, timestamp } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';

export const OrderNote = list({
  ui: {
    isHidden: true,
    labelField: 'note',
    listView: {
      initialColumns: ['note', 'date'],
      pageSize: 10,
    },
  },
  fields: {
    order: relationship({
      ref: 'Order.notes',
      ui: {
        itemView: { fieldMode: 'read' }
      }
    }),
    note: text({ 
      validation: { isRequired: true },
      ui: {
        itemView: { fieldMode: 'read' }
      } 
    }),
    date: timestamp({
      ui: {
        itemView: { fieldMode: 'read' }
      }
    }),
  },
});