import { text, relationship } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const Category = list({
    access: {
        operation: {
            create: isSignedIn,
        },
        filter: {
            query: rules.canReadProducts,
            update: rules.canManageProducts,
            delete: rules.canManageProducts,
        },
    },
    fields: {
        // TODO: Custom Label in here
        name: text({ validation: { isRequired: true } }),
        parentCategories: relationship({ ref: 'Category.childCategories', many: true }),
        childCategories: relationship({ ref: 'Category.parentCategories', many: true }),
        products: relationship({ ref: 'Product', many: true })
    },
});