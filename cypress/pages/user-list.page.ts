class UserListPage {
  getUserCards() {
    return cy.get('[data-testid="user-card"]');
  }

  getPaginationNext() {
    return cy.get('[data-testid="user-list__paginator"] .mat-mdc-paginator-navigation-next');
  }

  getPaginationPrevious() {
    return cy.get('[data-testid="user-list__paginator"] .mat-mdc-paginator-navigation-previous');
  }

  getPaginationPerPage() {
    return cy.get('[data-testid="user-list__paginator"] .mat-mdc-select');
  }

  getPaginationOptions() {
    return cy.get('.mat-mdc-option');
  }

  getPaginationRange() {
    return cy.get('[data-testid="user-list__paginator"] .mat-mdc-paginator-range-label');
  }

  selectItemsPerPage(value: string) {
    this.getPaginationPerPage().click({ force: true });
    this.getPaginationOptions().contains(value).click();
  }
}

export default new UserListPage();
