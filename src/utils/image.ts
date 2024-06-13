import { createWriteStream, promises, unlink } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const streamPipeline = promisify(pipeline)
const unlinkAsync = promisify(unlink)

/** 画像ダウンロード */
export async function downloadImage(url: string, path: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)

  await streamPipeline(response.body as unknown as NodeJS.ReadableStream, createWriteStream(path))
  console.log(`Image downloaded to ${path}`)
}

/** ファイル削除 */
export async function deleteFile(path: string): Promise<void> {
  try {
    await unlinkAsync(path)
    console.log(`File at ${path} deleted`)
  }
  catch (error) {
    console.error(`Failed to delete file at ${path}`, error)
  }
}

/** 画像をBlobに変換 */
export async function jpgToBlob(filePath: string): Promise<Blob> {
  try {
    const fileData = await promises.readFile(filePath)
    const blob = new Blob([fileData], { type: 'image/jpeg' })
    return blob as Blob
  }
  catch (error) {
    console.error('Failed to convert jpg to Blob:', error)
    throw error
  }
}
