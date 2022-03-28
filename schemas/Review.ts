import { checkbox, image, integer, relationship, select, text, timestamp, virtual } from '@keystone-6/core/fields';
import { graphql, list } from '@keystone-6/core';

export const Review = list({
  ui: {
    listView: {
      initialColumns: ['title', 'rating', 'product', 'customerName', 'createdOn'],
      initialSort: {
        field: 'createdOn',
        direction: 'DESC'
      },
      pageSize: 10,
    },
  },
  fields: {
    product: relationship({
      ref: 'Product.reviews',
      ui: {
        itemView: { fieldMode: 'read' },
      }
    }),
    title: text({ validation: { isRequired: true } }),
    message: text({
      validation: { isRequired: true },
      ui: {
        displayMode: 'textarea'
      }
    }),
    rating: select({
      options: [
        { label: 'One Star', value: '1' },
        { label: 'Two Star', value: '2' },
        { label: 'Three Star', value: '3' },
        { label: 'Four Star', value: '4' },
        { label: 'Five Star', value: '5' },
      ],
      ui: {
        displayMode: 'select',
      },
    }),
    images: relationship({
      ref: 'Image',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['image'],
        inlineCreate: { fields: ['image'] },
        inlineEdit: { fields: ['image'] },
        inlineConnect: false,
        linkToItem: false
      }
    }),
    videoEmbedLinks: relationship({
      ref: 'EmbedLink',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['embedLink'],
        inlineCreate: { fields: ['embedLink'] },
        inlineEdit: { fields: ['embedLink'] },
        inlineConnect: false,
        linkToItem: false
      }
    }),
    customerName: text({ validation: { isRequired: true } }),
    customerEmail: relationship({
      ref: 'Customer.reviews',
    }),
    isCelebrityReview: checkbox({
      defaultValue: false,
    }),
    featureInHomePage: checkbox({
      defaultValue: false,
    }),
    createdOn: timestamp({
      ui: {
        itemView: { fieldMode: 'read' }
      }
    }),
  },
});