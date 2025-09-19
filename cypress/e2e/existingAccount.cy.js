/// <reference types="cypress" />

import { HomePage } from "../page-objects/homePage";
import { AuthenticationModal } from "../modals/authenticationModal";
import { AccountSettingsPage } from "../page-objects/accountSettingsPage";
import { AccountAddressPage } from "../page-objects/accountAddressPage";
import userInfo from "../fixtures/userInfo.json";

const homePage = new HomePage();
const authModal = new AuthenticationModal();
const accountSettingsPage = new AccountSettingsPage();
const accountAddressPage = new AccountAddressPage();
const locale = Cypress.env('LOCALE');

describe('Existing Account Tests', () => {

    beforeEach(() => {
        // Add intercepts and aliases
        cy.intercept('POST', `/${locale}/account/sign-in`).as('signIn');
        cy.intercept('PUT', `/${locale}/account/contact`).as('updateUser');
        cy.intercept('PUT', `/${locale}/address`).as('updateAddress');
        cy.intercept('GET', `${locale}/address`).as('getAddress');
        cy.intercept('GET', `${locale}/address/countries`).as('getCountries');
    });
    
    it('Sign in', function() {
        signIn();

        // Validate the API request was successful
        cy.wait('@signIn').its('response.statusCode').should('eq', 200);

        // Validate the sign in dialog is no longer displayed on the page.
        authModal.getAuthModal().should('not.exist');

        // Validate the users account button is visible
        homePage.getUserAccountButton().should('be.visible');
    })

    it('Sign in - Missing user name', function() {
        signIn({ userName: '' });
        failedSignInValidation('The Email Address field is required.');
    })
    
    it('Sign in - Missing password', function() {
        signIn({ password: '' });
        failedSignInValidation('The Password field is required.');
    })
    
    it('Sign in - Incorrect User Name', function() {
        signIn({ userName: 'INCORRECT_USERNAME' });
        failedSignInValidation('Your email or password was incorrect.');
    })
    
    it('Sign in - Incorrect password', function() {
        signIn({ password: 'INCORRECT_PASSWORD' });
        failedSignInValidation('Your email or password was incorrect.');
    })

    it('Update user profile', function() {
        signIn();
        cy.wait('@signIn');
        authModal.getAuthModal().should('not.exist');

        // Open account settings
        homePage.goToAccountSettings();
        accountSettingsPage.getEditContactButton().click();

        // Select the user info to use
        accountSettingsPage.getFirstNameTextBox()
        .invoke('val')
        .then((val) => {
            const selectedUserInfo = userInfo.users.find(u => u.fname !== val);
            
            // Update the Contact Info
            accountSettingsPage.getFirstNameTextBox().clear().type(selectedUserInfo.fname);
            accountSettingsPage.getLastNameTextBox().clear().type(selectedUserInfo.lname);
            accountSettingsPage.getPhoneNumberTextBox().clear().type(selectedUserInfo.phone);
            accountSettingsPage.updatePreferredContactMethod(selectedUserInfo.contactPref);
            accountSettingsPage.updateBirthdate(selectedUserInfo.birthday);

            // Save the changes
            accountSettingsPage.getSaveChangesButton().click();
    
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
                    `${selectedUserInfo.birthday.year}-${selectedUserInfo.birthday.month_2digit}-${selectedUserInfo.birthday.day_2digit}`
                );
                expect(email).to.eq(selectedUserInfo.email);
                expect(firstName).to.eq(selectedUserInfo.fname);
                expect(lastName).to.eq(selectedUserInfo.lname);
                expect(newEmail).to.eq(selectedUserInfo.email);
                expect(phoneNumber.replace(/[^0-9]/g, '')).to.eq(selectedUserInfo.phone);
                expect(preferredContact).to.eq(selectedUserInfo.contactPrefAbbr);

                // Validate account/contact response status
                expect(response.statusCode, 'Response should be successful').to.eq(200);
            })

            //Validate UI
            accountSettingsPage.getBirthdateInput().invoke('val').should('eq', selectedUserInfo.birthdayFormatted);
            accountSettingsPage.getEmailTextBox().invoke('val').should('eq', selectedUserInfo.email);
            accountSettingsPage.getFirstNameTextBox().invoke('val').should('eq', selectedUserInfo.fname);
            accountSettingsPage.getLastNameTextBox().invoke('val').should('eq', selectedUserInfo.lname);
            accountSettingsPage.getPhoneNumberTextBox().invoke('val').then((value) => {
                expect(value.replace(/[^0-9]/g, '')).to.eq(selectedUserInfo.phone);
            })
            accountSettingsPage.getPreferredContactMethodValue().should('contain.text', selectedUserInfo.contactPref);
        })
    })

    it('Update Address', function() {
        signIn();
        cy.wait('@signIn');
        authModal.getAuthModal().should('not.exist');

        // Open account address page
        homePage.goToAddresses();
        cy.wait('@getAddress');
        accountAddressPage.getEditShippingAddressButton().click();
        cy.wait('@getCountries');

        // Wait for the address fields to be displayed on the page
        accountAddressPage.getAddress1TextBox().should('be.visible');

        // Select the address to use
        accountAddressPage.getFirstNameTextBox().invoke('val').then((val) => {
            const selectedAddress = userInfo.users.find(u => u.fname !== val);

            // Update Address
            accountAddressPage.getFirstNameTextBox().clear().type(selectedAddress.fname);
            accountAddressPage.getLastNameTextBox().clear().type(selectedAddress.lname);
            accountAddressPage.getAddress1TextBox().clear().type(selectedAddress.address.addr1);
            accountAddressPage.getAddress2TextBox().clear().type(selectedAddress.address.addr2);
            accountAddressPage.getCityTextBox().clear().type(selectedAddress.address.city);
            accountAddressPage.updateState(selectedAddress.address.state);
            accountAddressPage.getZipCodeTextBox().clear().type(selectedAddress.address.zip);
            accountAddressPage.getPhoneNumberTextBox().clear().type(selectedAddress.phone);

            // Save the changes
            accountAddressPage.getSaveAddressButton().click();

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

                expect(addressLine1).to.eq(selectedAddress.address.addr1);
                expect(addressLine2).to.eq(selectedAddress.address.addr2);
                expect(city).to.eq(selectedAddress.address.city);
                expect(firstName).to.eq(selectedAddress.fname);
                expect(lastName).to.eq(selectedAddress.lname);
                expect(phoneNumber.replace(/[^0-9]/g, '')).to.eq(selectedAddress.phone);
                expect(postalCode).to.eq(selectedAddress.address.zip);
                expect(region).to.eq(selectedAddress.address.region);

                // Validate address api response status
                expect(response.statusCode, 'Update address request should be successful').to.eq(200);
            })

            // Validate UI
            accountAddressPage.getEditShippingAddressButton().click();
            accountAddressPage.getFirstNameTextBox().invoke('val').should('eq', selectedAddress.fname);
            accountAddressPage.getLastNameTextBox().invoke('val').should('eq', selectedAddress.lname);
            accountAddressPage.getAddress1TextBox().invoke('val').should('eq', selectedAddress.address.addr1);
            accountAddressPage.getAddress2TextBox().invoke('val').should('eq', selectedAddress.address.addr2);
            accountAddressPage.getCityTextBox().invoke('val').should('eq', selectedAddress.address.city);
            accountAddressPage.getZipCodeTextBox().invoke('val').should('eq', selectedAddress.address.zip);
        })
    })

    const signIn = (options = {}) => {
        const {
            userName = Cypress.env('USERNAME'),
            password = Cypress.env('PASSWORD')
        } = options

        homePage.visit();
        homePage.getSignInButton().click();

        if(userName !== '') {
            authModal.getIdTextBox().type(userName);
        }
        
        if(password !== ''){
            authModal.getPasswordTextBox().type(password, { log: false }); // Do not log passwords
        }

        authModal.getSignInButton().click();
    }

    const failedSignInValidation = (validationText, callsApi) => {
        // Validate auth modal is still visible and has the correct message
        authModal.getAuthModal().should('be.visible');
        authModal.getErrorMessages().should('contain.text', validationText);

        // Validate API returns 401 if form is submitted
        if(callsApi) {
            cy.wait('@signIn').its('response.statusCode').should('eq', 401);
        }
    }
})