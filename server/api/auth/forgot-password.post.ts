import { readBody, createError } from 'h3'
import { z } from 'zod'
import { getDb } from '../../utils/db'
import { supabaseAppDbEnabled } from '../../utils/supa-appdb'
import { getSupabaseAdminClient } from '../../utils/supabase'
import { createPasswordResetRequest } from '../../utils/password-reset'
import { findUserByUsername } from '../../utils/account-security'

const BodySchema = z.object({
  username: z.string().trim().min(3).max(20),
  name: z.string().trim().min(1).max(40),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})

export default defineEventHandler(async (event) => {
  let body: z.infer<typeof BodySchema>
  try {
    body = BodySchema.parse(await readBody(event))
  } catch {
    throw createError({ statusCode: 400, statusMessage: '필수 항목을 모두 올바르게 입력해 주세요.' })
  }

  // 아이디는 대소문자 구분 없이 찾는다.
  const user: any = await findUserByUsername(body.username, { columns: 'id, username, name, birth_date, role', role: 'user' })

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: '일치하는 회원을 찾을 수 없습니다.' })
  }
  if (String(user.name || '') !== body.name || String(user.birth_date || '') !== body.birthDate) {
    throw createError({ statusCode: 400, statusMessage: '입력한 정보가 일치하지 않습니다.' })
  }

  await createPasswordResetRequest(
    {
      id: Number(user.id),
      username: String(user.username),
      name: String(user.name || ''),
      birth_date: String(user.birth_date || ''),
      role: 'user',
      permissions: {}
    },
    body.name,
    body.birthDate
  )

  return { ok: true }
})
