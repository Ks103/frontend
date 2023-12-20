type Props = {
  // params: {
  inputState: [string, (input: string) => void]
  backgroundColor: string
  // }
}

export default function InputBox(props: Props) {
  let [input, setInput] = props.inputState
  return (
    <input
      placeholder="Enter proof IPFS hash"
      value={input}
      onChange={(e) => setInput((e.target as any).value)}
      style={{
        backgroundColor: props.backgroundColor,
        height: '3rem',
        width: '50vw',
        borderStyle: 'solid',
        borderColor: 'white',
        borderWidth: '1px',
        borderRadius: '4px',
        padding: '0 1rem 0 1rem',
      }}
    />
  )
}
