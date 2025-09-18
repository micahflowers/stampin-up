/// <reference types="cypress" />

// Element finders
const authModal = '[data-testid="authentication"]';
const confirmPasswordTextBox = 'input[data-testid="reg-password-confirmation"]';
const createAccountButton = '[data-testid="btn-create-account"]';
const newAccountCreateAccountButton = '[data-testid="reg-submit"]';
const emailTextBox = 'data-testid="reg-email"]';
const firstNameTextBox = '[data-testid="reg-first-name"]';
const idTextBox = `[data-testid="auth-email"]`;
const lastNameTextBox = '[data-testid="reg-last-name"]';
const errorMessages = '.error--text .v-messages__message, [data-testid="test-message"]';
const passwordTextBox = 'input[data-testid="auth-password"], input[data-testid="reg-password"]';
const signInButton = '[data-testid="auth-submit"]';

export class AuthenticationModal {
    // Get Elements
    getAuthModal() {
        return cy.get(authModal);
    }

    getConfirmPasswordTextBox() {
        return cy.get(confirmPasswordTextBox);
    }

    getCreateAccountButton() {
        return cy.get(createAccountButton);
    }

    getEmailTextBox() {
        return cy.get(emailTextBox);
    }

    getErrorMessages() {
        return cy.get(errorMessages);
    }

    getFirstNameTextBox() {
        return cy.get(firstNameTextBox);
    }

    getIdTextBox() {
        return cy.get(idTextBox);
    }

    getLastNameTextBox() {
        return cy.get(lastNameTextBox);
    }

    getNewAccountCreateAccountButton() {
        return cy.get(newAccountCreateAccountButton);
    }

    getPasswordTextBox() {
        return cy.get(passwordTextBox).filter(':visible');
    }

    getSignInButton() {
        return cy.get(signInButton);
    }
}