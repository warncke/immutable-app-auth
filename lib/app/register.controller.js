'use strict'

/* npm modules */
const ImmutableCoreModelForm = require('immutable-core-model-form')
const bcrypt = require('bcrypt')
const httpError = require('immutable-app-http-error')
const httpRedirect = require('immutable-app-http-redirect')
const randomUniqueId = require('random-unique-id')

/* controller specification */
module.exports = {
    paths: {
        '/register': {
            get: {
                method: getRegister,
                role: 'anonymous',
                template: 'register',
            },
            post: {
                input: {
                    email: 'body.email',
                    firstName: 'body.firstName',
                    lastName: 'body.lastName',
                    password: 'body.password',
                },
                method: postRegister,
                role: 'anonymous',
                template: 'register',
            },
        },
    },
}

/* register form */
var form = new ImmutableCoreModelForm({
    fields: [
        {
            inputType: 'text',
            name: 'firstName',
            placeholder: 'First Name',
            required: true,
        },
        {
            inputType: 'text',
            name: 'lastName',
            placeholder: 'Last Name',
            required: true,
        },
        {
            inputType: 'text',
            name: 'email',
            placeholder: 'Email',
            required: true,
        },
        {
            inputType: 'password',
            name: 'password',
            placeholder: 'Password',
            required: true,
        },
    ],
    method: 'post',
    submit: {
        title: 'Register',
    },
})

/* controller functions */

/**
 * @function getRegister
 *
 * return register form
 */
function getRegister (args) {
    return {
        form: form,
    }
}

/**
 * @function postRegister
 *
 * create new account
 */
async function postRegister (args) {
    // check if email exists
    var auth = await this.model.auth.select.one.by.authProviderId(args.email)
    // if email already in use cannot register
    if (auth) {
        // create new form instance with errors
        var newForm = form.newInstance({
            error: 'Email address already in use',
            input: args,
        })
        // return form with errors
        return {
            form: newForm,
        }
    }
    // get unique id for account
    var accountId = randomUniqueId().id
    // create account
    var accountPromise = this.model.account.createMeta({id: accountId})
    // create password hash
    var passwordHash = await bcrypt.hash(args.password, 10)
    // create auth entry
    var authPromise = this.model.auth.createMeta({
        accountId: accountId,
        data: {
            authProviderId: args.email,
            authProviderName: 'local',
            firstName: args.firstName,
            lastName: args.lastName,
            passwordHash: passwordHash,
        },
    })
    // create session account entry
    var sessionAccountPromise = this.model.sessionAccount.createMeta({
        accountId: accountId,
    })
    // wait for models to be created
    await Promise.all([
        accountPromise,
        authPromise,
        sessionAccountPromise,
    ])
    // redirect to home page
    return httpRedirect('/')
}