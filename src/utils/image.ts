import { createWriteStream, promises, unlink } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import consola from 'consola'

const streamPipeline = promisify(pipeline)
const unlinkAsync = promisify(unlink)

/** 画像ダウンロード */
export async function downloadImage(url: string, path: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok || response.status !== 200)
    throw new Error(`画像取得失敗: ${url}: ${response.statusText}`)

  await streamPipeline(response.body as unknown as NodeJS.ReadableStream, createWriteStream(path))
  consola.success(`画像保存成功: ${path}`)
}

/** ファイル削除 */
export async function deleteFile(path: string): Promise<void> {
  try {
    await unlinkAsync(path)
    consola.success(`画像削除成功: ${path}`)
  }
  catch (error) {
    consola.error(`画像削除失敗: ${path}`, error)
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
    consola.error('Failed to convert jpg to Blob:', error)
    throw error
  }
}
