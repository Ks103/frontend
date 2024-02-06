'use client'

import { CID } from 'multiformats'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'

export default function Home() {
  const [input, setInput] = useState<string>('')
  const [validCid, setValidCid] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      CID.parse(input)
      setValidCid(true)

      if (router) {
        setTimeout(() => {
          router.push('/verify/' + input)
        }, 500)
      }
    } catch {
      setValidCid(false)
    }
  }, [input, router])

  return (
    <div
      style={{
        height: '100vh',
        
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '50vw', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Verify Proof of Exploit</h1>

        <Form.Control
          size="lg"
          placeholder="Enter IPFS Hash"
          value={input}
          style={{ textAlign: 'center' }}
          onChange={(e) => setInput((e.target as any).value)}
        />
        <br />
        <p style={{ height: '1rem', fontSize: '1rem' }}>
          {validCid ? 'Loading...' : ''}
        </p>

        <div style={{ height: '30vh' }} />
      </div>
    </div>
  )
}
