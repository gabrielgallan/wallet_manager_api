import { FastifyRequest } from 'fastify'
import { HttpError, HttpResponse } from '../utils/helpers.ts'
import { accountRepository } from '../repositories/accountRepository.ts'
import * as types from '../@types/app-types.ts'
import { Analytics } from './operations/analytics-ops.ts'

export async function findByUserId(
  request: FastifyRequest,
): Promise<HttpResponse> {
  try {
    const { id } = request.params as types.UuidParamType

    const account = await accountRepository.findByUserId(id)

    return new HttpResponse(200, { account })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, err.message)
  }
}

export async function updateTransactionsCategories(
  request: FastifyRequest,
): Promise<HttpResponse> {
  try {
    const { id } = request.params as types.UuidParamType
    const { category_name } = request.body as types.UpdateCategoriesBodyType

    const updated = await accountRepository.updateCategories(id, category_name)

    return new HttpResponse(200, { updated })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, err.message)
  }
}

export async function findCategoriesByUserId(
  request: FastifyRequest,
): Promise<HttpResponse> {
  try {
    const { id } = request.params as types.UuidParamType

    const transaction_categories = await accountRepository.listCategoriesByUserId(id)

    return new HttpResponse(200, { transaction_categories })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, err.message)
  }
}

export async function findAnalytics(
  request: FastifyRequest,
): Promise<HttpResponse> {
  try {
    const { id } = request.params as types.UuidParamType

    const account = await accountRepository.findByUserId(id)

    const analytics = {
      summaries: await Analytics.CreateCurrentSummary(account.id),
      categories: await Analytics.CreateCategorySummary(account.id),
      mains: await Analytics.CreateMainsSummary(account.id)
    }

    return new HttpResponse(200, { analytics })
  } catch (err: any) {
    if (err instanceof HttpError) throw err

    throw new HttpError(500, err.message)
  }
}
