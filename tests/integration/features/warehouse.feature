#Test Creating Warehouse
@warehouse_test
Feature: Create a mobile warehouse
  Scenario: Create a warehouse for drivers
    Given i have the driver information
    When i create a driver warehouse
    Then the number of warehouses should be incremented by 1
#
#    Examples:
#      | driver1 | driver2 | driver3 | number |
#      | vick    | vick1   | vick2   | 3      |
#      | kamau   | kamau1  | kamau2  | 3      |

#Test Fetching the created warehouses

@warehouse_test
    Scenario: Fetch all the created warehouses
      Given i have warehouses available
      When i fetch all warehouses
      Then i should receive all available warehouses

#Test Filtering warehouses

@warehouse_test
    Scenario: Filter warehouse result
      Given i have available warehouses
      When  i add a filter
      Then i should get a filtered result based on the provided filter