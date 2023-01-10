# Create a new Vehicle and assign the vehicle to a territory

Feature: Test vehicle creation and assignment
  Description: As a logistics manager,
  i want to be able to create a new vehicle and assign it to a territory

  Background:
      Given i am a logistic manager
      When i generate a token
      Then i should get a valid token to use

  @Demo_test
  Scenario: Create a new Vehicle
      Given The Logistics manager belongs to a territory
      And they have a correct token
      When they create a new vehicle
      Then the new vehicle should be available in the system

  @Demo_test
  Scenario: Assign the new Vehicle to a territory
      Given i have a new Vehicle
      And the vehicle territory assignment is null
      When the Logistics manager assigns the vehicle to a new territory
      Then the vehicle should belong to the assigned territory

  @purity
  Scenario: Check if vehicle is assigned to territory




