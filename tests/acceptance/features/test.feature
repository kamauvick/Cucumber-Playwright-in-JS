#comment
@testing_tag
Feature: Greeting
Description: Testing if this library is fully loaded

  Background:
    Given i run the tests
    When the tests complete exec
    Then I should get a success or error message

  Scenario: Say hello
    When the greeter says hello
    Then I should have heard "hello"
