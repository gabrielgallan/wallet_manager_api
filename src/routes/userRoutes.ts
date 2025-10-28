import { FastifyInstance } from 'fastify'
import { RequestController } from '../middlewares/handlers/request-services-handler.ts'
import * as userServices from '../services/userService.ts'
import * as accountServives from '../services/accountService.ts'
import * as parse from '../middlewares/pre-validation/data-validations.ts'

export async function userRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preValidation: [parse.UserBodyValidation],
    },
    async (request, reply) => {
      await RequestController(request, reply, userServices.createNewUserAccount)
    },
  )

  app.get('/', async (request: any, reply) => {
    await RequestController(request, reply, userServices.listUsers)
  })

  app.get(
    '/:id',
    {
      preValidation: [parse.UuidParamValidation],
    },
    async (request, reply) => {
      await RequestController(request, reply, userServices.selectUserById)
    },
  )

  app.delete(
    '/:id',
    {
      preValidation: [parse.UuidParamValidation],
    },
    async (request, reply) => {
      await RequestController(request, reply, userServices.deleteUserById)
    },
  )

  app.put(
    '/:id',
    {
      preValidation: [
        parse.UuidParamValidation,
        parse.UpdateUserBodyValidation,
      ],
    },
    async (request, reply) => {
      await RequestController(request, reply, userServices.updateUser)
    },
  )

  // Account
  app.get(
    '/:id/accounts',
    {
      preValidation: [parse.UuidParamValidation],
    },
    async (request, reply) => {
      await RequestController(request, reply, accountServives.findByUserId)
    },
  )

  app.get(
    '/:id/accounts/analytics',
    {
      preValidation: [parse.UuidParamValidation],
    },
    async (request, reply) => {
      await RequestController(request, reply, accountServives.findAnalytics)
    },
  )

  //Account Transactions Categories
  app.get(
    '/:id/accounts/transaction_categories',
    {
      preValidation: [parse.UuidParamValidation],
    },
    async (request, reply) => {
      await RequestController(request, reply, accountServives.findCategoriesByUserId)
    },
  )

  app.put(
    '/:id/accounts/transaction_categories',
    {
      preValidation: [
        parse.UuidParamValidation,
        parse.NewTransactionCategoryValidation
      ],
    },
    async (request, reply) => {
      await RequestController(request, reply, accountServives.updateTransactionsCategories)
    },
  )
}
