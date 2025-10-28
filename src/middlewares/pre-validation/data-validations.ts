import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, ZodSchema } from 'zod'
import * as schemas from './zod-schemas.ts'
import { emptyObject, ZodErrorsHandler } from '@/utils/helpers.ts'

async function PreValidationDefault(
  request: FastifyRequest,
  reply: FastifyReply,
  schema: ZodSchema,
  field: 'body' | 'params' | 'query',
) {
  try {
    const data = request[field]

    if (emptyObject(data)) {
      if (field === 'query') return
      throw new Error(`Request ${field} is required`)
    }

    const parsed = await schema.parseAsync(data)
    request[field] = parsed
  } catch (err: any) {
    if (err instanceof ZodError) {
      return reply.status(400).send({
        status: 'failed',
        errors: ZodErrorsHandler(err),
      })
    }

    return reply.status(400).send({
      status: 'failed',
      errors: { root: err.message || 'Erro inesperado' },
    })
  }
}

// Middlewares específicos
export async function UuidParamValidation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await PreValidationDefault(request, reply, schemas.UuidSchema, 'params')
}

export async function UserBodyValidation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await PreValidationDefault(request, reply, schemas.UserBodySchema, 'body')
}

export async function UpdateUserBodyValidation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await PreValidationDefault(
    request,
    reply,
    schemas.UserUpdateBodySchema,
    'body',
  )
}

export async function TransactionBodyValidation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await PreValidationDefault(
    request,
    reply,
    schemas.TransactionBodySchema,
    'body',
  )
}

export async function TransactionQueryValidation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await PreValidationDefault(
    request,
    reply,
    schemas.TransactionQuerySchema,
    'query',
  )
}

export async function NewTransactionCategoryValidation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await PreValidationDefault(
    request,
    reply,
    schemas.UpdateCategoriesBodySchema,
    'body',
  )
}
