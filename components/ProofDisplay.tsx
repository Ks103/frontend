import SyntaxHighlighter from 'react-syntax-highlighter'
import { Proof } from '@/utils/proof'
import { formatEther } from 'ethers'

type Props = {
  proof: Proof
}

export default function ProofDisplay(props: Props) {
  return (
    <div>
      <div
        style={{
          border: 'solid',
          borderColor: 'white',
          padding: '1rem',
          margin: '1rem 0 1rem',
        }}
      >
        Summary: {props.proof.summary}
      </div>
      <div
        style={{
          border: 'solid',
          borderColor: 'white',
          padding: '1rem',
          margin: '1rem 0 1rem',
        }}
      >
        Public Data <br />
        Chain Id: {Number(props.proof.public_data.chain_id)} <br />
        Block: {props.proof.public_data.block_constants.number} <br />
        State Root: {props.proof.public_data.prev_state_root} <br />
      </div>
      <div>
        {Object.entries(props.proof.challenge_artifact.input.sources).map(
          (entry) => (
            <div>
              {/* {entry[0]} */}
              <SyntaxHighlighter language="javascript">
                {entry[1].content}
              </SyntaxHighlighter>
            </div>
          )
        )}
      </div>
    </div>
  )
}
