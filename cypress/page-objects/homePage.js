/// <reference types="cypress" />

// Element finders
const closeDialogButton = '[data-testid="close-dialog"]';
const dialog = '.v-dialog';
const signInButton = '[data-testid="menu-user-btn-signin"]';
const userAccountButton = '[data-testid="menu-user-firstname"]';

// Menu items
const accountSettingsLink = 'a[href="/account/settings"]';
const addressesLink = 'a[href="/account/address"]';

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

    getCloseDialogButton() {
        return cy.get(closeDialogButton);
    }

    getSignInButton() {
        return cy.get(signInButton);
    }

    getStampinRewardsMaybeLaterButton() {
        return cy.get(`${dialog} button`).contains('Maybe Later');
    }

    getUserAccountButton() {
        return cy.get(userAccountButton).parents('button');
    }
}