const { request, expect } = require("@playwright/test");
const playwright = require('playwright');

const URL = "https://www.google.com";

class Greeter {
    sayHello() {
        return "hello";
    }

    sayHi(){
        return "Hi, i'm runnig the tests";
    }
}

module.exports = {
    Greeter
}
