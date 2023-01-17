#Test Fetching warehouses

@warehouse_test
  Feature: Fetch warehouses via a graphql endpoint
    Scenario:
      Given i have a test graphql endpoint
      When i make a call to fetch all warehouses
      Then i should receive two warehouses