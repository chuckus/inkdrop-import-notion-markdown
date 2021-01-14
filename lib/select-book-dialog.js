'use babel'
const React = require('react')

export default class ImportMarkdownSelectNotebookDialog extends React.Component {
  componentDidMount() {
    // Register command that toggles this view
    this.subscription = inkdrop.commands.add(document.body, {
      'import-notion-markdown:import-from-folder': this.handleImportMarkdownFileCommand
    })
  }

  componentWillUnmount() {
    this.subscription.dispose()
  }

  render() {
    const { MessageDialog } = inkdrop.components.classes
    const buttons = [
      {
        label: 'Cancel',
        cancel: true,
      },
      {
        label: 'Import',
        primary: true,
      }
    ]
    const handleDismiss = (caller, buttonIndex) => {
      const { dialog } = this
      if (buttonIndex === 1 /* Share */) {
        const { filePaths } = await openImportDialog()
        return false
      } else {
        return true
      }
    }
    if (!MessageDialog) return null
    return (
      <MessageDialog
        className="import-markdown-select-notion-folder-dialog"
        ref={el => (this.dialog = el)}
        title="Import Notes from Notion Export"
        message={<div className="ui message">Please click Import to open a file explorer</div>}
        buttons={buttons}
        onDismiss={handleDismiss}
        autofocus
      />
    )
  }

  handleNotebookSelect = bookId => {
    this.importMarkdownFile(bookId)
  }

  importMarkdownFile = async => {
    const { dialog } = this
    const {
      openImportDialog,
      importMarkdownFromNotionExport
    } = require('./importer')
    const { filePaths } = await openImportDialog()
    if (filePaths) {
      dialog.dismissDialog(-1)
      await importMarkdownFromNotionExport(filePaths)
    } else {
      return false
    }
  }

  handleImportMarkdownFileCommand = () => {
    const { dialog } = this
    if (!dialog.isShown) {
      dialog.showDialog()
    }
  }
}
