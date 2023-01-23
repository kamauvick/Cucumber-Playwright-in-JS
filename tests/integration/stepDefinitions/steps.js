const { When, Then, Given } = require('@cucumber/cucumber')
const { GraphQLService } = require('../../../Order Fulfilment/Clients/warehouse')

//Create WH
Given('i have the driver information', async () => {
    this.test = await new GraphQLService().setUp();
});
When('i create a driver warehouse', async () => {
    this.test = await  new GraphQLService().createWarehouse();
});
Then('the number of warehouses should be incremented by 1', async () => {
    this.tests = await new GraphQLService().setUp();
});

//Query WH
Given('i have warehouses available', async () => {
    this.tests = await new GraphQLService().setUp();
});
When('i fetch all warehouses', async () => {
    this.test = await new GraphQLService().fetchWarehouse();
});
Then('i should receive all available warehouses', async () => {
    this.tests = await new GraphQLService().setUp();
});

//Filter WH
Given('i have available warehouses', async () => {
    this.tests = await new GraphQLService().setUp();
});
When('i add a filter', async () => {
    this.test = await new GraphQLService().filterWarehouses();
});
Then('i should get a filtered result based on the provided filter', async () => {
    this.tests = await new GraphQLService().setUp();
});

