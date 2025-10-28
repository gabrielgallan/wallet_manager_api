import app from './app.ts'
import { env } from '../env/config.ts'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then((address) => console.log(`Server is running on ${address}`))
  .catch((err) => console.error('Failed running server: ' + err.message))
