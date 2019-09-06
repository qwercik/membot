export function forceEndingWith (string, forced) {
  if (!string.endsWith(forced)) {
    string += forced
  }

  return string
}