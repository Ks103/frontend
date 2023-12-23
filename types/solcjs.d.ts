declare module 'solc' {
  function loadRemoteVersion(
    version: string,
    callback: (err, solcSnapshot: this) => void
  ): void
  // loadRemoteVersion(version :string, function (err, solcSnapshot) {
  // })
}
declare module 'solc/soljson' {
  let Module: any
}
declare module 'solc/wrapper' {
  function wrapper(soljson): {
    version: string
    // semver: coreBindings.versionToSemver,
    // license: coreBindings.license,
    // lowlevel: {
    //   compileSingle: compileBindings.compileJson,
    //   compileMulti: compileBindings.compileJsonMulti,
    //   compileCallback: compileBindings.compileJsonCallback,
    //   compileStandard: compileBindings.compileStandard,
    // },
    // features: {
    //   legacySingleInput: methodFlags.compileJsonStandardSupported,
    //   multipleInputs:
    //     methodFlags.compileJsonMultiSupported ||
    //     methodFlags.compileJsonStandardSupported,
    //   importCallback:
    //     methodFlags.compileJsonCallbackSuppported ||
    //     methodFlags.compileJsonStandardSupported,
    //   nativeStandardJSON: methodFlags.compileJsonStandardSupported,
    // },
    // compile: compileStandardWrapper.bind(this, compileBindings),
    // // Loads the compiler of the given version from the github repository
    // // instead of from the local filesystem.
    // loadRemoteVersion,
    // // Use this if you want to add wrapper functions around the pure module.
    // setupMethods: wrapper,
  }
}
