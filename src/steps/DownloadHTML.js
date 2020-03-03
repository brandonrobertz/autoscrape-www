import React from 'react'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

export default class DownloadHTML extends React.Component {
  saveZip = () => {
    const zip = new JSZip();
    this.props.filesList.forEach(file => {
      const filename = `autoscrape-data/${file.name}`;
      zip.file(filename, file.data, {binary: true});
    });
    zip.generateAsync({type:"blob"}).then(blob => {
      const now = (new Date()).getTime();
      saveAs(blob, `autoscrape-data-${now}.zip`);
    });
  }
  render() {
    return <button type="text" onClick={this.saveZip}>Download Files (ZIP)</button>;
  }
}
