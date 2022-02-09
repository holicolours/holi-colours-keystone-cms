import 'dotenv/config';
import { createAuth } from '@keystone-6/auth';
import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import { permissionsList } from './schemas/fields';
import { Role } from './schemas/Role';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { CartItem } from './schemas/CartItem';
import { ProductImage } from './schemas/ProductImage';
import { Category } from './schemas/Category';
import { Product } from './schemas/Product';
import { ProductOption } from './schemas/ProductOption';
import { ProductOptionName } from './schemas/ProductOptionName';
import { ProductOptionValue } from './schemas/ProductOptionValue';
import { ProductVariant } from './schemas/ProductVariant';
import { Stock } from './schemas/Stock';
import { Vendor } from './schemas/Vendor';
import { Discount } from './schemas/Discount';
import { DiscountCondition } from './schemas/DiscountCondition';
import { DiscountAction } from './schemas/DiscountAction';
import { User } from './schemas/User';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';

const databaseProvider = process.env.DATABASE_PROVIDER || 'sqlite';
const databaseURL = process.env.DATABASE_URL || 'file:./keystone.db';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long they stay signed in?
  secret: process.env.COOKIE_SECRET || 'this secret should only be used in testing',
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in inital roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      // send the email
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
  sessionData: `id name email role { ${permissionsList.join(' ')} }`,
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL!],
        credentials: true,
      },
    },
    db: {
      provider: 'postgresql',
      url: databaseURL,
      async onConnect(context) {
        console.log('Connected to the database!');
      },
    },
    lists: {
      // Schema items go in here
      User,
      Category,
      Product,
      ProductOption,
      ProductOptionName,
      ProductOptionValue,
      ProductVariant,
      ProductImage,
      Stock,
      Vendor,
      CartItem,
      OrderItem,
      Order,
      Discount,
      DiscountCondition,
      DiscountAction,
      Role,
    },
    extendGraphqlSchema,
    ui: {
      // Show the UI only for poeple who pass this test
      isAccessAllowed: ({ session }) => !!session,
    },
    session: statelessSessions(sessionConfig),
  })
);