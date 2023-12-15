import axios, { ResponseType } from 'axios'
import { Proof, getFromIpfs } from './proof'

export async function get(
  hash: string,
  responseType: ResponseType
): Promise<any> {
  let result = await axios.get('https://gateway.pinata.cloud/ipfs/' + hash, {
    responseType,
  })
  return result.data
}

export async function getProof(hash: string): Promise<Proof> {
  return getFromIpfs(hash)
}

export default { get, getProof }
