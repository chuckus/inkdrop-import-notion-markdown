const fs = require('fs')
const fspromises = require('fs').promises;
const path = require('path')
const { remote, nativeImage } = require('electron')
const { models, logger } = require('inkdrop')
const { getTitleAndBodyFromMarkdown, getMetaFromMarkdown, extractImages } = require('inkdrop-import-utils')
const escapeRegExp = require('lodash.escaperegexp')
const { dialog } = remote
const { Book, Note, File: IDFile } = models

module.exports = {
  openImportDialog,
  importMarkdownFromNotionExport,
}

function openImportDialog() {
  return dialog.showOpenDialog({
    title: 'Open Notion Folder',
    properties: ['openDirectory'],
  })
}

async function walk(dir) {
    let files = await fspromises.readdir(dir);
    files = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await fspromises.stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if(stats.isFile()) return filePath;
    }));

    return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

async function importMarkdownFromNotionExport(folder, destBookId) {
  try {
    const rootFolder = folder[0].split(path.sep).pop()
    const files = await walk(folder[0])
    const mappings = {}
    for (let i = 0; i < files.length; ++i) {
      await importFileFirstPass(files[i], destBookId, mappings, rootFolder)
    }
  } catch (e) {
    inkdrop.notifications.addError('Failed to import the Markdown file', {
      detail: e.stack,
      dismissable: true
    })
  }
}

async function importImages(md, basePath) {
  const images = extractImages(md)
  for (const image of images) {
    const imagePath = path.resolve(basePath, image.url)
    if (fs.existsSync(imagePath)) {
      try {
        const imageData = nativeImage.createFromPath(imagePath)
        const fileTitle = path.basename(imagePath)
        const file = await IDFile.createFromNativeImage(imageData, fileTitle)
        const imageRegex = new RegExp(
          escapeRegExp(`![${image.alt}](${image.url})`),
          'g'
        )
        md = md.replace(imageRegex, `![${image.alt}](inkdrop://${file._id})`)
      } catch (e) {
        inkdrop.notifications.addError('Failed to import an image', {
          detail: `${imagePath}: ${e.message}`,
          dismissable: true
        })
      }
    }
  }
  return md
}

async function importFileFirstPass(fn, destBookId, mappings, rootFolder) {
  if (!destBookId) {
    throw new Error('Destination notebook ID is not specified.')
  }
  // TODO: only parse 
  const ext = path.extname(fn)
  const relativePath = fn.split(rootFolder + '/')[1]
  switch(ext) {
    case '.md':
      const markDown = fs.readFileSync(fn, 'utf-8')
      const { title, body } = getTitleAndBodyFromMarkdown(fn, markDown)
      const { tags, createdAt, updatedAt } = getMetaFromMarkdown(fn)
      const basePath = path.dirname(fn)
      const bodyWithImages = await importImages(body, basePath)

      // create the notebook if it doesn't exist
      let bookId
      const folders = relativePath.split('/')
      if (folders.length > 1) {
        let lastBookId = destBookId
        folders.pop()  // this is the filename
        for (const [i, folder] of folders.entries()) {
          let existingBookId = mappings[folder]
          if (!existingBookId) {
            const folderWithoutHash = folder.match(new RegExp("(.*) [a-z0-9]{32}$"))[1]
            const newBook = new Book({
              name: folderWithoutHash,
              parentBookId: lastBookId
            })
            await newBook.save()
            mappings[folder] = newBook._id
            lastBookId = newBook._id
          } else {
            lastBookId = existingBookId
          }
        }
        bookId = lastBookId
      } else {
        bookId = destBookId
      }
      // fetch 
      // Created: Oct 4, 2015 10:55 AM
      // Updated: Oct 13, 2015 11:05 AM
      const note = new Note({
        title: title,
        body: bodyWithImages,
        bookId: bookId,
        tags,
        createdAt,
        updatedAt
      })
      await note.save()
      break
    case '.csv':
    case '.png':
    case '.jpg':
    case '.jpeg':
    default:
      break
  }

}
