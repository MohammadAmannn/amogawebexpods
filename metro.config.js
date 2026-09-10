const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')
const fs = require('fs')

const projectRoot = __dirname
const config = getDefaultConfig(projectRoot)

const packagesRoot = path.resolve(projectRoot, 'packages')

// 1. Force singletons for React and core runtime modules
const singletons = [
  'react',
  'react-dom',
  'react-native',
  'expo',
  'expo-router',
  'expo-font',
  '@rn-primitives/slot',
  '@rn-primitives/portal',
  'react-native-reanimated',
  'react-native-safe-area-context',
  'react-native-screens',
  'react-native-gesture-handler',
  'zustand',
]

config.resolver.extraNodeModules = singletons.reduce((acc, name) => {
  try {
    const resolvedPath = path.dirname(
      require.resolve(`${name}/package.json`, { paths: [projectRoot] })
    )
    acc[name] = resolvedPath
  } catch {
    acc[name] = path.resolve(projectRoot, 'node_modules', name)
  }
  return acc
}, {})

// 2. Custom resolveRequest
const defaultResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  try {
    if (moduleName === 'react' || moduleName.startsWith('react/')) {
      const resolved = require.resolve(moduleName, { paths: [projectRoot] })
      return { filePath: resolved, type: 'sourceFile' }
    }
    if (moduleName === 'react-dom' || moduleName.startsWith('react-dom/')) {
      const resolved = require.resolve(moduleName, { paths: [projectRoot] })
      return { filePath: resolved, type: 'sourceFile' }
    }
    if (moduleName === 'react-native') {
      const resolved = require.resolve('react-native', { paths: [projectRoot] })
      return { filePath: resolved, type: 'sourceFile' }
    }
    if (
      moduleName === 'react-native-safe-area-context' ||
      moduleName.startsWith('react-native-safe-area-context/')
    ) {
      const resolved = require.resolve(moduleName, { paths: [projectRoot] })
      return { filePath: resolved, type: 'sourceFile' }
    }
    if (moduleName.startsWith('@amoga/')) {
      const parts = moduleName.replace('@amoga/', '').split('/')
      const pkgName = parts[0]
      const subPath = parts.slice(1).join('/')
      const pkgDir = path.resolve(packagesRoot, pkgName)
      if (fs.existsSync(pkgDir)) {
        if (!subPath) {
          const tsEntry = path.resolve(pkgDir, 'index.ts')
          const tsxEntry = path.resolve(pkgDir, 'index.tsx')
          const jsEntry = path.resolve(pkgDir, 'index.js')
          if (fs.existsSync(tsEntry)) return { filePath: tsEntry, type: 'sourceFile' }
          if (fs.existsSync(tsxEntry)) return { filePath: tsxEntry, type: 'sourceFile' }
          if (fs.existsSync(jsEntry)) return { filePath: jsEntry, type: 'sourceFile' }
        } else {
          const candidateSrc = path.resolve(pkgDir, subPath)
          const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.json', '.css']
          for (const ext of extensions) {
            const candidate = candidateSrc + ext
            if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
              return { filePath: candidate, type: 'sourceFile' }
            }
          }
        }
      }
    }
  } catch {}

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform)
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = withNativeWind(config, { input: './global.css' })
