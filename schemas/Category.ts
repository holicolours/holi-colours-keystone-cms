import { text, relationship, checkbox, timestamp } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import { list } from '@keystone-6/core';
var slugify = require('slugify');

export const Category = list({
  ui: {
    listView: {
      initialColumns: ['name', 'parentCategories', 'childCategories'],
      pageSize: 10,
    },
  },
  fields: {
    name: text({
      validation: {
        isRequired: true,
      },
      isIndexed: 'unique'
    }),
    slug: text({
      isIndexed: 'unique',
      ui: {
        createView: {
          fieldMode: 'hidden'
        },
        itemView: {
          fieldMode: 'hidden'
        }
      }
    }),
    parentCategories: relationship({ ref: 'Category.childCategories', many: true }),
    childCategories: relationship({ ref: 'Category.parentCategories', many: true }),
    featureInHomePage: checkbox({
      defaultValue: false,
    }),
    products: relationship({
      ref: 'Product.categories',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' }
      }
    }),
    additionalInformation: document({
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
          superscript: true,
          subscript: true,
        },
        listTypes: true,
        alignment: true,
        headingLevels: [1, 2, 3, 4, 5, 6],
        blockTypes: {
          blockquote: true,
        },
        softBreaks: true,
      },
      links: true,
      dividers: true,
      label: 'Additional Information',
      ui: {
        createView: { fieldMode: 'hidden' },
      }
    }),
    creationDate: timestamp({
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      }
    }),
    lastUpdatedDate: timestamp({
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      }
    }),
  },
  hooks: {
    resolveInput: async ({
      listKey,
      operation,
      inputData,
      item,
      resolvedData,
      context,
    }) => {
      const { name } = resolvedData;
      if (operation == 'create') {
        resolvedData.creationDate = new Date().toISOString();
      }
      if (operation == 'create' || operation == 'update') {
        if (name) {
          resolvedData.slug = slugify(name.toLowerCase());
        }
        resolvedData.lastUpdatedDate = new Date().toISOString();
      }
      return resolvedData;
    },
    validateInput: async ({
      resolvedData,
      addValidationError,
    }) => {
      const { name } = resolvedData;
      if (name) {
        let format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (format.test(name)) {
          addValidationError('Category name can\'t contain special charecters!');
        }
      }
    },
  },
});