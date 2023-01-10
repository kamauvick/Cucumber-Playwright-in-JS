const { expect, request } = require('@playwright/test');

let sleepObject = require('./Custom-sleep');
let testObject = require('./TestData');
let jmespath = require('jmespath');

let stockEntryName;
let stockEntryDetails;
let deliveryTrip;

async function toDriverPending(deliveryTrip) {
  let delTrip = JSON.stringify(deliveryTrip);
  const context = await request.newContext({
    baseURL: "https://kyosk.aakvaerp.com/api/",
    extraHTTPHeaders: {
      'Authorization': `${testObject().erpNextToken}`,
    },
  });

  let stockEntryResponse = await context.get(`resource/Stock Entry`, {
    params: {
      filters: '[["Stock Entry","delivery_trip","=",' + delTrip + '],["Stock Entry","workflow_state","=","PENDING"],["Stock Entry","stock_entry_type","=","Transfer To Dispatch Bay"]]'
    }
  });
  expect(stockEntryResponse.status()).toBe(200)
  let stockRes = await stockEntryResponse.json();
  stockEntryName = await jmespath.search(stockRes, "data[0].name");

  const stockEntryDetailsResponse = await context.get(`method/frappe.desk.form.load.getdoc?doctype=Stock+Entry&name=${stockEntryName}`);
  expect(stockEntryDetailsResponse.status()).toBe(200)
  let stockResDetails = await stockEntryDetailsResponse.json();
  stockResDetails = await jmespath.search(stockResDetails, "docs[0]");
  stockEntryDetails = JSON.stringify(stockResDetails);

  // let confirmInboundResponse = await context.post(`method/frappe.model.workflow.apply_workflow`, {
  //   headers: {
  //     'Accept-Encoding': 'gzip, deflate, br',
  //     'Content-Type': 'multipart/form-data'
  //   },
  //   params: {
  //     doc: stockEntryDetails,
  //     action: "Confirm Inbound"
  //   }
  // });
  // expect(confirmInboundResponse.status()).toBe(200);
  // sleepObject.sleep(3000);

  let confirmOutboundResponse = await context.post(`method/frappe.model.workflow.apply_workflow`, {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'multipart/form-data'
    },
    params: {
      doc: stockEntryDetails,
      action: "Confirm Outbound"
    }
  });
  expect(confirmOutboundResponse.status()).toBe(200);
  sleepObject.sleep(3000);

  let dispatchEntryResponse = await context.post(`method/kyosk.api.api.create_dispatch_bay_stock_entry`, {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'multipart/form-data'
    },
    params: {
      stock_entry_name: stockEntryName
    }
  });
  expect(dispatchEntryResponse.status()).toBe(200);

};

async function toDriverOutboundConfirmed(deliveryTrip) {
  let delTrip = JSON.stringify(deliveryTrip);
  const context = await request.newContext({
    baseURL: "https://kyosk.aakvaerp.com/api/",
    extraHTTPHeaders: {
      'Authorization': `${testObject().erpNextToken}`,
    },
  });

  const stockEntryResponse = await context.get(`resource/Stock Entry`, {
    params: {
      filters: '[["Stock Entry","delivery_trip","=",' + delTrip + '],["Stock Entry","workflow_state","=","INBOUND_CONFIRMED"],["Stock Entry","stock_entry_type","=","Transfer To Driver Warehouse"]]'
    }
  });
  expect(stockEntryResponse.status()).toBe(200);
  const stockRes = await stockEntryResponse.json();
  let stockEntry = await jmespath.search(stockRes, "data[0].name");
  sleepObject.sleep(3000);

  const stockEntryDetailsResponse = await context.get(`method/frappe.desk.form.load.getdoc?doctype=Stock+Entry&name=${stockEntry}`);
  expect(stockEntryDetailsResponse.status()).toBe(200)
  const stockResDetails = await stockEntryDetailsResponse.json();
  let docDetails = await jmespath.search(stockResDetails, "docs[0]");
  docDetails = JSON.stringify(docDetails);
  sleepObject.sleep(3000);

  const outboundResponse = await context.post('method/frappe.model.workflow.apply_workflow', {
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      'Accept': '*/*',
    },
    data: {
      doc: docDetails,
      action: "Confirm Outbound"
    }
  });
  expect(outboundResponse.status()).toBe(200);
  sleepObject.sleep(5000);
};

export {
  toDriverPending,
  toDriverOutboundConfirmed
}