const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function publicPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("data:")) {
    return path;
  }

  return `${basePath}${path}`;
}
