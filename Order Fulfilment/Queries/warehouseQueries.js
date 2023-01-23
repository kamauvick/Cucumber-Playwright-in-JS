//Get all warehouses
const allWarehouses =`query fetchWarehouse{
    fetchWarehouseByTerritoryId(territoryId : "Juja")
    {
       id
       location{
        latitude
        longitude
       }
       contactInfo
       warehouseType
       creationDate
       name
    }
}`

//Get warehouses with a filter

const filteredWarehouses = `query fetchWarehouse{
    fetchWareHouses(filter: {name: "vick vick"})
    {
        name
    }
}`


module.exports  = {
    allWarehouses,
    filteredWarehouses,
}