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
    fields: {
        // TODO: Custom Label in here
        couponCode: text({ validation: { isRequired: true } }),
        startDate: timestamp({ validation: { isRequired: true } }),
        endDate: timestamp({ validation: { isRequired: true } }),
        couponType: select({
            options: [
                { label: 'Sale', value: 'SALE' },
                { label: 'Offer', value: 'OFFER' },
            ],
            ui: {
                displayMode: 'segmented-control',
            },
        }),
        discountProducts: relationship({ ref: 'Product', many: true }),
        discountPercentage: integer({ validation: { isRequired: true }}),
        minItemsPerOrder: integer({ validation: { isRequired: true }}),
        discountAmount: integer({ validation: { isRequired: true }}),
        freebieProducts: relationship({ ref: 'Product', many: true }),
        offerText: text({ validation: { isRequired: true } }),
    },
});