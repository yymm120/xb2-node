Feature: Greeting
  Scenario: Say hello
    When the greeter say hello
    Then I should have heard "hello"