
describe('Login/SignIn Page', () => {
    beforeEach(() => {
        cy.visit('https://id.uphillhealth.com/signin?service=uphillhealth.com&idpdomain=uphillchallenge&continue=https:%2F%2Fuphillhealth.com%2Fuphillchallenge%2Fdesk%3FroutePackageId%3DROUTE_PACKAGE_AS_CHALLENGE%26page%3D0%26tab%3D2%26phasesIds%3D*')
        cy.get('#onetrust-accept-btn-handler').click()
        cy.get('input[id="mat-input-0"]').type(Cypress.env('user_name'))
        cy.get('.login-cta').click()
        cy.get('#mat-input-1').type(Cypress.env('user_password'))
        cy.get('.login-cta').click()
    })

    it(' As a healthcare professional, I should be able to filter patients by Communication Status, under “more filters” option.', () => {
        cy.wait(1000)
        cy.origin('https://uphillhealth.com', () => {
            cy.get('[data-testid="Button"]').should('be.visible').click();
            cy.get('button[data-testid="DropdownTrigger"]').eq(5).click();
            //cy.get('div[role="menuitem"]').contains('Completed').click();
            cy.get('div[role="menuitem"]').eq(0).click();
            cy.wait(1000)
            //cy.contains('c-dXvcmt c-fiigYS c-dXvcmt-cJbzxd-medium-true c-dXvcmt-TkcIS-caption-true c-fiigYS-cJbzxd-medium-true c-fiigYS-TkcIS-caption-true', 'Completed').should('be.visible');
           // cy.contains('p', 'Completed').should('be.visible');
        });
    })

    it('As a healthcare professional, I should be able to search patients by their name.', () => {
        cy.origin('https://uphillhealth.com', () => {
            cy.get('input[placeholder="Search..."]').type('João');
            cy.contains('div', 'João Silva').should('be.visible');
        });
    });

    it('As a system, it should alert users if it fails to fetch search results due to internet connection.', () => {
        cy.switchToDomain('https://uphillhealth.com', () => {
            cy.intercept('GET', 'https://api.uphillhealth.com/436/patient-sessions/phases?institutionId=436&tab=2&sizePerPage=25&page=0&routePackageId=ROUTE_PACKAGE_AS_CHALLENGE&status=COMPLETED,REVOKED&patient=joao', {
                statusCode: 0, // Simulate a network error
                forceNetworkError: true // Simulate a complete network failure
            }).as('searchApiFailed');
            cy.get('input[placeholder="Search..."]').type('joao');
            cy.wait('@searchApiFailed');
            cy.contains('div', 'Failed to fetch search results. Check your connection.').should('be.visible');
            cy.get('.search-results-list').should('not.exist');
        });
    });

    it('should display an alert when search fails due to server error (500 status)', () => {
        cy.origin('https://uphillhealth.com', () => {
            cy.intercept('GET', 'https://api.uphillhealth.com/436/patient-sessions/phases?institutionId=436&tab=2&sizePerPage=25&page=0&routePackageId=ROUTE_PACKAGE_AS_CHALLENGE&status=COMPLETED,REVOKED&patient=joao', {
                statusCode: 500,
                body: { message: 'Internal Server Error' }
            }).as('searchApiServerError');
            cy.get('input[placeholder="Search..."]').type('test-server-error');
            cy.wait('@searchApiServerError');
            cy.contains('div', 'An unexpected server error occurred.').should('be.visible');
            cy.get('[data-testid="error-message-alert"]').should('be.visible').and('contain.text', 'server error');
            cy.get('.search-results-list').should('not.exist');
        });
    });

})