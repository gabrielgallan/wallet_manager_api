import * as System from '@/@types/app-types.ts'
import { FastifyReply, FastifyRequest } from 'fastify'
import { HttpError, HttpResponse } from '@/utils/helpers.ts'

export async function RequestController(
  request: FastifyRequest,
  reply: FastifyReply,
  service: System.AppServicesFunction,
): Promise<void> {
  try {
    const response: HttpResponse = await service(request)

    reply.status(response.code).send({ status: 'success', data: response.data })
  } catch (err: unknown) {
    const error = err as HttpError

    reply.status(error.code).send({
      status: 'failed',
      error: error.message || 'Internal Server Error',
    })
  }
}
