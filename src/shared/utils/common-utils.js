export function EQUAL (a, b) {
  let _a = a
  let _b = b
  if (typeof _a === 'undefined') _a = null
  if (typeof _b === 'undefined') _b = null

  return (_a === _b)
}

export function nl2br (str) {
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2')
}
