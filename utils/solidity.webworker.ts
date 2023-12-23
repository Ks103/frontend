import wrapper from 'solc/wrapper'
console.log('solidity.webworker')

addEventListener(
  'message',
  (msg) => {
    // @ts-ignore - TODO: fix ts error
    importScripts(msg.data.compiler)
    // @ts-ignore - TODO: fix ts error
    const compiler = wrapper(Module)

    var output = JSON.parse(compiler.compile(JSON.stringify(msg.data.input)))

    postMessage({ output })
  },
  false
)
