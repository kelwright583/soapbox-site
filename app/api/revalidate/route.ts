import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const path = request.nextUrl.searchParams.get('path')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, path })
  }

  // Default: revalidate main pages
  revalidatePath('/')
  revalidatePath('/opinions')
  return Response.json({ revalidated: true, path: '/' })
}
