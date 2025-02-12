class HeaderPage {
  getLogo() {
    return cy.get('[data-testid="header_logo"]');
  }

  getSearchInput() {
    cy.get('mat-form-field.header__search').click();
    return cy.get('[data-testid="search-input"]');
  }


  searchUser(username: string) {
    this.getSearchInput().click().clear().type(username);
  }
}

export default new HeaderPage();
