// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, generateFileKey } from '@/lib/cloudflare-r2'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'members'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = generateFileKey(folder, file.name)
    await uploadFile(key, buffer, file.type)

    const publicUrl = `https://pub-fce821afe01d449d9f48745bf165c7b7.r2.dev/${key}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key,
    }, { status: 201 })

  } catch (error: any) {
    console.error('Upload error:', error.message || error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}