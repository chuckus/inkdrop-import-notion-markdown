import * as React from 'react'
import { CompositeDisposable } from 'event-kit'

export default class SelectBookDialog extends React.Component {
  constructor(props) {
    super(props)

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscription = inkdrop.commands.add(document.body, {
      'import-html:import-from-file': () => this.handleImportHTMLFileCommand()
    })

    this.state = {
      destBookId: null,
      formErrorMessageVisible: false
    }
  }

  componentWillUnmount() {
    this.subscriptions.dispose()
  }

  renderFormError() {
    if (this.state.formErrorMessageVisible) {
      return (
        <div className="ui negative message">
          <p>Please select the destination notebook.</p>
        </div>
      )
    }
  }

  render() {
    const { MessageDialog, BookDropdownList } = inkdrop.components.classes
    const buttons = [
      {
        label: 'Cancel'
      },
      {
        label: 'OK',
        primary: true
      }
    ]
    return (
      <MessageDialog
        ref={el => (this.dialog = el)}
        title="Import Notes from HTML"
        buttons={buttons}
        onDismiss={::this.handleDismissDialog}
      >
        <div className="ui form">
          {this.renderFormError()}
          <div className="field">
            <BookDropdownList
              onChange={::this.handleChangeBook}
              selectedBookId={this.state.destBookId}
              placeholder="Select Destination Notebook.."
            />
          </div>
        </div>
      </MessageDialog>
    )
  }

  handleChangeBook(bookId) {
    this.setState({
      destBookId: bookId
    })
  }

  handleDismissDialog(dialog, buttonIndex) {
    if (buttonIndex === 1) {
      const {
        openImportDialog,
        importHTMLFromMultipleFiles
      } = require('./importer')
      const { destBookId } = this.state
      if (!destBookId) {
        this.setState({ formErrorMessageVisible: true })
        return false
      }

      const files = openImportDialog()
      if (files) {
        importHTMLFromMultipleFiles(files, destBookId)
      } else {
        return false
      }
    }
  }

  handleImportHTMLFileCommand() {
    const { dialog } = this
    if (!dialog.isShown) {
      this.setState({
        destBookId: null,
        formErrorMessageVisible: false
      })
      dialog.showDialog()
    }
  }
}
