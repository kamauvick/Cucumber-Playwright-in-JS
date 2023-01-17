const assert = require('assert')
const { When, Then, Given } = require('@cucumber/cucumber')
const { GraphQLService } = require('../../../Clients/warehouse')

Given('i have a test graphql endpoint', async () => {
    this.test = await new GraphQLService().setUp();
});
When('i make a call to fetch all warehouses', async () => {
    this.test1 = await new GraphQLService().getWarehouses();
    assert(this.test1.length > 1)
});
Then('i should receive two warehouses', async () => {
    this.test2 = await new GraphQLService().checkResponseLength();
});
