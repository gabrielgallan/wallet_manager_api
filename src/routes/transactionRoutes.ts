import { FastifyInstance } from 'fastify'
import { RequestController } from '../middlewares/handlers/request-services-handler.ts'
import * as transactionServices from '../services/transactionServices.ts'
import * as parse from '../middlewares/pre-validation/data-validations.ts'

export async function transactionRoutes(app: FastifyInstance) {
  app.post(
    '/:id/transactions',
    {
      preValidation: [
        parse.UuidParamValidation,
        parse.TransactionBodyValidation,
      ],
    },
    async (request, reply) => {
      await RequestController(
        request,
        reply,
        transactionServices.createTransaction,
      )
    },
  )

  app.get(
    '/:id/transactions',
    {
      preValidation: [
        parse.UuidParamValidation,
        parse.TransactionQueryValidation,
      ],
    },
    async (request, reply) => {
      await RequestController(
        request,
        reply,
        transactionServices.listUserTransactions,
      )
    },
  )
}
