import assert from 'assert'
import * as ipfs from './ipfs'

export async function getFromIpfs(ipfsHash: string): Promise<Proof> {
  let proof = await ipfs.get(ipfsHash, 'json')
  checkProofProperties(proof)
  return proof
}

export function checkProofProperties(obj: any) {
  assert.equal(typeof obj, 'object', 'not an object')
  assert.equal(typeof obj.version, 'string', 'version is not a string')
  assert.equal(typeof obj.degree, 'number')
}

export interface Proof {
  version: string
  degree: number
  data: string
  instances: Array<Array<string>>
  circuit_params: {
    mock_randomness: string
  }
  fixed_circuit_params: {
    max_rws: number
    max_txs: number
    max_calldata: number
    max_copy_rows: number
    max_exp_steps: number
    max_bytecode: number
    max_evm_rows: number
    max_keccak_rows: number
  }
  public_data: {
    chain_id: string
    history_hashes: Array<string>
    state_root: string
    prev_state_root: string
    block_constants: {
      coinbase: string
      timestamp: string
      number: string
      difficulty: string
      gas_limit: string
      base_fee: string
    }
    block_hash: string
    pox_challenge_codehash: string
    pox_exploit_balance: string
  }
  challenge_artifact: {
    solc_version: string
    input: {
      language: 'Solidity'
      sources: {
        [key: string]: {
          content: string
        }
      }
      settings: {
        optimizer: {
          enabled: boolean
          runs: number
        }
        evmVersion: string
        outputSelection: { '*': { '*': ['evm.deployedBytecode.object'] } }
      }
    }
    output: {
      contracts: {
        [file: string]: {
          [contract: string]: {
            evm: {
              deployedBytecode: {
                object: string
              }
            }
          }
        }
      }
    }
  }
}
