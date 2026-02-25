const bunId = '643d69a5c3f7b9001cfa093d';
const mainIngredientId = '643d69a5c3f7b9001cfa0947';
const sauceId = '643d69a5c3f7b9001cfa0945';
const bunSelector = `[data-cy="${bunId}"]`;
const mainIngredientSelector = `[data-cy="${mainIngredientId}"]`;
const sauceSelector = `[data-cy="${sauceId}"]`;
const constructorSelector = '[data-cy="constructor"]';
const modalSelector = '[data-cy="modal"]';
const modalCloseButtonSelector = '[data-cy="modal-close-button"]';
const modalOverlaySelector = '[data-cy="modal-overlay"]';
const submitOrderButtonSelector = '[data-cy="submit-order-button"]';
const orderNumberSelector = '[data-cy="order-number"]';

// Вспомогательная функция для добавления всех ингредиентов
function addAllIngredients() {
  cy.get(bunSelector).children('button').click();
  cy.get(mainIngredientSelector).children('button').click();
  cy.get(sauceSelector).children('button').click();
}

// Вспомогательная функция для проверки наличия ингредиентов в конструкторе
function checkIngredientsInConstructor() {
  cy.get(constructorSelector).should('contain', 'Флюоресцентная булка R2-D3');
  cy.get(constructorSelector).should('contain', 'Плоды Фалленианского дерева');
  cy.get(constructorSelector).should('contain', 'Соус с шипами Антарианского плоскоходца');
}

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('fetchUser');
    cy.intercept('POST', 'api/auth/login', { fixture: 'login.json' });
    cy.intercept('POST', 'api/auth/token', { fixture: 'login.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('postOrder');

    window.localStorage.setItem('refreshToken', JSON.stringify('refreshToken'));
    cy.setCookie('accessToken', 'accessToken');
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@fetchUser');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearCookies();
  });

  describe('Проверяем добавление ингредиентов в конструктор', () => {
    it('Добавление булки в конструктор', () => {
      cy.get(bunSelector).children('button').click();
      cy.get(constructorSelector).should('contain', 'Флюоресцентная булка R2-D3');
    });

    it('Добавление начинок в конструктор', () => {
      cy.get(mainIngredientSelector).children('button').click();
      cy.get(sauceSelector).children('button').click();

      cy.get(constructorSelector).should('contain', 'Плоды Фалленианского дерева');
      cy.get(constructorSelector).should('contain', 'Соус с шипами Антарианского плоскоходца');
    });
  });

  describe('Проверяем открытие и закрытие модального окна с описанием ингредиента', () => {
    it('Открытие модального окна с описанием ингредиента', () => {
      cy.get(modalSelector).should('not.exist');
      cy.get(bunSelector).find('a').click();
      cy.get(modalSelector)
        .should('exist')
        .should('contain', 'Флюоресцентная булка R2-D3');
      cy.get(modalSelector).find('img').should('be.visible');
    });

    it('Закрытие модального окна по клику на крестик', () => {
      cy.get(bunSelector).find('a').click();
      cy.get(modalSelector).should('exist');
      cy.get(modalCloseButtonSelector).click();
      cy.get(modalSelector).should('not.exist');
    });

    it('Закрытие модального окна по клику за областью модального окна', () => {
      cy.get(bunSelector).find('a').click();
      cy.get(modalSelector).should('exist');
      cy.get(modalOverlaySelector).click({ force: true });
      cy.get(modalSelector).should('not.exist');
    });
  });

  describe('Процесс создания заказа', () => {
    
    beforeEach(() => {
      addAllIngredients();
    });

    it('Добавление ингредиентов в конструктор бургера', () => {
      
      checkIngredientsInConstructor();
    });

    it('Проверка отображения модального окна с номером заказа при оформлении заказа', () => {
      checkIngredientsInConstructor();
      cy.get(submitOrderButtonSelector).click();
      cy.wait('@postOrder');
      cy.get(modalSelector).should('exist');
      cy.get(orderNumberSelector).should('contain', '99145');
    });

    it('Проверка очистки конструктора бургера от добавленных ингредиентов после оформления заказа', () => {
      checkIngredientsInConstructor();
      
      cy.get(submitOrderButtonSelector).click();
      cy.wait('@postOrder');
      cy.get(modalCloseButtonSelector).click();
      cy.get(modalSelector).should('not.exist');
      
      
      cy.get(constructorSelector).should('not.contain', 'Флюоресцентная булка R2-D3');
      cy.get(constructorSelector).should('not.contain', 'Плоды Фалленианского дерева');
      cy.get(constructorSelector).should('not.contain', 'Соус с шипами Антарианского плоскоходца');
    });
  });
});