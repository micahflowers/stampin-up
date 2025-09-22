/// <reference types="cypress" />

import { HomePage } from "../page-objects/homePage";
import { AuthenticationModal } from "../modals/authenticationModal";
import { AccountSettingsPage } from "../page-objects/accountSettingsPage";
import usersInfo from "../fixtures/userInfo.json";
import { AccountAddressPage } from "../page-objects/accountAddressPage";

const homePage = new HomePage();
const authModal = new AuthenticationModal();
const accountSettingsPage = new AccountSettingsPage();
const accountAddressPage = new AccountAddressPage();
const userInfo = usersInfo.users[0];
const locale = Cypress.env('LOCALE');


describe('New Account Tests', () => {
    beforeEach(() => {
        // Add intercepts and aliases
        cy.intercept('POST', `${locale}/account`).as('createUser');
        cy.intercept('POST', `${locale}/account/sign-in`).as('signIn');
        cy.intercept('PUT', `/${locale}/account/contact`).as('updateUser');
        cy.intercept('POST', `/${locale}/address`).as('updateAddress');

        // Create a unique email for the new user
        userInfo.email = `${crypto.randomUUID().split('-')[0]}@${userInfo.email.split('@')[1]}`;

        // Open create account form for each test
        homePage.visit();
        homePage.getSignInButton().click();
        authModal.getCreateAccountButton().click();
    });

    it('Create new account and update info', function() {
        completeAccountForm();

        // Validate POST account create user api request
        cy.wait('@createUser').then(({ request, response }) => {
            const {
                email,
                firstName,
                lastName,
            } = request.body.customer

            expect(email).to.eq(userInfo.email);
            expect(firstName).to.eq(userInfo.fname);
            expect(lastName).to.eq(userInfo.lname);

            expect(response.statusCode).to.eq(200);
        })
        
        // Validate the new user is signed in
        cy.wait('@signIn').its('response.statusCode').should('eq', 200);

        // Handle Join Stampin' Rewards modal
        homePage.getStampinRewardsMaybeLaterButton().click();
        homePage.getCloseDialogButton().click();
        homePage.getCloseDialogButton().click();

        // Go to Account Settings
        homePage.goToAccountSettings();
        accountSettingsPage.getEditContactButton().click();
        accountSettingsPage.getPhoneNumberTextBox().type(userInfo.phone);
        accountSettingsPage.updatePreferredContactMethod(userInfo.contactPref);
        accountSettingsPage.updateBirthdate(userInfo.birthday);

        // Save the changes
        accountSettingsPage.getSaveChangesButton().click();

        // Validate profile changes
        accountSettingsPage.validateUpdateProfile(userInfo);

        // Go to address page
        accountSettingsPage.getAccountNavAddressesLink().click();
        accountAddressPage.getAddress1TextBox().should('be.visible');

        // Update Address
        accountAddressPage.getFirstNameTextBox().type(userInfo.fname);
        accountAddressPage.getLastNameTextBox().type(userInfo.lname);
        accountAddressPage.getAddress1TextBox().type(userInfo.address.addr1);
        accountAddressPage.getAddress2TextBox().type(userInfo.address.addr2);
        accountAddressPage.getCityTextBox().type(userInfo.address.city);
        accountAddressPage.updateState(userInfo.address.state);
        accountAddressPage.getZipCodeTextBox().type(userInfo.address.zip);
        accountAddressPage.getPhoneNumberTextBox().type(userInfo.phone);
        accountAddressPage.getDefaultShippingAddressCheckBox().click();

        // Save the changes
        accountAddressPage.getSaveAddressButton().click();

        // Validate address changes
        accountAddressPage.validateUpdateAddress(userInfo);
    })

    it('Create new account - Missing first name', function() {
        completeAccountForm({ enterFirstName: false });
        authModal.getErrorMessages().should('contain.text', 'The First Name field is required.');
    })

    it('Create new account - Missing last name', function() {
        completeAccountForm({ enterLastName: false });
        authModal.getErrorMessages().should('contain.text', 'The Last Name field is required.');
    })

    it('Create new account - Missing email', function() {
        completeAccountForm({ enterEmail: false });
        authModal.getErrorMessages().should('contain.text', 'The Email Address field is required.');
    })

    it('Create new account - Missing password', function() {
        completeAccountForm({ enterPassword: false });
        authModal.getErrorMessages().should('contain.text', 'The Password field is required.');
    })

    it('Create new account - Missing confirm password', function() {
        completeAccountForm({ enterConfirmPassword: false });
        authModal.getErrorMessages().should('contain.text', 'The Password field is required.');
    })

    it('Create new account - Password does not match confirmation', function() {
        completeAccountForm({ confirmPassword: 'DOES NOT MATCH' });
        authModal.getErrorMessages().should('contain.text', 'The Password field confirmation does not match.');
    })

    
    const completeAccountForm = (options = {}) => {
        const {
            enterFirstName = true,
            enterLastName = true,
            enterEmail = true,
            enterPassword = true,
            enterConfirmPassword = true,
            password = Cypress.env('PASSWORD'),
            confirmPassword = Cypress.env('PASSWORD')
        } = options;

        if(enterFirstName) {
            authModal.getFirstNameTextBox().type(userInfo.fname);
        }
        
        if(enterLastName) {
            authModal.getLastNameTextBox().type(userInfo.lname);
        }
        
        if(enterEmail) {
            authModal.getEmailTextBox().type(userInfo.email);
        }
        
        if(enterPassword) {
            authModal.getPasswordTextBox().type(password, { log: false }); // don't log passwords
        }
        
        if(enterConfirmPassword) {
            authModal.getConfirmPasswordTextBox().type(confirmPassword, {log: false }); // don't log passwords
        }

        // Submit Form
        authModal.getNewAccountCreateAccountButton().click();
    }
})