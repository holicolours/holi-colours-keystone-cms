import { KeystoneContext, BaseKeystoneTypeInfo } from "@keystone-6/core/types";
var firebase = require('firebase-admin');

export async function syncCustomer(uid: string, input: any, context: KeystoneContext<BaseKeystoneTypeInfo>): Promise<void> {
  if (input == 'create') {
    firebase.auth().getUser(uid)
      .then(async (user: any) => {
        console.log(`Successfully fetched user data: ${user.toJSON()}`);
        const customer = await context.db.Customer.createOne({
          data: {
            uid: uid,
            email: user.email,
            status: 'R'
          }
        });
        if (customer) {
          await firebase.database().ref().child("sync").child("customers").child(uid).set(null);
          await firebase.database().ref().child("customers").child(uid).set({
            email: user.email
          });
        }
      })
      .catch((error: any) => {
        console.log('Error fetching user data:', error);
      });
  }
}

export async function syncOrder(orderId: string, input: any, context: KeystoneContext<BaseKeystoneTypeInfo>): Promise<void> {
  if (input) {
    await firebase.database().ref().child("orders").child(orderId).get().then(async (snapshot: { exists: () => any; val: () => any; }) => {
      let order;
      let newOrder;
      if (snapshot.exists()) {
        order = snapshot.val();
        if (Array.isArray(input) && input.includes('lastUpdatedOn')) {
          let updatedOrder: any = {
            orderJSON: order
          };
          if (input.includes('status')) {
            updatedOrder['status'] = order.status;
          }
          newOrder = await context.db.Order.updateOne({
            where: { orderNumber: orderId },
            data: updatedOrder
          });
        }
        if (input == 'create') {
          let orderInputs: any = {};

          orderInputs.orderNumber = orderId;
          orderInputs.status = "PP";
          orderInputs.subTotal = order.cart.subTotal;
          orderInputs.shippingMethod = order.shipping.methodName;
          orderInputs.shippingCharge = order.shipping.charge;
          orderInputs.discount = order.cart.discount;
          orderInputs.total = order.cart.total;
          orderInputs.customer = null; //TO-DO
          orderInputs.customerFirstName = order.customer.firstName;
          orderInputs.customerLastName = order.customer.lastName;
          orderInputs.customerEmail = order.customer.email;
          orderInputs.customerPhoneNumber = order.customer.phoneNumber;
          orderInputs.customerAlternatePhoneNumber = order.customer.alternatePhoneNumber;
          orderInputs.shipToAddress1 = order.customer.shipToAddress.address1;
          orderInputs.shipToAddress2 = order.customer.shipToAddress.address2;
          orderInputs.shipToCity = order.customer.shipToAddress.city;
          orderInputs.shipToState = order.customer.shipToAddress.state;
          orderInputs.shipToCountry = order.customer.shipToAddress.country;
          orderInputs.shipToPostalCode = order.customer.shipToAddress.postalCode;
          orderInputs.items = {
            create: order.cart.products.map((p: any) => ({
              item: p.details.productName,
              sku: {
                connect: {
                  sku: p.details.sku
                }
              },
              quantity: p.quantity,
              unitPrice: p.details.price,
              total: p.quantity * p.details.price
            }))
          };

          newOrder = await context.db.Order.createOne({
            data: orderInputs
          });
        }
        if (newOrder) {
          await firebase.database().ref().child("sync").child("orders").child(orderId).set(null);
        }
      }
    }).catch((error: any) => {
      console.error(error);
    });
  }
}

export async function syncStock(sku: string, input: any, context: KeystoneContext<BaseKeystoneTypeInfo>): Promise<void> {
  if (input) {
    const updated = await context.db.Stock.updateOne({
      where: {
        sku: sku
      },
      data: {
        outboundStock: {
          create: {
            sku: {
              connect: {
                sku: sku
              }
            },
            stockQuantity: input.stockQuantity,
            order: {
              connect: {
                orderNumber: input.orderNumber
              }
            }
          }
        }
      }
    });
    if (updated) {
      await firebase.database().ref().child("sync").child("stock").child(sku).set(null);
    }
  }
}