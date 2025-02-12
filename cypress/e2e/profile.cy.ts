import UserListPage from '../pages/user-list.page';
import ProfilePage from '../pages/profile.page';
import HeaderPage from '../pages/header.page';

describe('Profile Navigation Flows', () => {

  const ONE_SECOND = 1000;
  const profileName = 'torvalds';

  beforeEach(() => {
    cy.visit('/');
    cy.wait(ONE_SECOND);
    UserListPage.getUserCards().contains(profileName).click();
    cy.wait(ONE_SECOND);
  })

  it('Should open a user profile', () => {
    ProfilePage.getProfileInfo().should('contain', profileName);
  });

  it('Should navigate back to home when searching for a user', () => {
    const profileName = 'takita-jonathan';
    HeaderPage.searchUser(profileName);

    UserListPage.getUserCards().contains(profileName);
  });

  it('Should open a user profile and sort repositories by stars in descending order', () => {
    ProfilePage.getReposCards()
      .then(($cards) => {
        const repoStars = $cards.toArray().map(card => {
          const starsText= card.querySelector(".repo-card__stars")!.textContent!.split(" ")[1];
          return parseInt(starsText);
        });
        const sortedStars = [...repoStars].sort((a, b) => b - a);
        expect(repoStars).to.deep.equal(sortedStars);
      });
  });

  it('Should open a user profile and sort repositories by name in ascending order', () => {
    ProfilePage.getSortPerName().click();
    cy.wait(ONE_SECOND);
    ProfilePage.getOrderPerAsc().click();
    cy.wait(ONE_SECOND);

    ProfilePage.getReposCards()
      .then(($cards) => {
        const repoNames = $cards.toArray().map(card => card.querySelector('.repo-card__title')!.textContent!);
        const sortedNames = [...repoNames].sort((a, b) => a.localeCompare(b));
        expect(repoNames).to.deep.equal(sortedNames);
      });
  });

});
