import axios from 'axios'

export interface List {
  builds: Array<{
    path: string
    version: string
    build: string
    longVersion: string
    keccak256: string
    sha256: string
    urls: string[]
  }>
  releases: {
    [key: string]: string
  }
  latestRelease: string
}

export async function getSolidityWasmList(): Promise<List> {
  const resp = await axios.get(
    'https://raw.githubusercontent.com/ethereum/solc-bin/gh-pages/wasm/list.json'
  )
  return await resp.data
}

// TODO type the result
export async function compile(version: string, input: any): Promise<any> {
  const list = await getSolidityWasmList()
  const path = list.releases[version]
  if (!path) {
    throw new Error(`Could not find version ${version} in solidity releases`)
  }

  const worker = new Worker(
    new URL('./solidity.webworker.ts', import.meta.url),
    { type: 'module' }
  )

  worker.postMessage({
    compiler: 'https://binaries.soliditylang.org/bin/' + path,
    input,
  })

  return new Promise((resolve) => {
    worker.addEventListener(
      'message',
      function (e) {
        console.log('solidity.webworker output', e.data.output)
        resolve(e.data.output)
        worker.terminate()
      },
      false
    )
  })
}

function _extractIpfsHash(str: string): string {
  const begin = 'dweb:/ipfs/'
  if (str.startsWith(begin)) {
    return str.substring(begin.length)
  } else {
    throw new Error('Could not extract IPFS hash from string: ' + str)
  }
}
