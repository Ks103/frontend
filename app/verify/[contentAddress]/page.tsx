'use client'

import { useEffect, useState } from 'react'
import { CID } from 'multiformats'
import * as ipfs from '@/utils/ipfs'
import { buf2array, hex2array } from '@/utils/data-convert'
import { Proof, checkProofProperties } from '@/utils/proof'
import { getSrsCid } from '@/utils/srs'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Alert, Col, Row } from 'react-bootstrap'
import * as solidity from '../../../utils/solidity'
import { keccak256 } from 'ethers'

type Props = {
  params: { contentAddress: string }
}

export default function VerifyProof({ params }: Props) {
  let [display, setDisplay] = useState('')
  let [alertVariant, setAlertVariant] = useState<
    'warning' | 'success' | 'danger'
  >('warning')
  let [proof, setProof] = useState<Proof>()

  useEffect(() => {
    ;(async () => {
      // check if input hash is a valid CID
      try {
        CID.parse(params.contentAddress)
      } catch {
        setDisplay('Invalid IPFS hash: ' + params.contentAddress)
        return
      }

      setDisplay('Downloading proof...')
      let json: any
      try {
        json = await ipfs.get(params.contentAddress, 'json')
      } catch {
        setDisplay('Failed to download proof from IPFS')
        return
      }

      let proof: Proof
      try {
        checkProofProperties(json)
        proof = json
        setProof(proof)
      } catch {
        setDisplay('IPFS content does not seem to be a zk proof')
        return
      }

      // TODO perform further code in a child component, so that this component can render server side.

      let srsCid = getSrsCid(proof.degree)

      setDisplay('Downloading general params...')
      let generalParams: ArrayBuffer
      try {
        generalParams = await ipfs.get(srsCid.generalParams, 'arraybuffer')
      } catch {
        setDisplay('Failed to download general params from IPFS')
        return
      }

      setDisplay('Downloading circuit verifying key...')
      let circuitVerifyingKey: ArrayBuffer
      try {
        circuitVerifyingKey = await ipfs.get(
          srsCid.circuitVerifyingKey,
          'arraybuffer'
        )
      } catch {
        setDisplay('Failed to download circuit verifying key from IPFS')
        return
      }

      setDisplay('Verifying proof...')
      await new Promise((resolve) => setTimeout(resolve, 100))

      let result: boolean
      try {
        // TODO move to worker cuz this is blocking execution
        const wasm = await import('../../../wasm/proof_of_exploit')
        await wasm.default()
        console.time('verify')
        result = wasm.verify(
          hex2array(proof.data),
          buf2array(generalParams),
          buf2array(circuitVerifyingKey),
          hex2array(proof.instances[0][0]),
          hex2array(proof.instances[0][1])
        )
        console.timeEnd('verify')
        console.log('result', result)
      } catch (e) {
        console.error(e)
        setDisplay('Failed to verify proof, check browser console for details')
        return
      }

      setDisplay('Verifying challenge contract codehash...')

      let output = await solidity.compile(
        proof.challenge_artifact.solc_version,
        proof.challenge_artifact.input
      )
      console.log(output)

      let bytecode =
        output.contracts['Challenge.sol'].Challenge.evm.deployedBytecode.object

      let codehash = keccak256('0x' + bytecode)
      if (codehash !== proof.public_data.pox_challenge_codehash) {
        setDisplay('Challenge codehash does not match')
        setAlertVariant('danger')
        return
      }

      // TODO check hash of public data is equal to the zk proof instances

      if (result) {
        setDisplay('Proof verifies!')
        setAlertVariant('success')
      } else {
        setDisplay('Proof does not verify!')
        setAlertVariant('danger')
      }
    })()
  }, [params.contentAddress])
  console.log(proof)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <br />
      <Alert key={alertVariant} variant={alertVariant}>
        {display}
      </Alert>
      {proof ? (
        <Row>
          <Col>
            {proof.summary ? (
              <div>
                Summary: <b>{proof.summary}</b>
              </div>
            ) : null}
            <div
              style={{
                border: 'solid',
                borderColor: 'white',
                margin: '1rem 0',
              }}
            >
              Public Data <br />
              Chain Id: {Number(proof.public_data.chain_id)} <br />
              Block: {proof.public_data.block_constants.number} <br />
              State Root: {proof.public_data.prev_state_root} <br />
            </div>
          </Col>
          <Col>
            {Object.entries(proof.challenge_artifact.input.sources).map(
              (entry, i) => (
                <SyntaxHighlighter language="javascript" key={i}>
                  {entry[1].content}
                </SyntaxHighlighter>
              )
            )}
          </Col>
        </Row>
      ) : null}
    </main>
  )
}
