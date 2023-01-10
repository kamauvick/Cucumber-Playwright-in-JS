const assert = require('assert')
const { When, Then, Given } = require('@cucumber/cucumber')
const { Greeter } = require('../../../Clients/Test')
const {NewVehicle} = require('../../../Clients/AssignNewVehicleToTerritory');

//Background info
Given('i am a logistic manager', async () => {
    this.tets = new NewVehicle().createVehicle();
});

When('i generate a token', async () => {
    console.log("Testing");
});

Then('i should get a valid token to use', async () => {
    console.log("Testing");
});

//Create new vehicle
Given('The Logistics manager belongs to a territory', async () =>  {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Given('they have a correct token', async () =>  {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('they create a new vehicle', async () =>  {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('the new vehicle should be available in the system', async () =>  {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

//Assign Vehicle to a new territory
Given('i have a new Vehicle', async () =>  {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Given('the vehicle territory assignment is null', async () => {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('the Logistics manager assigns the vehicle to a new territory', async () =>  {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('the vehicle should belong to the assigned territory', async () =>  {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});