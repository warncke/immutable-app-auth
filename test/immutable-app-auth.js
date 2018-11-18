'use strict'

// load auth module
const auth = require('../lib/immutable-app-auth')
const immutableApp = require('immutable-app')

const ImmutableCoreModel = require('immutable-core-model')
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
    database: dbName,
    host: dbHost,
    password: dbPass,
    user: dbUser,
}

describe('immutable-app-auth', function () {

    var app

    beforeEach(async function () {
        // reset immutable modules
        immutable.reset()
        // create database connection to use for testing
        var mysql = await ImmutableCoreModel.createMysqlConnection(connectionParams)
        // drop any test tables
        await mysql.query('DROP TABLE IF EXISTS account')
        await mysql.query('DROP TABLE IF EXISTS auth')
        await mysql.query('DROP TABLE IF EXISTS device')
        await mysql.query('DROP TABLE IF EXISTS deviceSession')
        await mysql.query('DROP TABLE IF EXISTS session')
        await mysql.query('DROP TABLE IF EXISTS sessionAccount')
        // create new app instance
        app = immutableApp('test-app')
        // set configuration for testing
        app.config({
            // set default database
            mysql: {
                default: mysql,
            },
            // do not exit on listen errors
            exit: false,
            // do not log
            log: false,
            // do not create custom logger
            logger: false,
        })
    })

    it('should start new app with auth', async function () {
        // start server
        await app.start()
    })


})
