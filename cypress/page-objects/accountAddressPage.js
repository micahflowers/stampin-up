/// <reference types="cypress" />

const address1TextBox = '[data-testid="address.addressLine1"]';
const address2TextBox = '[data-testid="address-field-addressLine2"]';
const cityTextBox = '[data-testid="address-field-city"]';
const defaultShippingAddressCheckBox = '[data-testid="address-default"]';
const editShippingAddressButton = '[data-testid="address-list-default"] [data-testid="addresslist-item-btn-edit"]';
const firstNameTextBox = '[data-testid="address-field-first-name"]';
const lastNameTextBox = '[data-testid="address-field-last-name"]';
const listItems = '.v-select-list .v-list-item';
const phoneNumberTextBox = '[data-testid="address-telephone"]';
const saveAddressButton = '[data-testid="address-save"]';
const zipCodeTextBox = '[data-testid="address-field-postalCode"]';

export class AccountAddressPage {
    // Page Functions
    updateState(state) {
        this.getStateTextBox().type(state).click();
        this.getListItems().contains(state).click();
    }

    // Get Element
    getAddress1TextBox() {
        return cy.get(address1TextBox);
    }

    getAddress2TextBox() {
        return cy.get(address2TextBox);
    }

    getCityTextBox() {
        return cy.get(cityTextBox);
    }

    getDefaultShippingAddressCheckBox() {
        return cy.get(defaultShippingAddressCheckBox).parents('.v-input__slot');
    }

    getEditShippingAddressButton() {
        return cy.get(editShippingAddressButton);
    }

    getFirstNameTextBox() {
        return cy.get(firstNameTextBox);
    }

    getLastNameTextBox() {
        return cy.get(lastNameTextBox);
    }

    getListItems() {
        return cy.get(listItems);
    }

    getPhoneNumberTextBox() {
        return cy.get(phoneNumberTextBox);
    }

    getSaveAddressButton() {
        return cy.get(saveAddressButton);
    }

    getStateTextBox() {
        return cy.get('.v-label').contains(/^State$/)
        .parent()
        .find('input')
        .filter(':visible');
    }

    getZipCodeTextBox() {
        return cy.get(zipCodeTextBox);
    }
}