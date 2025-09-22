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

    // Test helpers
    validateUpdateAddress(userInfo) {
        // Validate address api request
        cy.wait('@updateAddress').then(({ request, response }) => {
            const {
                addressLine1,
                addressLine2,
                city,
                firstName,
                lastName,
                phoneNumber,
                postalCode,
                region
            } = request.body

            expect(addressLine1).to.eq(userInfo.address.addr1);
            expect(addressLine2).to.eq(userInfo.address.addr2);
            expect(city).to.eq(userInfo.address.city);
            expect(firstName).to.eq(userInfo.fname);
            expect(lastName).to.eq(userInfo.lname);
            expect(phoneNumber.replace(/[^0-9]/g, '')).to.eq(userInfo.phone);
            expect(postalCode).to.eq(userInfo.address.zip);
            expect(region).to.eq(userInfo.address.region);

            // Validate address api response status
            expect(response.statusCode, 'Update address request should be successful').to.eq(200);
        })

        // Validate UI
        this.getEditShippingAddressButton().click();
        this.getFirstNameTextBox().invoke('val').should('eq', userInfo.fname);
        this.getLastNameTextBox().invoke('val').should('eq', userInfo.lname);
        this.getAddress1TextBox().invoke('val').should('eq', userInfo.address.addr1);
        this.getAddress2TextBox().invoke('val').should('eq', userInfo.address.addr2);
        this.getCityTextBox().invoke('val').should('eq', userInfo.address.city);
        this.getZipCodeTextBox().invoke('val').should('eq', userInfo.address.zip);
    }
}