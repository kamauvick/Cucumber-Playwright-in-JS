let fetch  = require('node-fetch')
let replaceObject = require('./replaceStringCharacters');
let jmespath = require('jmespath');
const {replaceChar} = require("./replaceStringCharacters");
const {expect} = require("@playwright/test");

const params = new URLSearchParams();
params.append('client_id', "frontend");
params.append('username', "");
params.append('grant_type', "password");
params.append('password', "");

async function generateToken() {
	const response = await fetch('https://erp-identity.kyosk.dev/auth/realms/kyosk/protocol/openid-connect/token', {
		method: 'POST',
		body: params
	});

	let data = await response.json();
	const access_token = data.access_token;
	// console.log("Final token:  " + finalToken)
	return `Bearer ${await replaceChar(access_token, ' ', '')}`;
}

module.exports = { generateToken}
