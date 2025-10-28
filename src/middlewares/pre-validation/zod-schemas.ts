import { z } from 'zod'

const zRequiredString = (field: string) =>
  z
    .string({
      required_error: `Campo ${field} é necessário`,
      invalid_type_error: `Campo ${field} deve ser uma string`,
    })
    .nonempty(`${field} não pode estar vazio`)

// Body Schemas
export const UserBodySchema = z.object({
  name: zRequiredString('name'),
  email: zRequiredString('email').email('Formato do email inválido'),
  age: z
    .number({
      required_error: 'Campo age é necessário',
      invalid_type_error: 'Campo age deve ser um number',
    })
    .min(18, 'O usuário deve ser maior de idade'),
  cpf: zRequiredString('cpf').regex(/^\d{11}$/, 'CPF inválido'),
  password: zRequiredString('password').regex(
    /^\d{6}$/,
    'Senha deve conter exatamente 6 dígitos',
  ),
})

export const UserUpdateBodySchema = z
  .object({
    email: zRequiredString('email').email('Email inválido').optional(),
    password: zRequiredString('password')
      .regex(/^\d{6}$/, 'Senha deve conter exatamente 6 dígitos')
      .optional(),
    auth: zRequiredString('auth'),
  })
  .refine((data) => data.email || data.password, {
    message: 'É necessário informar email ou password',
  })

export const TransactionBodySchema = z.object({
  title: zRequiredString('title'),
  category: zRequiredString('category'),
  amount: z
    .number({
      required_error: 'Campo amount é necessário',
      invalid_type_error: 'Campo amount deve ser um number',
    })
    .min(0, 'O valor da transação não pode ser 0'),
  type: z.enum(['credit', 'debit', 'pix'], {
    required_error: 'Campo type é necessário',
    invalid_type_error: 'Tipo inválido, tipos válidos: [credit, debit, pix]',
  }),
  operation: z.enum(['income', 'expense'], {
    required_error: 'Campo operation é necessário',
    invalid_type_error:
      'Movimentação inválida, movimentações válidas: [income, expense]',
  }),
})

export const UpdateCategoriesBodySchema = z.object({
  category_name: zRequiredString('category_name')
})

// Routes Params Schemas
export const UuidSchema = z.object({
  id: z.string().uuid('Pârametro uuid inválido'),
})

// Query Params Schemas
const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?$/

export const TransactionQuerySchema = z
  .object({
    start_time: z.string().regex(timestampRegex).optional(),
    end_time: z.string().regex(timestampRegex).optional(),
    max_count: z.coerce.number().optional(),
    operation: z.enum(['income', 'expense']).optional(),
    type: z.enum(['pix', 'credit', 'debit']).optional(),
    category: z.string().optional()
  })
  .superRefine((data, ctx) => {
    const hasStart = Boolean(data.start_time)
    const hasEnd = Boolean(data.end_time)

    if (hasStart !== hasEnd) {
      if (!hasStart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'start_time é obrigatório quando end_time é informado',
          path: ['start_time'],
        })
      }
      if (!hasEnd) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'end_time é obrigatório quando start_time é informado',
          path: ['end_time'],
        })
      }
    }
  })
