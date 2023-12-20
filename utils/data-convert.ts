export function buf2hex(buffer: ArrayBuffer) {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')
}

export function hex2array(hex: string) {
  if (hex.startsWith('0x')) hex = hex.slice(2)
  if (hex.length % 2 !== 0) hex = '0' + hex
  let arr = new Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return arr
}

export function buf2array(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
}
