import { existsSync, mkdirSync, promises as fs } from 'fs';
import { join, resolve } from 'path';

export const UPLOADS_PREFIX = '/uploads';
export const RECIPE_UPLOADS_PREFIX = `${UPLOADS_PREFIX}/recipes`;

export function getUploadsRoot(): string {
  return join(process.cwd(), 'storage');
}

export function getRecipeUploadsDir(): string {
  return join(getUploadsRoot(), 'recipes');
}

export function ensureDirectory(path: string): string {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }

  return path;
}

export function isRecipeUploadUrl(
  url: string | null | undefined,
): url is string {
  return typeof url === 'string' && url.startsWith(`${RECIPE_UPLOADS_PREFIX}/`);
}

export async function deleteRecipeUploadByUrl(
  url: string | null | undefined,
): Promise<void> {
  if (!isRecipeUploadUrl(url)) {
    return;
  }

  const safeUrl = url;
  const filename = safeUrl.slice(`${RECIPE_UPLOADS_PREFIX}/`.length);
  const uploadsDir = resolve(getRecipeUploadsDir());
  const filePath = resolve(uploadsDir, filename);

  if (!filePath.startsWith(uploadsDir)) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore missing files so recipe operations stay safe on retries.
  }
}

export async function deleteRecipeUploadsByUrls(
  urls: Array<string | null | undefined>,
): Promise<void> {
  const uniqueUrls = [...new Set(urls.filter((url): url is string => Boolean(url)))];
  await Promise.all(uniqueUrls.map((url) => deleteRecipeUploadByUrl(url)));
}
