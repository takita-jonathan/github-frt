/// <reference types="cypress" />


declare namespace Cypress {
  interface Chainable {
    mockGithubRequests(): Chainable<void>;
  }
}
