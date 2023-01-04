const assert = require('assert')
const { When, Then, Given } = require('@cucumber/cucumber')
const { Greeter } = require('../../../Clients/Test')

Given('i run the tests', async () => {
    this.say = new Greeter().sayHi();
});

When('the tests complete exec', async () => {
    this.say = new Greeter().sayHi();
});

Then('I should get a success or error message', async () => {
    this.say = new Greeter().sayHi();
});

When('the greeter says hello', async () => {
    this.whatIHeard = new Greeter().sayHello();
});

Then('I should have heard {string}', async (expectedResponse) => {
    assert.equal(this.whatIHeard, expectedResponse);
});