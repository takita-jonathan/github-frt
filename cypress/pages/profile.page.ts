class ProfilePage {

  getTabs() {
    return cy.get('[data-testid="user-profile__tabs"] div[role="tab"]')
  }

  getProfileInfo() {
    return cy.get('[data-testid="user-profile__info"]');
  }

  getReposCards() {
    return cy.get('[data-testid="repo-card"')
  }

  getSortPerStars() {
    return cy.get('[data-testid="user-repositories__sort-option--stars"]')
  }

  getSortPerName() {
    return cy.get('[data-testid="user-repositories__sort-option--name"]')
  }

  getOrderPerDesc() {
    return cy.get('[data-testid="user-repositories__order-option--desc"]')
  }

  getOrderPerAsc() {
    return cy.get('[data-testid="user-repositories__order-option--asc"]')
  }

  getPaginationNext() {
    return cy.get('[data-testid="user-repositories__paginator"] .mat-mdc-paginator-navigation-next');
  }

  getPaginationPrevious() {
    return cy.get('[data-testid="user-repositories__paginator"] .mat-mdc-paginator-navigation-previous');
  }

  getPaginationPerPage() {
    return cy.get('[data-testid="user-repositories__paginator"] .mat-mdc-select');
  }

  getPaginationOptions() {
    return cy.get('.mat-mdc-option');
  }

  selectItemsPerPage(value: string) {
    this.getPaginationPerPage().click({ force: true });
    this.getPaginationOptions().contains(value).click();
  }

}

export default new ProfilePage();
