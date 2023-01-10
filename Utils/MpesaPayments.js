const { request, expect } = require("@playwright/test");

import { generateToken } from "./TokenGeneration";
let sleepObject = require("./Custom-sleep");
let token;

export async function payViaMpesaDeliveryNote(driverCode, deliveryNote) {
  token = await generateToken();
  const context = await request.newContext({
    baseURL: "https://erp.staging.kyosk.dev/",
    extraHTTPHeaders: {
      Authorization: token,
    },
  });
    let balanceResponse = await context.get(`svc/paymentbroker/v1/api/deliverynote/fetchBalance/${deliveryNote}`);
    let balance = await balanceResponse.json();
    sleepObject.sleep(1000);

    let mpesaCode = await Math.random().toString(36).substr(2, 10).toUpperCase();

    let generateCodeResponse = await context.post(`svc/paymentservice/api/c2b/callback`,
        {
            headers: {
                'Accept': 'application/json, text/plain, */*',
            },
            data: {
                TransID: mpesaCode,
                TransTime: "20211103145900",
                TransAmount: balance
            }
        });
    expect(generateCodeResponse.status()).toBe(200);
    sleepObject.sleep(3000);

    let validateCodeResponse = await context.post(`svc/paymentbroker/v1/api/payments/validate/mpesa`,
        {
            headers: {
                'Accept': 'application/json, text/plain, */*',
            },
            data: {
                referenceDoc: deliveryNote,
                docType: "Delivery Note",
                driver: driverCode,
                paymentReference: mpesaCode,
            }
        });
    expect(validateCodeResponse.status()).toBe(200);
    sleepObject.sleep(3000);

    let pollResponse = await context.get(`svc/paymentbroker/v1/api/payments/validate/poll/payment/${mpesaCode}`);
    expect(pollResponse.status()).toBe(200);
    sleepObject.sleep(3000);

    let generateInvoiceResponse = await context.post(`svc/paymentbroker/v1/api/salesinvoice`,
        {
            headers: {
                'Accept': 'application/json, text/plain, */*',
            },
            data: {
                referenceDoc: deliveryNote,
                docType: "Delivery Note"
            }
        });
    expect(generateInvoiceResponse.status()).toBe(200);
}