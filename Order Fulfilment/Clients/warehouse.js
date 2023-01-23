const {request, expect} = require('@playwright/test');
const jmespath = require('jmespath')
const faker = require('@faker-js/faker')

const warehouseQueries  = require('../Queries/warehouseQueries');
const warehouseMutations = require('../Queries/warehouseMutations');

//URLS
let BASE_URL = 'http://localhost:8082/graphql';

//Variables
let data;
let initialCount;
let currentCount;

const context = request.newContext({
    baseURL: BASE_URL,
});

class GraphQLService {
    async setUp(){
        let count;
        expect(BASE_URL.includes('graphql')).toBe(true);

        const warehouseResponse = await (await context).post(BASE_URL, {
            data: {
                query: warehouseQueries.allWarehouses,
            }
        });

        expect(warehouseResponse.status()).toBe(200);
        data = await warehouseResponse.json();
        data = jmespath.search(data, "data.fetchWarehouseByTerritoryId");
        count = data.length;
        // console.log(count)
        return count
    }

    async createWarehouse(){
        initialCount = await this.setUp();
        const variables = {
            input: {
                id: `${faker.faker.random.numeric(30)}`,
                name: `HDRI-${faker.faker.random.numeric(3)}`,
                territoryId: "Juja",
                whType: "MOBILE",
                companyId: "KDKE"
            }
        };

        const response = await  (await context).post(BASE_URL, {
            data: {
                query: warehouseMutations.createWarehouse, variables
            }
        });

        expect(response.status()).toBe(200);
        data = await response.json();

        currentCount = await this.setUp()
        console.log(initialCount)
        console.log(currentCount)

        expect(initialCount).toBeLessThan(currentCount);
    }

    async fetchWarehouse(){

        const warehouseResponse = await (await context).post(BASE_URL, {
            data: {
                query: warehouseQueries.allWarehouses,
            }
        });


        expect(warehouseResponse.status()).toBe(200);
        data = await warehouseResponse.json();
    }

    async filterWarehouses(){

        const warehouseResponse = await (await context).post(BASE_URL, {
            data: {
                query: warehouseQueries.filteredWarehouses,
            }
        });

        expect(warehouseResponse.status()).toBe(200);
    }


}

module.exports = {
    GraphQLService
}