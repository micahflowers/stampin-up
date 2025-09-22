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

    // Test helpers
    validateUpdateProfile(userInfo) {
        // Validate account/contact api request
        cy.wait('@updateUser').then(({ request, response }) => {
            const {
                birthday,
                email,
                firstName,
                lastName,
                newEmail,
                phoneNumber,
                preferredContact
            } = request.body

            expect(birthday).to.eq(
                `${userInfo.birthday.year}-${userInfo.birthday.month_2digit}-${userInfo.birthday.day_2digit}`
            );
            expect(email).to.eq(userInfo.email);
            expect(firstName).to.eq(userInfo.fname);
            expect(lastName).to.eq(userInfo.lname);
            expect(newEmail).to.eq(userInfo.email);
            expect(phoneNumber.replace(/[^0-9]/g, '')).to.eq(userInfo.phone);
            expect(preferredContact).to.eq(userInfo.contactPrefAbbr);

            // Validate account/contact response status
            expect(response.statusCode, 'Response should be successful').to.eq(200);
        })

        //Validate UI
        this.getBirthdateInput().invoke('val').should('eq', userInfo.birthdayFormatted);
        this.getEmailTextBox().invoke('val').should('eq', userInfo.email);
        this.getFirstNameTextBox().invoke('val').should('eq', userInfo.fname);
        this.getLastNameTextBox().invoke('val').should('eq', userInfo.lname);
        this.getPhoneNumberTextBox().invoke('val').then((value) => {
            expect(value.replace(/[^0-9]/g, '')).to.eq(userInfo.phone);
        })
        this.getPreferredContactMethodValue().should('contain.text', userInfo.contactPref);

    }
}