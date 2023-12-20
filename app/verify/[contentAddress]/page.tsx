'use client'

import { useEffect, useState } from 'react'
import { CID } from 'multiformats'
import * as ipfs from '@/utils/ipfs'
import { buf2array, hex2array } from '@/utils/data-convert'
import { Proof, checkProofProperties } from '@/utils/proof'
import { getSrsCid } from '@/utils/srs'

type Props = {
  params: { contentAddress: string }
}

export default function VerifyProof({ params }: Props) {
  let [display, setDisplay] = useState<string>('')

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
      } catch {
        setDisplay('IPFS content does not seem to be a zk proof')
        return
      }

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
      let result: boolean
      try {
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

      if (result) {
        setDisplay('Proof verified!')
      } else {
        setDisplay('Proof does not verify!')
      }
    })()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      hash {params.contentAddress}
      <br />
      {display}
    </main>
  )
}
