import UserListPage from '../pages/user-list.page';
import HeaderPage from '../pages/header.page';

describe('User Listing Navigation Flows', () => {

  const ONE_SECOND = 1000;

  beforeEach(() => {
    cy.mockGithubRequests();
    cy.visit('/');
    cy.wait(ONE_SECOND);
  })

  it('Should load the home page with user listing', () => {
    UserListPage.getUserCards().should('have.length.above', 0)
  });

  it('Should navigate to the next page', () => {
    UserListPage.getPaginationRange().should('contain', '1 – 10');
    UserListPage.getPaginationNext().click();
    cy.wait(ONE_SECOND);
    UserListPage.getPaginationRange().should('contain', '11 – 20');
  });

  it('Should navigate to the next page and go back', () => {
    UserListPage.getPaginationRange().should('contain', '1 – 10');
    UserListPage.getPaginationNext().click();
    cy.wait(ONE_SECOND);
    UserListPage.getPaginationRange().should('contain', '11 – 20');
    UserListPage.getPaginationPrevious().click();
    cy.wait(ONE_SECOND);
    UserListPage.getPaginationRange().should('contain', '1 – 10');
  });

  it('Should change the number of items per page', () => {
    UserListPage.selectItemsPerPage('25');
    cy.wait(ONE_SECOND);
    UserListPage.getUserCards().should('have.length', 25);
    UserListPage.getPaginationRange().should('contain', '1 – 25');
  });

  it('Should filter users based on search input', () => {
    const profileName = 'takita-jonathan';

    HeaderPage.searchUser(profileName);
    cy.wait(ONE_SECOND);
    UserListPage.getUserCards().should('contain', profileName);
  });

});
