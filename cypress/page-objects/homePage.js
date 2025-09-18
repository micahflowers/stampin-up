/// <reference types="cypress" />

// Element finders
const signInButton = '[data-testid="menu-user-btn-signin"]';
const userAccountButton = '[data-testid="menu-user-firstname"]';

// Menu items
const accountSettingsLink = 'a[href="/account/settings"]';
const addressesLink = 'a[href="/account/settings"]';

export class HomePage {
    // Page Functions
    visit() {
        cy.visit('/');
    }

    goToAccountSettings() {
        this.getUserAccountButton().click();
        this.getAccountSettingsLink().click();
    }

    goToAddresses() {
        this.getUserAccountButton().click();
        this.getAddressesLink().click();
    }

    // Get Elements
    getAccountSettingsLink() {
        return cy.get(accountSettingsLink);
    }

    getAddressesLink() {
        return cy.get(addressesLink);
    }

    getSignInButton() {
        return cy.get(signInButton);
    }

    getUserAccountButton() {
        return cy.get(userAccountButton).parents('button');
    }
}