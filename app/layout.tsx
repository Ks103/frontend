import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Col, Container, Row } from 'react-bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Proof of Exploit',
  description: 'Verify proofs of exploits',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className="bg-black">
        <Container fluid>
          <div className={inter.className}>{children}</div>
        </Container>
      </body>
    </html>
  )
}
