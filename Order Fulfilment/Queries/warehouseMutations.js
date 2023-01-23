
let faker = require('@faker-js/faker')
//Create a new Warehouse

const createWarehouse = `
    mutation CreateWarehouse($input: CreateWarehouseCommand!) {
      createWarehouse(command: $input) {
          name
          contactInfo
          territoryId
      }
    }
  `

const variables = {
    input: {
        id: `${faker.faker.random.numeric(30)}`,
        name: `HDRI-${faker.faker.random.numeric(3)}`,
        territoryId: "Juja",
        whType: "MOBILE",
        companyId: "KDKE"
    }
};


module.exports  = {
    createWarehouse,variables
}