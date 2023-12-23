import { expect, test } from 'bun:test'
import * as solidity from '../utils/solidity'

import soljson from 'solc/soljson'

test('should get list', async function () {
  console.log(soljson.inspect)

  // const list = await solidity.getSolidityWasmList()
  // let res = await solidity.getSolidityWasm('0.8.19')
  // console.log(res)
  //   expect(list.releases).toEqual(447283)
}, 20_000)
