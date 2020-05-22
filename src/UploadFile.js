import APIClient from '../src/Utils/APIClient'

import React, { Component } from 'react';

class UploadFile extends Component {

    state = {
        selectedFile: null
    };

    onFileChange = event => {
        this.setState({ selectedFile: event.target.files[0] });
    };

    onFileUpload = () => {
        const formData = new FormData();
        formData.append(
            "fileUpload",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        console.log(this.state.selectedFile);
        APIClient.POST('/product/upload', formData)
    };


    fileData = () => {

        if (this.state.selectedFile) {

            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    };

    render() {

        return (
            <div>
                <h3> Upload File</h3>
                <div>
                    <input type="file" onChange={this.onFileChange} />
                    <button onClick={this.onFileUpload}>
                        Upload!
                </button>
                </div>
                {this.fileData()}
            </div>
        );
    }
}

export default UploadFile; 