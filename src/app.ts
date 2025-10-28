import fastify from 'fastify'
import { userRoutes } from './routes/userRoutes.ts'
import { transactionRoutes } from './routes/transactionRoutes.ts'

const app = fastify()

// Pluggings
// => Registrando as rotas da aplicação
app.register(userRoutes, {
  prefix: 'users',
})
app.register(transactionRoutes, {
  prefix: 'users',
})

export default app
