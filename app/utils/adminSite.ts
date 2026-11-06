// 거래소 안의 관리자 화면(/admin/…)은 막혀 있다(middleware/disable-admin.global.ts — 첫 화면으로 돌려보냄).
// 관리자 계정의 "고객센터"는 ADMIN 사이트의 고객센터로 보낸다.
export const ADMIN_SUPPORT_URL = 'https://support.ktxexchange.com/admin/messages'
