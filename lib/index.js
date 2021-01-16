const ImportNotionExportSelectNotebookDialog = require('./select-book-dialog')
  .default

module.exports = {
  activate() {
    inkdrop.components.registerClass(ImportNotionExportSelectNotebookDialog)
    inkdrop.layouts.addComponentToLayout(
      'modal',
      'ImportNotionExportSelectNotebookDialog'
    )
  },

  deactivate() {
    inkdrop.layouts.removeComponentFromLayout(
      'modal',
      'ImportNotionExportSelectNotebookDialog'
    )
    inkdrop.components.deleteClass(ImportNotionExportSelectNotebookDialog)
  }
}
