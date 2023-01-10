import { expect, request } from "@playwright/test";
let testObject = require("./TestData");
import { generateToken } from "../Utils/TokenGeneration";
let sleep = require('../Utils/Custom-sleep');


let jmespath = require("jmespath");

let BASE_URL = "https://kyosk.aakvaerp.com/";
let deliveryTripDetails;
let token;
let deliverytrip;
let docDetails;
let returnStockEntry;

export async function getCurrentDeliveryTrip() {
    token = await generateToken();
    const context = await request.newContext({
        baseURL: "https://erp.staging.kyosk.dev/",
        extraHTTPHeaders: {
            Authorization: `${token}`,
        },
    });

    let DELIVERY_TRIP_URL = `/svc/driver/api/deliverytrip?page=0&size=100&driverCode.equals=${testObject().testDriver}&status.in=DELIVERED`;
    let deliveryTripResponse = await context.get(DELIVERY_TRIP_URL);
    expect(deliveryTripResponse.status()).toBe(200);
    
    deliveryTripResponse = await deliveryTripResponse.json();
    deliverytrip = jmespath.search(deliveryTripResponse, "[0].name");
}


export async function getTripToMakeReturns() {
    const context = await request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `${testObject().erpNextToken}`,
        },
    });

    let RETURNS_URL = `/api/method/frappe.desk.form.load.getdoc?doctype=Delivery+Trip&name=${deliverytrip}`;

    let dtReturnsResponse = await context.get(RETURNS_URL);
    expect(dtReturnsResponse.status()).toBe(200);

    dtReturnsResponse = await dtReturnsResponse.json();
    sleep.sleep(2000);
    deliveryTripDetails = jmespath.search(dtReturnsResponse, "docs[0]");
    expect(deliveryTripDetails.name).toEqual(deliverytrip);
}

export async function transitionTripToDriverReturned() {
    sleep.sleep(2000);
    const context = await request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `${testObject().erpNextToken}`,
        },
    });

    let DELIVERY_TRIP_TO_DR_URL = `api/method/frappe.model.workflow.apply_workflow`;

    let payload = {
        doc: deliveryTripDetails,
        action: "Driver Returned",
    };

    payload = JSON.stringify(payload);

    let isDriverReturned = await context.post(DELIVERY_TRIP_TO_DR_URL, {
        data: JSON.parse(payload),
    });

    sleep.sleep(5000);
    expect(isDriverReturned.status()).toBe(200);
    isDriverReturned = await isDriverReturned.json()

    // console.log(isDriverReturned);
}

// TODO: Fix the logic below to add a complete trip scenario

// export async function checkDriverInventory(delivery_trip){
//     token = await generateToken();
//     const context = await request.newContext({
//         baseURL: "https://erp.staging.kyosk.dev/",
//         extraHTTPHeaders: {
//             Authorization: `${token}`,
//         },
//     });

//     //TODO: Check driver warehouse | if items > 0, create returns, else create returns

//     let DRIVER_INVENTORY_URL = `https://erp.staging.kyosk.dev/svc/driver/api/inventory/${testObject().testDriver}`;
//     let isInventoryEmpty = await context.get(DRIVER_INVENTORY_URL);
//     expect(isInventoryEmpty.status()).toBe(200);
//     isInventoryEmpty = await isInventoryEmpty.json();

//     let count = 0;
//     for(let i=0; i<isInventoryEmpty.length; i++){
//         if (isInventoryEmpty[i].actual_qty === 0.0){
//             count = count;
//         }else{
//             count = count + 1;
//         }
//     }
//     console.log(count);
//     if(count > 0){
//         console.log("making rerutns");
//         createReturns(delivery_trip);
//         getStockEntries(delivery_trip);
//         getDocDetails();
//         confirmInbound();
//         confirmOutbound();
//         verifyOutbound();
//     }else{
//         console.log("Completing the trip");
//         completeDeliveryTrip();
//     }

// }

export async function createReturns() {
    sleep.sleep(5000);
    const context = await request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `${testObject().erpNextToken}`,
        },
    });

    let RETURNS_URL = `/api/method/kyosk.api.api.create_return_stock_entry`;
    console.log(deliverytrip);

    let payload = {
        doc_name: deliverytrip,
    };

    payload = JSON.stringify(payload);

    let isReturnsCreated = await context.post(RETURNS_URL, {
        data: JSON.parse(payload),
    });
    sleep.sleep(5000);

    expect(isReturnsCreated.status()).toBe(200);

    isReturnsCreated = await isReturnsCreated.json();
    // console.log(isReturnsCreated);
    console.log("created driver returns");
}

