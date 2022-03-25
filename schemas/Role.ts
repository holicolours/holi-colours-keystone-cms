import { relationship, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { isSignedIn, permissions } from '../access';
import { permissionFields } from './fields';

export const Role = list({
  // access: {
  //   operation: {
  //     create: isSignedIn,
  //     query: permissions.canManageRoles,
  //     update: permissions.canManageRoles,
  //     delete: permissions.canManageRoles,
  //   },
  // },
  ui: {
    hideCreate: args => !permissions.canManageRoles(args),
    hideDelete: args => !permissions.canManageRoles(args),
    isHidden: true,
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    ...permissionFields,
    assignedTo: relationship({
      ref: 'User.role', // TODO: Add this to the User
      many: true,
      ui: {
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});