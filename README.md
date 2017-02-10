# immutable-app-auth

Immutable App auth module. Provides accounts with local, facebook, and google
signup and device and session tracking.

## Permissions

Permissions can be defined for modules, models, and routes.

Permissions are attributes of a session and depend on whether or not the
session belongs to an account and what account the session belongs to.

Permissions can only be given to permission groups not to accounts. In order
to give permissions to an account the permissions must be assigned to a
group and then the account must be added to the permission group.

### Module Permissions

Module permissions determine whether or not a module method call can be
executed.

Module permissions default to allow. Entire modules or particular methods can
be switched to deny by default.

It a session attempts to execute a process with a denied method call in its
code path this will raise an exception.

### Model Permissions

Models are based on modules so module permissions can also apply to models
but models offer finer grained permissions than models.

* Create Instance: create a new (not revision) model instance.

* Create Instance with Account Id: create a new instance with a specific
    accountId. Allows accounts to be given ability to create content that
    belongs to other accounts.

* Revise Own Instance: make revisions to instances owned by session.

* Revise Instance with Account Id: make revisions to instances owned by a
    specified account id.

* Revise Any Instance: make revisions to any instance of a model.

* Perform Action: Any / Own / Specific

* List Instances: Any / Own / Specific

* List Deleted Instances: Any / Own / Specific

* Assignable: The assignable permission allows members of a permission group to
    add additional members to the same group or to create new permission groups
    that contain a sub-set of the permission group's permissions.

### Route Permissions

The permissions for many routes can be determined by the permissions on the
underlying models and where possible it is better to define permissions at
the model level.

Where needed permissions can be applied to specific routes defined by the
path of the route and the HTTP method.