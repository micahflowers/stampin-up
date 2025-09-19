/// <reference types="cypress" />

// Element finders
const accountNavAddressesLink = '[data-testid="account-nav"] a[href="/account/address"]';
const birthdateInput = '[data-testid="birthday-date-picker"]';
const contactCard = '[data-testid="account-card-contact"]';
const datePickerTable = '.v-date-picker-table button';
const datePickerYears = '.v-date-picker-years';
const editContactButton = `${contactCard} [data-testid="edit-contact-setting"]`;
const emailTextBox = '[data-testid="account-card-email"]';
const firstNameTextBox = '[data-testid="account-card-firstName"]';
const lastNameTextBox = '[data-testid="account-card-lastName"]';
const menuItems = '.v-menu__content .v-list-item';
const phoneNumberTextBox = '[data-testid="account-card-phone"]';
const saveChangesButton = '[data-testid="save-changes"]';

export class AccountSettingsPage {
    // Page Functions
    updateBirthdate(date) {
        this.getBirthdateInput().click();
        this.getDatePickerYears().contains(date.year).click();
        this.getDatePickerTable().contains(date.month).click();
        cy.get('.v-date-picker-table button').contains(date.day).click();
    }

    updatePreferredContactMethod(method) {
        this.getPreferredContactMethodInput().click();
        this.getMenuItems().contains(method).click();
    }

    // Get Elements
    getAccountNavAddressesLink() {
        return cy.get(accountNavAddressesLink);
    }
    getBirthdateInput() {
        return cy.get(birthdateInput);
    }

    getDatePickerTable() {
        return cy.get(datePickerTable);
    }

    getDatePickerYears() {
        return cy.get(datePickerYears);
    }

    getEditContactButton() {
        return cy.get(editContactButton);
    }

    getEmailTextBox() {
        return cy.get(emailTextBox);
    }

    getFirstNameTextBox() {
        return cy.get(firstNameTextBox);
    }

    getLastNameTextBox() {
        return cy.get(lastNameTextBox);
    }

    getMenuItems() {
        return cy.get(menuItems).filter(':visible');
    }

    getPhoneNumberTextBox() {
        return cy.get(phoneNumberTextBox);
    }

    getPreferredContactMethodInput() {
        // This didn't have a data-testid that I could find.
        // Selecting by the label text
        return cy.get('.v-input label').contains('Preferred Method of Contact')
        .parents('div[role="button"]')
        .find('input')
        .filter(':visible');
    }

    getPreferredContactMethodValue() {
        return cy.get('label~.v-select__selections .v-select__selection');
    }

    getSaveChangesButton() {
        return cy.get(saveChangesButton);
    }
}