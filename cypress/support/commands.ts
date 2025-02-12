// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('mockGithubRequests', () => {
  cy.intercept('GET', '**/search/users?q=repos%3A%3E%3D0&page=1&per_page=10', { fixture: 'page1-res.json' }).as('mockPage1');
  cy.intercept('GET', '**/search/users?q=repos%3A%3E%3D0&page=2&per_page=10', { fixture: 'page2-res.json' }).as('mockPage2');
  cy.intercept('GET', '**/search/users?q=repos%3A%3E%3D0&page=1&per_page=25', { fixture: 'page1-25e-res.json' }).as('mockPage1with25ele');
  cy.intercept('GET', '**/search/users?q=takita-jonathan&page=1&per_page=10', { fixture: 'takita-jonathan-search-res.json' }).as('mockSearchTakitaJonathan');
  cy.intercept('GET', '**/search/users?q=torvalds&page=1&per_page=10', { fixture: 'torvalds-search-res.json' }).as('mockSearchTorvalds');
  cy.intercept('GET', '**/search/repositories?q=user:torvalds+fork:true&sort=stars&order=desc&page=1&per_page=10', { fixture: 'torvalds-repo-stars-desc.json' }).as('mockRepoStarsDesc');
  cy.intercept('GET', '**/search/repositories?q=user:torvalds+fork:true&sort=name&order=desc&page=1&per_page=10', { fixture: 'torvalds-repo-name-desc.json' }).as('mockRepoNameDesc');
  cy.intercept('GET', '**/search/repositories?q=user:torvalds+fork:true&sort=name&order=asc&page=1&per_page=10', { fixture: 'torvalds-repo-name-asc.json' }).as('mockRepoNameAsc');
});