export async function getStockEntries() {
    const context = await request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `${testObject().erpNextToken}`,
        },
    });

    let STOCK_ENTRIES_URL = `/api/resource/Stock Entry?filters=[["delivery_trip","=","${deliverytrip}"]]`;

    let stockEntryResponse = await context.get(STOCK_ENTRIES_URL);
    sleep.sleep(2000);
    expect(stockEntryResponse.status()).toBe(200);
    stockEntryResponse = await stockEntryResponse.json();

    returnStockEntry = await stockEntryResponse.data[0].name;
    // console.log(returnStockEntry);
    console.log("Getting delivery trip");
}

export async function getDocDetails() {
    const context = await request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `${testObject().erpNextToken}`,
        },
    });

    let DOC_DETAILS_URL = `/api/method/frappe.desk.form.load.getdoc?doctype=Stock Entry&name=${returnStockEntry}`;
    let docDetailsInfo = await context.get(DOC_DETAILS_URL);
    sleep.sleep(2000);
    expect(docDetailsInfo.status()).toBe(200);
    docDetailsInfo = await docDetailsInfo.json();
    docDetails = await docDetailsInfo.docs[0];
    // console.log(docDetails)
    console.log("Getting the doc details");
}


export async function confirmInbound() {
    const context = await request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `${testObject().erpNextToken}`,
        },
    });

    let CONFIRM_INBOUND_URL = `/api/method/frappe.model.workflow.apply_workflow`;

    let payload = {
        doc: docDetails,
        action: "Confirm Inbound"
    }

    payload = JSON.stringify(payload);

    let isInboundConfirmed = await context.post(CONFIRM_INBOUND_URL, {
        data: JSON.parse(payload),
    });

    expect(isInboundConfirmed.status()).toBe(200);

    isInboundConfirmed = await isInboundConfirmed.json()
    docDetails = await isInboundConfirmed.message;
    // console.log(docDetails);
    console.log("Confirm Inbound");
}

export async function confirmOutbound() {
    const context = await request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `${testObject().erpNextSecondToken}`,
        },
    });


    let CONFIRM_OUTBOUND_URL = `/api/method/frappe.model.workflow.apply_workflow`;

    let payload = {
        doc: docDetails,
        action: "Confirm Outbound"
    }

    payload = JSON.stringify(payload);

    let isInboundConfirmed = await context.post(CONFIRM_OUTBOUND_URL, {
        data: JSON.parse(payload),
    });

    expect(isInboundConfirmed.status()).toBe(200);

    isInboundConfirmed = await isInboundConfirmed.json()
    docDetails = await isInboundConfirmed.message;
    // console.log(docDetails);
    console.log("Confirm Outbound");
}

export async function verifyOutbound() {
    const context = await request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `${testObject().erpNextSecondToken}`,
        },
    });

    let VERIFY_OUTBOUND_URL = `/api/method/frappe.model.workflow.apply_workflow`;

    let payload = {
        doc: docDetails,
        action: "Verify Outbound"
    }

    payload = JSON.stringify(payload);

    let isInboundConfirmed = await context.post(VERIFY_OUTBOUND_URL, {
        data: JSON.parse(payload),
    });

    expect(isInboundConfirmed.status()).toBe(200);

    isInboundConfirmed = await isInboundConfirmed.json()
    docDetails = await isInboundConfirmed.message;
    // console.log(docDetails);
    console.log("Verify Outbound");
}

export async function completeDeliveryTrip() {
    const context = await request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `${testObject().erpNextToken}`,
        },
    });

    let COMPLETE_DELIVERY_TRIP_URL = `/api/method/frappe.model.workflow.apply_workflow`;

    let payload = {
        doc: deliveryTripDetails,
        action: "Complete",
    };

    payload = JSON.stringify(payload);

    let isTripCompleted = await context.post(COMPLETE_DELIVERY_TRIP_URL, {
        data: JSON.parse(payload),
    });

    sleep.sleep(5000);
    expect(isTripCompleted.status()).toBe(200);
    isTripCompleted = await isTripCompleted.json()
    // console.log(isTripCompleted);
}

export async function resendHookToKafka() {
    const context = await request.newContext({
        baseURL: BASE_URL,
        extraHTTPHeaders: {
            Authorization: `${testObject().erpNextToken}`,
        },
    });

    let TRIP_TO_SEND_TO_KAFKA_URL = `/api/method/kyosk.api.utils.resend_single_webhook`;

    let payload = {
        doctype: "Delivery Trip",
        doc_name: deliverytrip
    }
    payload = JSON.stringify(payload);

    let isTripResentResponse = await context.post(TRIP_TO_SEND_TO_KAFKA_URL, {
        data: JSON.parse(payload),
    });

    expect(isTripResentResponse.status()).toBe(200);
    isTripResentResponse = await isTripResentResponse.json();
    // console.log(isTripResentResponse);
    console.log("Sending the Kafka hook");
}
