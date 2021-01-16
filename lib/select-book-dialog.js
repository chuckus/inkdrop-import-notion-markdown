'use babel'
const React = require('react')

export default class ImportNotionExportSelectNotebookDialog extends React.Component {
  componentDidMount() {
    // Register command that toggles this view
    this.subscription = inkdrop.commands.add(document.body, {
      'import-notion-export:import-from-folder': this.handleImportNotionExportCommand
    })
  }

  componentWillUnmount() {
    this.subscription.dispose()
  }

  render() {
    const { MessageDialog, NotebookListBar } = inkdrop.components.classes
    const buttons = [
      {
        label: 'Cancel',
        cancel: true
      }
    ]
    if (!MessageDialog || !NotebookListBar) return null
    return (
      <MessageDialog
        className="import-notion-export-select-notebook-dialog"
        ref={el => (this.dialog = el)}
        title="Import Notes from Notion Export"
        message={<div className="ui message">Please select a notebook to import into</div>}
        buttons={buttons}
        autofocus
      >
        <div className="ui form">
          <div className="field">
            <NotebookListBar onItemSelect={this.handleNotebookSelect} />
          </div>
        </div>
      </MessageDialog>
    )
  }

  handleNotebookSelect = bookId => {
    this.importNotionExport(bookId)
  }

  importNotionExport = async destBookId => {
    const { dialog } = this
    const {
      openImportDialog,
      importMarkdownFromNotionExport
    } = require('./importer')
    const { filePaths } = await openImportDialog()
    if (filePaths) {
      dialog.dismissDialog(-1)
      await importMarkdownFromNotionExport(filePaths, destBookId)
    } else {
      return false
    }
  }

  handleImportNotionExportCommand = () => {
    const { dialog } = this
    if (!dialog.isShown) {
      dialog.showDialog()
    }
  }
}
