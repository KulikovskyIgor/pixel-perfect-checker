import fs from 'fs';
import { URL } from 'url';
import path from 'path';
import os from 'os';
import { screen } from 'electron';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function readFileSync(filePath: string): string {
  return fs.readFileSync(filePath, {
    encoding: 'base64',
  });
}

export function getMoveDistance(): number {
  const scale = screen?.getPrimaryDisplay().scaleFactor;

  switch (os.platform()) {
    case 'win32':
      return Math.ceil(scale);
    case 'darwin':
      return 1;
    default:
      return 1;
  }
}
