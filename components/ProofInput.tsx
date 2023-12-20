'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CID } from 'multiformats'
import InputBox from './InputBox'

export default function ProofInput() {
  const [input, setInput] = useState<string>('')
  const [validCid, setValidCid] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      CID.parse(input)
      setValidCid(true)

      if (router) {
        router.push('/verify/' + input)
      }
    } catch {
      setValidCid(false)
    }
  }, [input, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1
          style={{
            fontSize: '1.5rem',
            marginLeft: '1rem',
            marginBottom: '1rem',
          }}
        >
          Verify Proof of Exploit
        </h1>

        <InputBox
          inputState={[input, setInput]}
          backgroundColor={validCid ? '#0808' : 'transparent'}
        />
      </div>
    </main>
  )
}
