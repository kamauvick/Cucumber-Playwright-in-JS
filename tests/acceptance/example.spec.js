const { test, expect } = require('@playwright/test');

let sayHello = require('../../Clients/Test');

test.describe.configure({mode: 'serial'});

test('Connect to Qase and get runs', async () => {
  new sayHello.Greeter().sayHello();
});