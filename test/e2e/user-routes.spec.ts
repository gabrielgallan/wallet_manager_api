import { it, expect, describe, expectTypeOf } from 'vitest'
import { setupConfig } from './setup/setup-e2e.ts'
import { CheckDatabasesLength } from 'root/test/e2e/helpers/services-utilities/databases.ts'
import { UserServicesUtilities } from './helpers/services-utilities/users.ts'
import { AccountServicesUtilities } from './helpers/services-utilities/accounts.ts'
import { UpdateUserBodyExample } from './helpers/data-examples/user-examples.ts'

describe('User routes', () => {
    setupConfig()

    // Create user-account
    it('Create user and account', async () => {
        await UserServicesUtilities.create()

        await CheckDatabasesLength(['users', 'accounts'], [1,1])
    })

    // Create and consult user and account
    it('Consult user and account', async () => {
        // POST /users
        const returnedUser = await UserServicesUtilities.create()
        
        // GET /users/:id
        const GetUserResponse = await UserServicesUtilities.consult(returnedUser.id)

        expect(GetUserResponse).toEqual(returnedUser)
        
        // GET /users/:id/accounts
        const GetAccountResponse = await AccountServicesUtilities.consult(returnedUser.id)

        expect(GetAccountResponse).toHaveProperty('user_id', returnedUser.id)
        expect(GetAccountResponse).toHaveProperty('holder', returnedUser.name)

        await CheckDatabasesLength(['users', 'accounts'], [1,1])
    })

    // Create, update and consult user
    it('Update and consult user', async () => {
        // POST /users
        const returnedUser = await UserServicesUtilities.create()

        // PUT /users/:id
        const updatedUser = await UserServicesUtilities.update(returnedUser.id)

        expectTypeOf(updatedUser).toEqualTypeOf(returnedUser)

        expect(updatedUser.email).toEqual(UpdateUserBodyExample.email)

        // GET /users/:id
        const GetUserResponse = await UserServicesUtilities.consult(returnedUser.id)

        expect(GetUserResponse).toEqual(expect.objectContaining(updatedUser))
    })

    // Create user-account, delete and consult
    it('Delete and consult user', async () => {
        // POST /users
        const returnedUser = await UserServicesUtilities.create()

        await CheckDatabasesLength(['users', 'accounts'], [1,1])

        // DELETE /users/:id
        const DeleteUserResponse = await UserServicesUtilities.delete(returnedUser.id)

        expect(DeleteUserResponse).toEqual(
            { status: 'success', data: { message: `User deleted: ${returnedUser.id}` } }
        )

        // GET /users/:id
        const GetUserResponse = await UserServicesUtilities.consultExpectError(returnedUser.id)

        expect(GetUserResponse).toEqual(
            { status: 'failed', error: 'User not found' }
        )

        // GET /users/:id/accounts
        const GetAccountResponse = await AccountServicesUtilities.consultExpectError(returnedUser.id)

        expect(GetAccountResponse).toEqual(
            { status: 'failed', error: 'Account not found' }
        )

        await CheckDatabasesLength(['users', 'accounts'], [0,0])
    })
})