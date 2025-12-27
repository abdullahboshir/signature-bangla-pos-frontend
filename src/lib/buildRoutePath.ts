export function buildRoutePath(
  role: string,
  businessUnit: string | undefined | null,
  path: string
): string {
  // Handle absolute paths (already have full context)
  if (path.startsWith('/')) {
    return path;
  }
  
  // If no business unit, path is /{role}/{path}
  if (!businessUnit || businessUnit === 'undefined' || businessUnit === 'null') {
    return `/${role}/${path}`;
  }
  
  // Build relative path with context: /{role}/{business-unit}/{path}
  return `/${role}/${businessUnit}/${path}`;
}
