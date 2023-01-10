const {expect, request } = require('@playwright/test');

import { generateToken } from './TokenGeneration';

let agentRouteCode;
let territoryName;
let territoryWarehouse;
let kyoskCode;
let shopName;
let itemName;
let cartId;
let deliveryWindowId;
let deliveryWindowDate;
let deliveryWindowStart;
let deliveryWindowEnd;
let erpId;
let totalPrice;
let createdOnApp;
let numberOfItems;
let rate;
let status;
let marketDeveloper;
let discountRate;
let normalRate;

export async function createSaleOrder() {
const token = await generateToken();
const context = await request.newContext({
 baseURL: 'https://erp.staging.kyosk.dev/',
 extraHTTPHeaders:{
    "Authorization": token,
    'Accept-Country': 'KE',
    'app': 'Agent PWA'
  }
});
    const routeResponse = await context.get(`svc/zones/api/zone-validation/user-territory`);
    expect(routeResponse.status()).toBe(200)
    const res = await routeResponse.json();
    agentRouteCode = res.data[0].route.code;
    territoryName = res.data[0].territory.name;
    territoryWarehouse = res.data[0].territory.warehouse.toString();

    const shopsResponse = await context.get(`svc/erpbroker/api/kyosks?routeCode.equals=${agentRouteCode}&kyoskName.contains=&page=0&size=100&sort=creationDate,desc`)
    expect(shopsResponse.status()).toBe(200)
    const shopsRes = await shopsResponse.json();
    kyoskCode = shopsRes.data[0].kyosk.code;

    const firstShopResponse = await context.get(`svc/erpbroker/api/kyosks?kyoskCode.equals=${kyoskCode}`)
    expect(firstShopResponse.status()).toBe(200)
    const firstShopRes = await firstShopResponse.json();
    shopName = firstShopRes.data[0].erpId;

    const catalogResponse = await context.get(`svc/erpbroker/api/catalog?territory.equals=${territoryName}&itemCode.contains=&price.greaterThan=0&page=0&size=50&sort=itemCode,asc`,{
         headers: {
                    'App': 'AgentApp'
                }
       })
    expect(catalogResponse.status()).toBe(200);
    const catalogRes = await catalogResponse.json();
    let itemsInStock = [];
    let counter = (catalogRes.data).length;
    for (var i = 0; i < counter; i++) {
        let list = catalogRes.data[i];
        if (list.stock > 0) {
            let itemInStock = list.bundleCode;
            itemsInStock.push(itemInStock)
        }
    }
    itemName = itemsInStock[0];

    const cartResponse = await context.put(`svc/erpbroker/api/cart`, {
        headers: {
            'Accept-Country': 'KE'
        },
        data: {
            quantity: "5",
            itemId: itemName,
            territory: territoryName
        }
    })
    expect(cartResponse.status()).toBe(200);
    const cartRes = await cartResponse.json();
    cartId = cartRes.data.cartId;

    const windowResponse = await context.get(`svc/dispatch/api/delivery-windows/`)
    expect(windowResponse.status()).toBe(200)
    const winRes = await windowResponse.json();
    deliveryWindowId = winRes[0].id;
    deliveryWindowDate = winRes[0].deliveryDate.toString();
    deliveryWindowStart = parseInt(winRes[0].start);
    deliveryWindowEnd = parseInt(winRes[0].end);

    const checkoutResponse = await context.post(`svc/erpbroker/api/cart/${cartId}/checkout`, {
        headers: {
            'Accept-Country': 'KE',
            'app': 'Agent PWA'
        },
        data: {
            customerName: shopName,
            deliveryWindow: {
                id: deliveryWindowId,
                date: deliveryWindowDate,
                start: deliveryWindowStart,
                end: deliveryWindowEnd
            },
            warehouse: territoryWarehouse
        }
    })
    expect(checkoutResponse.status()).toBe(201);
    const checkoutRes = await checkoutResponse.json();
    erpId = checkoutRes.data.erpId;
    status = checkoutRes.data.workflowState;
    totalPrice = checkoutRes.data.orderAmount;
    createdOnApp = checkoutRes.data.createdOnApp;
    numberOfItems = checkoutRes.data.items[0].quantity;
    discountRate = checkoutRes.data.items[0].price.discountPrice;
    normalRate = checkoutRes.data.items[0].price.sellingPrice;
    discountRate = Math.round(checkoutRes.data.items[0].price.discountPrice);
    rate = (normalRate - discountRate);
    marketDeveloper = checkoutRes.data.agent.name;

    const placeOrderResponse = await context.put(`svc/erpbroker/api/cart/checkout/${erpId}`)
    expect(placeOrderResponse.status()).toBe(201);
  };

export {
    erpId,
    shopName,
    totalPrice,
    deliveryWindowStart,
    deliveryWindowEnd,
    deliveryWindowDate,
    createdOnApp,
    itemName,
    numberOfItems,
    territoryName,
    rate,
    marketDeveloper,
    status,
};
