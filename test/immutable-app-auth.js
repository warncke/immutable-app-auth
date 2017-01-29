'use strict'

// require immutable-app before any app modules
const immutableApp = require('immutable-app')
// load auth module
const auth = require('../lib/immutable-app-auth')

const ImmutableDatabaseMariaSQL = require('immutable-database-mariasql')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const httpClient = require('immutable-http-client')
const immutable = require('immutable-core')

chai.use(chaiAsPromised)
const assert = chai.assert

const dbHost = process.env.DB_HOST || 'localhost'
const dbName = process.env.DB_NAME || 'test'
const dbPass = process.env.DB_PASS || ''
const dbUser = process.env.DB_USER || 'root'

// use the same params for all connections
const connectionParams = {
    charset: 'utf8',
    db: dbName,
    host: dbHost,
    password: dbPass,
    user: dbUser,
}

describe('immutable-app-auth', function () {

    var app

    // create database connection to use for testing
    var database = new ImmutableDatabaseMariaSQL(connectionParams)

    beforeEach(async function () {
        // catch async errors
        try {
            // reset immutable modules
            immutable.reset()
            // drop any test tables
            await database.query('DROP TABLE IF EXISTS account')
            await database.query('DROP TABLE IF EXISTS auth')
            await database.query('DROP TABLE IF EXISTS authDelete')
            await database.query('DROP TABLE IF EXISTS device')
            await database.query('DROP TABLE IF EXISTS deviceSession')
            await database.query('DROP TABLE IF EXISTS session')
            await database.query('DROP TABLE IF EXISTS sessionAccount')
            // create new app instance 
            app = immutableApp('test-app')
            // set configuration for testing
            app.config({
                // set default database
                database: {
                    default: database,
                },
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