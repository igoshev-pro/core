'use server'

import { cookies } from 'next/headers'

export async function loginAction() {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value;
}
