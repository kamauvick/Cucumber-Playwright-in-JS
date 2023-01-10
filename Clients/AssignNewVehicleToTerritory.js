const {request, expect} = require('@playwright/test');
let  { generateToken } = require('../Utils/TokenGeneration');
let  testData  = require('../Utils/TestData');
let { faker } = require('@faker-js/faker');

let BASE_URL = 'https://erp.staging.kyosk.dev/';
let token;
let vehicleData;
let newVehicleData;
let vehicleCode;
let territoryCode;
let data = testData();
let createdVehicle;
let reassignResponse;

class NewVehicle{
     async createVehicle(){
        token = await generateToken();
        const context = await request.newContext({
            baseURL: BASE_URL,
            extraHTTPHeaders: {
                "Authorization": `${token}`
            }
        });
        let CREATE_VEHICLE_URL = `/svc/dispatch/api/vehicle`;
        newVehicleData = {
            acquisitionDate: faker.date.soon(),
            color: faker.color.human(),
            fuelType: "Diesel",
            lastOdometer: faker.datatype.number(),
            licensePlate: `TEST ${(faker.random.alphaNumeric(4)).toUpperCase()}`,
            vehicleProviderCode: data.serviceProvider,
            vehicleTypeCode: "TUK_TUK-2050-akZD",
            vehicleValue: faker.datatype.number({ min: 1000000 })
        }
        newVehicleData = JSON.stringify(newVehicleData);

        let createVehicleResponse = await context.post(CREATE_VEHICLE_URL, {
            data: JSON.parse(newVehicleData)
        });
        createdVehicle = await createVehicleResponse.json()
         console.log(createdVehicle)
        return createdVehicle;
    }
    async getVehicleDetails(){
        const context = await request.newContext({
            baseURL: BASE_URL,
            extraHTTPHeaders: {
                "Authorization": `${token}`
            }
        });

        let SERVICE_PROVIDERS_URL = `svc/dispatch/api/service-provider?page=0&size=200&sort=createdDate,desc&supplierName.equals=${data.serviceProvider}`;
        let ServiceProviderResponse = await context.get(SERVICE_PROVIDERS_URL);
        expect(ServiceProviderResponse.status()).toBe(200);
        let mydata = await ServiceProviderResponse.json();

        let VEHICLE_API_URL  = `/svc/dispatch/api/driverVehicleAssignment?sort=createdDate,desc&vehicleProviderCode.equals=${mydata[0].code}&dateUnassigned.specified=false&licensePlate.equals=${createdVehicle.licensePlate}`;

        let vehicleResponse = await context.get(VEHICLE_API_URL);
        vehicleData = await vehicleResponse.json();
        vehicleCode = await vehicleData[0].vehicle.code;
        territoryCode = await vehicleData[0].vehicle.territoryCode;
    }

    async getVehicleTerritory(){
        let territoryName = await vehicleData[0].vehicle.territoryCode;
        expect(territoryName).toBeNull();
    }

    async moveVehicleToNewTerritory(){
        const context = await request.newContext({
            baseURL: BASE_URL,
            extraHTTPHeaders: {
                "Authorization": `${token}`
            }
        });

        let vehicleDataObject = {
            vehicleCode : vehicleCode,
            territoryCode : territoryCode
        }

        vehicleDataObject.territoryCode = data.updateToTerritory;
        vehicleDataObject = JSON.stringify(vehicleDataObject);

        let ASSIGN_TO_TERRITORY_URL = `/svc/dispatch/api/vehicle/territory/assign`;
        reassignResponse = await context.put(ASSIGN_TO_TERRITORY_URL, {
            data : JSON.parse(vehicleDataObject)
        });
        reassignResponse = await reassignResponse.json();
    }

    async checkVehiclesNewTerritory(){
        expect(reassignResponse.territoryCode).toEqual(data.updateToTerritory);
    }
}

module.exports = {
    NewVehicle
}
