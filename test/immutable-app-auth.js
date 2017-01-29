'use strict'

// require immutable-app before any app modules
const immutableApp = require('immutable-app')
// load auth module
const auth = require('../lib/immutable-app-auth')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const httpClient = require('immutable-http-client')

chai.use(chaiAsPromised)
const assert = chai.assert

describe('immutable-app-auth', function () {

    var app

    beforeEach(async function () {
        // catch async errors
        try {
            // create new app instance 
            app = immutableApp('test-app')
            // set configuration for testing
            app.config({
                // do not exit on listen errors
                exit: false,
                // do not log
                log: false,
            })
        }
        catch (err) {
            throw err
        }
    })

    it('should start new app with auth', async function () {
        // catch async errors
        try {
            // start server
            await app.start()
        }
        catch (err) {
            assert.ifError(err)
        }
    })


})