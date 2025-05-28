
describe('Login/SignIn Page', () => {
    beforeEach(() => {
        cy.visit('https://id.uphillhealth.com/signin?service=uphillhealth.com&idpdomain=uphillchallenge&continue=https:%2F%2Fuphillhealth.com%2Fuphillchallenge%2Fdesk%3FroutePackageId%3DROUTE_PACKAGE_AS_CHALLENGE%26page%3D0%26tab%3D2%26phasesIds%3D*')
        cy.get('#onetrust-accept-btn-handler').click()
        cy.get('input[id="mat-input-0"]').type(Cypress.env('user_name'))
        cy.get('.login-cta').click()
        cy.get('#mat-input-1').type(Cypress.env('user_password'))
        cy.get('.login-cta').click()
    })

    it('As a healthcare professional, I should be able to change the language between EN to PT.', () => {
        cy.origin('https://uphillhealth.com', () => {
            cy.get('[data-testid="Avatar"]').last().should('be.visible').click();
            cy.contains('English').should('be.visible').click();
            cy.contains('p', 'Português').should('be.visible').click();
            cy.contains('Jornadas de Doentes').should('be.visible');
            cy.get('button:contains("Mais filtros")').should('be.visible');
        })
    })

    it('As a healthcare professional, I should be able to change the language between PT to EN.', () => {
        cy.origin('https://uphillhealth.com', () => {
            cy.get('[data-testid="Avatar"]').last().should('be.visible').click();
            cy.contains('Português').should('be.visible').click();
            cy.contains('p', 'English').should('be.visible').click();
            cy.contains('Patients Journeys').should('be.visible');
            cy.get('button:contains("More filters")').should('be.visible');
        })
    })

})