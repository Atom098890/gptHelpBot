import { unlink } from 'fs/promises';

export async function deleteFile(filePath) {
  try {
    await unlink(filePath);
  } catch (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}