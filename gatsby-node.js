/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const { resolve, relative } = require(`path`)

const { ensureDir, readdir, copy } = require(`fs-extra`)

async function calculateDirs(
  store,
  { extraDirsToCache = [], cachePublic = false }
) {
  const program = store.getState().program
  const rootDirectory = program.directory

  const dirsToCache = [
    cachePublic && resolve(rootDirectory, `public/static`),
    cachePublic && resolve(rootDirectory, `public/page-data`),
    ...extraDirsToCache.map(dirToCache => resolve(rootDirectory, dirToCache)),
  ].filter(Boolean)

  for (const dir of dirsToCache) {
    await ensureDir(dir)
  }

  const nowCacheDir = resolve(rootDirectory, `../.cache`, `gatsby`)

  await ensureDir(nowCacheDir)

  return {
    rootDirectory,
    dirsToCache,
    nowCacheDir,
  }
}

function generateCacheDirectoryNames(rootDirectory, nowCacheDir, dirPath) {
  const relativePath = relative(rootDirectory, dirPath)
  const dirName = relativePath.replace("/", "--")
  const cachePath = resolve(nowCacheDir, dirName)
  const humanName = relativePath
  return { cachePath, humanName }
}

exports.onPreInit = async function(
  { store },
  { extraDirsToCache, cachePublic }
) {
  // if (!process.env.now_BUILD_BASE) {
  //   return
  // }

  const { dirsToCache, nowCacheDir, rootDirectory } = await calculateDirs(
    store,
    {
      extraDirsToCache,
      cachePublic,
    }
  )

  for (const dirPath of dirsToCache) {
    const { cachePath, humanName } = generateCacheDirectoryNames(
      rootDirectory,
      nowCacheDir,
      dirPath
    )

    await ensureDir(cachePath)

    const dirFiles = await readdir(dirPath)
    const cacheFiles = await readdir(cachePath)

    console.log(
      `plugin-now-cache: Restoring ${cacheFiles.length} cached files for ${humanName} directory with ${dirFiles.length} already existing files.`
    )

    await copy(cachePath, dirPath)
  }

  console.log(`plugin-now-cache: ZEIT Now cache restored`)
}

exports.onPostBuild = async function(
  { store },
  { extraDirsToCache, cachePublic }
) {
  // if (!process.env.now_BUILD_BASE) {
  //   return
  // }

  const { dirsToCache, nowCacheDir, rootDirectory } = await calculateDirs(
    store,
    {
      extraDirsToCache,
      cachePublic,
    }
  )

  for (const dirPath of dirsToCache) {
    const { cachePath, humanName } = generateCacheDirectoryNames(
      rootDirectory,
      nowCacheDir,
      dirPath
    )

    console.log(`plugin-now-cache: Caching ${humanName}...`)

    await copy(dirPath, cachePath)
  }

  console.log(`plugin-now-cache: ZEIT Now cache refilled`)
}
