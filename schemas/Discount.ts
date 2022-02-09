import { text, relationship, timestamp, select, integer } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { rules, isSignedIn } from '../access';

export const Discount = list({
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
    ui: {
        labelField: 'couponCode'
    },
    fields: {
        couponCode: text({ validation: { isRequired: true } }),
        startDate: timestamp({ validation: { isRequired: true } }),
        endDate: timestamp({ validation: { isRequired: true } }),
        discountCondition: relationship({ 
            ref: 'DiscountCondition',
            ui: {
                displayMode: 'cards',
                cardFields: ['minimumItemsPerOrder', 'productsIsIn'],
                inlineCreate: { fields: ['minimumItemsPerOrder', 'productsIsIn'] },
                inlineEdit: { fields: ['minimumItemsPerOrder', 'productsIsIn'] },
                inlineConnect: false,
                linkToItem: false
            },
            many: false
        }),
        discountAction:  relationship({
            ref: 'DiscountAction',
            ui: {
                displayMode: 'cards',
                cardFields: ['discountAmount', 'discountPercentage', 'freeShipping', 'isSale', 'freebieProducts'],
                inlineCreate: { fields: ['discountAmount', 'discountPercentage', 'freeShipping', 'isSale', 'freebieProducts'] },
                inlineEdit: { fields: ['discountAmount', 'discountPercentage', 'freeShipping', 'isSale', 'freebieProducts'] },
                inlineConnect: false,
                linkToItem: false
            },
            many: false
        }),
        offerText: text({ validation: { isRequired: true } }),
    },
});