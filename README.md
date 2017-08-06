# immutable-app-auth

Immutable App Auth integrates with
[Immutable App](https://www.npmjs.com/package/immutable-app)
to provide device and session tracking, authentication and access control.

Immutable App Auth currently supports authentication via Facebook and Google.

Immutable App Auth integrates with
[Immutable Access Control](https://www.npmjs.com/package/immutable-access-control)
and loads the access control rules and roles that are used for access control.

## Immutable App Auth v0.7 and Immutable Core Model v3

Immutable App Auth v0.7 is required to support the breaking changes that were made
in Immutable Core Model v3.

Immutable App v0.7 is not compatible with Imutable Core Model v2.

## Using Immutable App Auth

    app.js
    ------

    const immutableApp = require('immutable-app')`
    const immutableAppAuth = require('immutable-app-auth')

    immutableAppAuth.config({
        device: {
            cookie: {
                domain: '.your-app.com',
            },
        },
        facebook: {
            callbackHost: 'https://your-app.com',
            clientId: 'XXX',
            clientSecret: 'XXX',
        },
        google: {
            callbackHost: 'https://your-app.com',
            clientId: 'XXX',
            clientSecret: 'XXX',
        },
        session: {
            cookie: {
                domain: '.your-app.com',
            },
        },
    })

    immutableApp.config({ ... })

In this example Facebook and Google are configured as authentication providers
and the domain for the device and session cookies is set.

### device configuration

* cookie - object with device cookie config
    * domain - domain name for device cookie ('')
    * expires - expiration defaults to far future (new Date(2147483647000))
    * name - name of cookie to set ('deviceId')

Any other properties set will be used as options for res.cookie()

### facebook configuation

* callbackHost - protocol and host for callback url ('')
* callbackPath - path for callback url ('/auth/facebook/callback')
* clientId - facebook client id ('')
* clientSecret - facebook client secret ('')
* loginPath - login path that redirects to facebook ('/auth/facebook/login')profileFields - profile data to request from facebook
                (['id', 'emails', 'name', 'gender', 'picture.type(large)'])
* scope - scope for facebook access (['email'])

### google configuration

* callbackHost - protocol and host for callback url ('')
* callbackPath - path for callback url ('/auth/google/callback')
* clientId - google client id ('')
* clientSecret - google client secret ('')
* loginPath - login path that redirects to google ('/auth/google/login')
* scope - scope for google access (['email'])

### session configuration

* access - object with config for access id
    * cookie - object with access id cookie config
* cookie - object with session cookie config
    * domain - domain name for session cookie ('')
    * expires - expiration defaults to session context only (0)
    * name - name of cookie to set ('sessionId')
* currencies - object with 3 letter code (capitalized) and name of
             supported currencies for app ({USD: 'United States Dollar'})
* defaultCurrency - string default currency code (USD)
* defaultLanguage - string default language (eng)
* defaultTimezone - string timezone (UTC)
* geoip - string abs path to maxmind geoip2 database file
* languages - object with language 3 digit lower case language code and anme
            ({eng: 'English'})

## Immutable App Auth architecture

Immutable App Auth identifies clients by device, session and account.

### device

The purpose of device tracking is track multiple different sessions and account
using the same physical device.

By default the device id is based on the user agent and ip address of the
client. More elaborate "fingerprinting" methods are possible but the basic idea
is to identify distinct clients without relying on cookies.

A deviceId cookie will be set but if the cookie is not sent by the client the
same deviceId will be calculate again from the user agent and ip address.

### session

All requests take place within the context of a session.

[Immutable Core](https://www.npmjs.com/package/immutable-core) and many other
components of the Immutable framework use a session and Immutable App Auth
initializes this session.

If the client sends a sessionId cookie an existing session will be loaded if
the id exists.

If a session does not exist for the client a new session will be created

### session-location

The location for the session is tracked using both MaxMind GeoIP and
`navigator.location` in the browser.

### profile

A profile is created for each session if it does not exist and if the session
is logged in then the profile for the account is loaded.

The profile contains information like location, timezone, language and currency
which will be set automatically unless set by the user.

### device-session

Whenever a new session is created a deviceSession record is created to link the
session to the current device.

### session-account

When a sessionId cookie is sent by the client the sessionAccount model is
queried to check if the session is associated with an account. If the session
is associated with an account the roles for that account will be loaded and
used for access control.

Whenever a client creates or logs into an account a new sessionAccount record is
created to link the current session to the account.

### role-account

The roleAccount model links accounts to roles.

### role

The role model provides the names of roles and the types of permissions the role
grants - i.e. access, assign, revoke.

Roles are assigned to accounts via roleAccount and access rules are assigned to
roles via roleAccess.

If the role has access permission only then sessions with the role will be able
to access all of the resources defined by the role's linked access rules.

If the role has assign or revoke permissions then session with the role will be
able to assign and/or revoke any of the role's linked access rules to other
accounts if they also have the appropriate permissions to administer roles.

### role-access

The roleAccess model links roles to access rules.

### access

The access model provides access rules that can be linked to roles in order to
assign them to accounts.

### account

The account model consists solely of an id and createTime. All account data is
stored in other models indexed by accountId.

The accountId is the default value used for determining ownership of records.

Models have an accountId property by default and whenever a model is created
the accountId property will be populated from the session.

Models can specify alternative properties to use as an accessId but Immutable
App Auth must be configured to load the alternative properties onto the
session.

### auth

Accounts can have one or more auth records from different auth providers. The
auth record provides the details needed to identify an account such as email
and password.

## Immutable App Auth admin functionality

Immutable App Auth provides admin functionality for managing access control
rules, accounts, and roles.

To administer Immutable App Auth go to: /admin/