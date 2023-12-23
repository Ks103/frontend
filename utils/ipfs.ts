import axios, { ResponseType } from 'axios'
import * as indexedDB from 'idb-keyval'
import { Proof, getFromIpfs } from './proof'

export async function get(
  hash: string,
  responseType: ResponseType
): Promise<any> {
  try {
    let out = await indexedDB.get(hash + responseType)
    if (out !== undefined) return out
  } catch {}

  console.log('Fetching from IPFS', hash)
  let result = await axios.get('https://gateway.pinata.cloud/ipfs/' + hash, {
    responseType,
  })
  try {
    await indexedDB.set(hash + responseType, result.data)
  } catch {}
  return result.data
}

export async function getProof(hash: string): Promise<Proof> {
  return getFromIpfs(hash)
}
