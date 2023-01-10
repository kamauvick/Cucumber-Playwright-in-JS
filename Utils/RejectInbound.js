const { expect, request } = require('@playwright/test');

let sleepObject = require('./Custom-sleep');
let testObject = require('./TestData');

let stockEntryName;
let stockEntryDetails;
let deliveryTrip;

async function rejectInboundStockEntry(deliveryTrip) {
  let delTrip = JSON.stringify(deliveryTrip);
  const context = await request.newContext({
    baseURL: "https://kyosk.aakvaerp.com/api/",
    extraHTTPHeaders: {
      'Authorization': `${testObject().erpNextToken}`,
    },
  });

  const stockEntryResponse = await context.get(`resource/Stock Entry`, {
    params: {
      filters: '[["Stock Entry","delivery_trip","=",' + delTrip + '],["Stock Entry","workflow_state","=","PENDING"],["Stock Entry","stock_entry_type","=","Transfer To Dispatch Bay"]]'
    }
  });
  expect(stockEntryResponse.status()).toBe(200)
  console.log(await stockEntryResponse.json())
  const stockRes = await stockEntryResponse.json();
  stockEntryName = stockRes.data[0].name;

  const stockEntryDetailsResponse = await context.get(`method/frappe.desk.form.load.getdoc?doctype=Stock+Entry&name=${stockEntryName}`);
  expect(stockEntryDetailsResponse.status()).toBe(200)
  const stockResDetails = await stockEntryDetailsResponse.json();
  stockEntryDetails = JSON.stringify(stockResDetails.docs[0]);

  const rejectInboundResponse = await context.post(`method/frappe.model.workflow.apply_workflow`, {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'multipart/form-data'
    },
    params: {
      doc: stockEntryDetails,
      action: "Reject Inbound"
    }
  });
  expect(rejectInboundResponse.status()).toBe(200);
  sleepObject.sleep(5000);
};

export {
  rejectInboundStockEntry
}