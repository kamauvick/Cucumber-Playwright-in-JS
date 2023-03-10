const {request, expect} = require('@playwright/test');
const jmespath = require('jmespath')

const warehouseQueries  = require('../Queries/warehouseQueries')

//URLS
let BASE_URL = 'http://localhost:8081/graphql';

//Variables
let data;

class GraphQLService {
    async setUp(){
        expect(BASE_URL.includes('graphql')).toBe(true);
    }
    async getWarehouses(){
        const context = await request.newContext({
            baseURL: BASE_URL,
        });

        const warehouseResponse = await context.post(BASE_URL, {
            data: {
                query: warehouseQueries.allWarehouses,
            }
        });

        data = await warehouseResponse.json();
        expect(warehouseResponse.status()).toBe(200);
        data = jmespath.search(data, 'data.warehouses');
        return data
    }

     async checkResponseLength(){
        console.log(await data)
        expect((data).length).toEqual(2)
    }
}

module.exports = {
    GraphQLService
}