import 'fastify'
import { AppBodyTypes, AppParamsTypes, AppQueryTypes } from './app-types.ts'

declare module 'fastify' {
  // Aplica-se como default para as rotas (podem ser sobrepostos por rota)
  interface RouteGenericInterface {
    Body?: AppBodyTypes
    Params?: AppParamsTypes
    Querystring?: AppQueryTypes
  }

  interface FastifyRequest {
    cookies: { sessionId?: string; [key: string]: string }
  }
}
