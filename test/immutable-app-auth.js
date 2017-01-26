'use strict'

const app = require('immutable-app')
const auth = require('../lib/immutable-app-auth')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const httpClient = require('immutable-http-client')

chai.use(chaiAsPromised)
const assert = chai.assert

describe('immutable-app-auth', function () {

    beforeEach(async function () {
        // catch async errors
        try {
            // reset global app config
            await app.reset()
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