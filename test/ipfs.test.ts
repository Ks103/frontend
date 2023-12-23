import { expect, test } from 'bun:test'
import * as ipfs from '../utils/ipfs'

test('should get a file', async function () {
  const data = await ipfs.get(
    'QmbWhhLdRsG5kGcvBsnFJKuVvbUoUXaSdu4hTtG14YkBLY',
    'text'
  )
  expect(data.length).toEqual(447283)
}, 10_000)

test('should get proof', async function () {
  const proof = await ipfs.getProof(
    'QmbWhhLdRsG5kGcvBsnFJKuVvbUoUXaSdu4hTtG14YkBLY'
  )
  expect(proof.version).toEqual('0.1.0')
}, 10_000)
