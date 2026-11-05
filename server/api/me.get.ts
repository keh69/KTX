import { getSessionUser } from '../utils/auth'

export default defineEventHandler(async (event) => {
  // 회원정보(이름/계좌 등)를 바꾼 뒤 새로고침하면 바로 새 값이 보여야 하므로 캐시 없이 읽는다.
  const me = await getSessionUser(event, { fresh: true })
  return { me }
})
