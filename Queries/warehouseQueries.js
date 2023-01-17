//Get all warehouses
const allWarehouses = "{ warehouses { id, name, Territory } }";

//Get warehouses with a filter

const filteredWarehouses = (warehouse) => `{ warehouses(name: "${warehouse}") { id, name, Territory } }`;

//Create a new Warehouse

const createWarehouse = (name, territory) => `mutation { createWarehouse(data: { name: "${name}", territory: "${territory}" }) }`

module.exports  = {
    allWarehouses,
    filteredWarehouses,
    createWarehouse
}