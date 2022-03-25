import 'dotenv/config';
import { createAuth } from '@keystone-6/auth';
import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import { permissionsList } from './schemas/fields';
import { Role } from './schemas/Role';
import { Order } from './schemas/Order';
import { OrderItem } from './schemas/OrderItem';
import { OrderNote } from './schemas/OrderNote';
import { CartItem } from './schemas/CartItem';
import { ProductImage } from './schemas/ProductImage';
import { Category } from './schemas/Category';
import { Product } from './schemas/Product';
import { Image } from './schemas/Image';
import { Color } from './schemas/Color';
import { EmbedLink } from './schemas/EmbedLink';
import { Tag } from './schemas/Tag';
import { ProductOption } from './schemas/ProductOption';
import { ProductOptionName } from './schemas/ProductOptionName';
import { ProductOptionValue } from './schemas/ProductOptionValue';
import { ProductVariant } from './schemas/ProductVariant';
import { Accessory } from './schemas/Accessory';
import { Stock } from './schemas/Stock';
import { InboundStock } from './schemas/InboundStock';
import { OutboundStock } from './schemas/OutboundStock';
import { ShippingZone } from './schemas/ShippingZone';
import { ShippingMethod } from './schemas/ShippingMethod';
import { Vendor } from './schemas/Vendor';
import { Review } from './schemas/Review';
import { Discount } from './schemas/Discount';
import { DiscountCondition } from './schemas/DiscountCondition';
import { DiscountAction } from './schemas/DiscountAction';
import { User } from './schemas/User';
import { Customer } from './schemas/Customer';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations';
var firebase = require('firebase-admin');

const serviceAccount = {
  "type": "service_account",
  "project_id": "holi-colours-jewellery",
  "private_key_id": "a58823557e808ef91ec120c40c7e14354e6b18e7",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCqpsbWfiAZKZ47\nouOz4E4BJ1Zg4v2FbsfupZqiJFTbQZY2qPYFITnuVaFyrHZ8KtymgKi34+scsprk\nnG5Kx0KAqSALHNnAIp8xmB2ajmbSwGNY4t5sh+FpehYlP00FP/hYlqMNG+HCGczD\nbI75CUSOXW5O81Vy5tMTiSlDnNcSacXmZFctJ6wFN5gMRuR3Hb6na6NQGD9oRfzt\n0VnFfG+w8N8UIgt+7Onsuga5P+XDBeV2mGWGQE9qad6X6u74Hi4pdlBfnWwCz3O5\nCq7nh6FqMJqll5TxaRGC86RkqZ+Tg7GRwu0P738eh57lG5dbYS1yMg1aOMv4ChBK\nSs/sDK3TAgMBAAECggEAGyabviak/rvjZAOfjM/kOUTD9nhG88LTZoHMn31+TsAZ\noSqysdA+gk/3duI/m7PKFWek8FT/5Dn6cOL+nUEksIm4AmydrHcVsvNLynpbm65m\nYA8Aam4YDAsTmOuAWpR588ZLvNsxyQsHzBPqj27NDIWK9l66uqRE8vfAq/Q5N8F/\n2+aeEDytQpNQUHsCKCZ638TqWBdxPEVxMzCJ5UT/U2CaeX0Ejy1dWWmFc3z+FuXq\nDVLTlWAfI3tIaYWni+xMShQehMmPbN0+9Phls6YcuEbtlnneFGxm4x2EK28t3gHT\nUAKJ1/pvg+obx8Uodva4O3FqfVbV3euS6F11U/3ncQKBgQDaLvfLNlLhLM59k4j+\nA1KhxCLHrW39jpKtxW5N3AR6RPoVlJMq/6qBbKUrmXTWc3mVcHcqt2JlcNjw5Ruv\nAZ61GIivcrUoNIF7xgFNzuHmR41y2i58aES1escAJR9L2MhQi1oxwGbyavtomaei\ndG1jOGjfBUzWetHdKKWTU9rXyQKBgQDIOsN8KBBLGNHqxdnALCLV1EnpMBAwCG4c\ncW842KD4SPrK64YvOrzVlriksWXq2q6jE4m5Sw5qVzIc16jyliL1BKRzNmm4cLjF\nyPiRx/Ng+NvsEzaBfKInjWgAHyXtkMGVLUDjUTIweg6WvJBbbUUTXG/W1e7AtYe6\nC1GroWueuwKBgBqXDMXsSe99WXD+cPycBQ8H60Ewhq4XGRMqc4XzoWwRSfUlVUYx\nQGNjjUGiAxY7nn6y5SMElG5OcXHySgxrAx+I7OeM8D0FIR6ng/MqmmdJIxjzNCUf\nQ/hmDSicXZMNyWPfh892ZlV26krWJxLqY4ZrEoTTjYi6ESeF05//4TTZAoGAXxWY\n05Lq+d6VgRnnqBzNhiHD35rVdRnrwFIV8Tbeakmt30Mte6w3FG74zCz6KyciG4sh\nsf50oAc8Yvn+3wRxIU3NEnFajx3ogPRJJmF/sCM9vMP69E7Nal76bmRcTI6bf034\nLHrYjLDJ0MdG/kPLs8AH1EvPj3AlPjI13H1RcBUCgYAwCrBjqURfZ9Jd9+wFCFQS\ne7kHFQ0ITBn8pO1Zt604DRcn9GaRkLfo3IBuYbume5tvmebQ5yPgJMyaAEmOktim\nDJbPXnVx7WdaHniOKpFQ3xzCZZq6mFDsVflSeHvZ20cGpICZyuVVe6yLKtdf63yE\nMyUKkR2lMLusYGD4zqsc1w==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-anxtl@holi-colours-jewellery.iam.gserviceaccount.com",
  "client_id": "109764840705438007823",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-anxtl%40holi-colours-jewellery.iam.gserviceaccount.com"
};

let app;

const databaseProvider = process.env.DATABASE_PROVIDER || 'sqlite';
const databaseURL = process.env.DATABASE_URL || 'file:./keystone.db';
const provider = 'sqlite';

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
      useMigrations: true,
      async onConnect(context) {
        console.log('Connected to the database!');

        if (!firebase.apps.length) {
          app = await firebase.initializeApp({
            credential: firebase.credential.cert(serviceAccount),
            databaseURL: "https://holi-colours-jewellery-default-rtdb.asia-southeast1.firebasedatabase.app/"
          });
          console.log('Connected to the Firebase!');
        }

        var stockCountRef = firebase.database().ref('stock/1-1');
        stockCountRef.on('value', (snapshot: { val: () => any; }) => {
          const data = snapshot.val();
          console.log('Updated Stock: ' + data);
        });
      },
    },
    lists: {
      // Schema items go in here
      User,
      Category,
      Tag,
      Image,
      Color,
      EmbedLink,
      Product,
      ProductOption,
      ProductOptionName,
      ProductOptionValue,
      ProductVariant,
      ProductImage,
      Accessory,
      Stock,
      InboundStock,
      OutboundStock,
      Vendor,
      CartItem,
      Order,
      OrderItem,
      OrderNote,
      Customer,
      Discount,
      DiscountCondition,
      DiscountAction,
      Role,
      ShippingZone,
      ShippingMethod,
      Review
    },
    extendGraphqlSchema,
    ui: {
      // Show the UI only for poeple who pass this test
      isAccessAllowed: ({ session }) => !!session,
    },
    session: statelessSessions(sessionConfig),
  })
);