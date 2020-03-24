import React from 'react'
import store from 'state/store'

export default class DownloadHTML extends React.Component {
  saveZip = () => {
    store.dispatch({
      type: "BUILD_ZIP_REQUESTED",
      payload: {
        scrapeId: this.props.scrapeId
      }
    });
  }
  render() {
    return <button type="text" onClick={this.saveZip}>Download Files (ZIP)</button>;
  }
}
