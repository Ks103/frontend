// TODO add support for more browsers
let CHROME_MAX_ALLOWED_CHARS = 5200000

type LocalStorage = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export function setItem(key: string, value: string) {
  let localStorage = _localStorage()
  if (value.length > CHROME_MAX_ALLOWED_CHARS) {
    let iters = Math.ceil(value.length / CHROME_MAX_ALLOWED_CHARS)
    console.log('set item big, iters', iters)
    for (let i = 0; i < iters; i++) {
      console.log('set at', _key(key, i))
      localStorage.setItem(
        _key(key, i),
        value.slice(
          i * CHROME_MAX_ALLOWED_CHARS,
          (i + 1) * CHROME_MAX_ALLOWED_CHARS
        )
      )
    }
  } else {
    localStorage.setItem(key, value)
  }
}

export function getItem(key: string): string | null {
  let localStorage = _localStorage()

  let result = null
  for (let i = 0; ; i++) {
    const _result = localStorage.getItem(_key(key, i))
    if (_result === null) {
      break
    } else if (_result.length === CHROME_MAX_ALLOWED_CHARS) {
      result = (result ?? '') + _result
    }
  }
  return result
}

function _key(key: string, i: number): string {
  return i === 0 ? key : key + '_' + i
}

function _localStorage() {
  let localStorage = (globalThis as any)?.localStorage as LocalStorage
  if (localStorage === undefined) {
    throw new Error(
      'localStorage is not available, make sure this code is runing in browser'
    )
  }
  return localStorage
}
