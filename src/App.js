import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import DropzoneComponent from 'react-dropzone-component';
import '../node_modules/react-dropzone-component/styles/filepicker.css';
import '../node_modules/dropzone/dist/min/dropzone.min.css';
import './App.css';
import './App.scss';
import { Table, Button, drop } from 'reactstrap';
import ListItem from './ListItem';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleRename: false,
            inputNameValue: '',
            inputClass: '',
            renameFile: '',
            postUrl: this.props.postUrl || '/', 
            files: [],
            showList: true,
            maxUpload: this.props.maxUpload || 20,
            filter: this.props.sort || 'upload',
            maxSize: this.props.maxSize || (2*1024*1024),
            minSize: this.props.minSize || 1,
        };
        var that = this;

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            autoProcessQueue: true,
            addRemoveLinks: true,
            uploadMultiple: true,
            maxFilesize: 15,
            maxFiles: 20,
            parallelUploads: 1,
            dictDefaultMessage: 'upload your files here',
            dictMaxFilesExceeded: 'maximale bestanden bereikt',
            dictInvalidFileType: ` deze extensie is niet toegestaan`,
            dictResponseError: `sumting wen wong`,
            dictRemoveFile: `verwijder bestand`,
            accept: function (file, done)
            {
                console.log(that.state.files);
                //conditions for rejecting
                if (that.state.files.length >= that.state.maxUpload || that.validateFile(file) ) {
                    console.log('rejected ',file)
                    done("Naha, you don't.");
                    console.log(file)
                    that.dropzone.removeFile(file);
                }
                else
                {
                    console.log('accepted ',file);
                    done();          
                }
                console.log(that.state.files);
            },
            //acceptedFiles: "image/jpeg,image/png,image/gif"
        };

        this.componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: this.state.postUrl
        };

        this.setSort = this.setSort.bind(this);
        this.removeItemList = this.removeItemList.bind(this);
        this.renameFileItem = this.renameFileItem.bind(this);
        // If you want to attach multiple callbacks, simply
        // create an array filled with all your callbacks.
        //this.callbackArray = [() => console.log('Hi!'), () => console.log('Ho!')];
        // Simple callbacks work too, of course
        //this.callback = file => this.showMessage(file) ;
 
        this.check = item => console.log(item);
        this.checkM = item => console.log('Mcheck, ',item);
        //this.complete = file => this.showMessage(file)? this.dropzone.removeFile(file): console.log('dont');
        this.success = file => console.log('uploaded', file);
        //this.error = file => console.log('error', file);
        this.removedfile =[file => console.log('removing...', file), file => this.removeFileFromState(file)];

        this.dropzone = null;
    }

    test() {
        alert('child to parent test');
    }

    updateInputNameValue(event) {
        let inputValue = event.target.value;
        //this.setState({ inputNameValue: inputValue });
        this.validateName(inputValue);
    }

    validateName(value) {
        //alert('value: ' + this.state.inputNameValue);
        //let name = this.state.inputNameValue;
        let name = value;
        let look = name.search(/[*?":{}|<>]+/g);
        console.log('look for it:', look)

        //nothing found
        if (look === -1) {
            this.setState({ inputClass: 'succesInput' })
        }
        else
        {
            this.setState({ inputClass: 'errorInput' })
        }
        this.setState({ inputNameValue: name });
      
        //this.setState({ toggleRename: (!this.state.toggleRename) });
    }

    //open and close rename interface
    toggleRenameInterface() {
        //reset values
        this.setState({ inputNameValue: ''})
        this.setState({ inputClass: ''})
        this.setState({ toggleRename: (!this.state.toggleRename) });
    }

    renameFileItem(event, file, dropzone) {
        event.preventDefault();

        //open rename interface
        //alert('open change file interface')
        this.setState({ renameFile: file });
        this.toggleRenameInterface();
    }

    changeName() {

        if (this.state.inputClass === 'errorInput') {
            return;
        }

        //dropzone.removeFile(file);
        let file = this.state.renameFile;
        let newName = this.state.inputNameValue;
        let target;
        let list = this.dropzone.files;
        console.log(list)

        //find the file and update it
        for (let i = 0; i < list.length; i++) {
            if (list[i].upload.uuid === file.upload.uuid) {
                target = list[i];
                console.log(target);

                //get all the keys from file
                let num = 0;
                for (let key in target) {
                    console.log('num ' + (++num) + "", key)
                    console.log('value: ', target[key])
                }

                // Concat with file extension.
                const name = newName + target.name.substring(target.name.lastIndexOf('.'));
                // Instantiate copy of file, giving it new name.
                let fix = new File([target], name, { type: target.type });

                let keyArray = [
                    'upload','status','previewElement',
                    'previewTemplate','_removeLink','accepted',
                    'processing','xhr','dataURL','width','height'
                ];

                //assign all keys values to new file
                for (let key in keyArray) {
                    console.log(key)
                    fix[keyArray[key]] = target[keyArray[key]];
                }
                       
                list[i] = fix;
                console.log(list[i])
            }
            else {
                console.log('none-------------')
            }
        }
        this.setState({ files: list })   
        this.toggleRenameInterface();
    }
   

    removeItem(e, file) {
        e.preventDefault();
        console.log(file)
        //alert(file.name);
        console.log(typeof file)
        if (file === 0) {
            this.dropzone.removeAllFiles();
            this.setState({files : []})
        } else {
            console.log(file)

            this.dropzone.removeFile(file);
        }    
    }

    removeItemList(event, file, dropzone) {
        event.preventDefault();
        if (file === 0)
        {
            //dropzone.removeAllFiles();
            this.dropzone.removeFile(file);
            this.setState({ files: [] })
        }
        else
        {
             //dropzone.removeFile(file);
            this.dropzone.removeFile(file);           
        }
    }

    removeFileFromState(file) {
        this.success(file)
        let orginalFiles = this.state.files;
        let newState = [];
        console.log('removeFileFromState', file.upload.uuid);
        console.log(orginalFiles)

        for (let i = 0; i < orginalFiles.length; i++) {
            if (orginalFiles[i].upload.uuid === file.upload.uuid) {
                console.log('matched id ', file.name)
            } else {
                newState.push(orginalFiles[i])
               
            }
        } console.log(newState)
       this.setState({ files: newState })
    }

    removeDupilated(file) {
       // console.log(file.declined.length)
        if (file.declined.length)
        {
            return true;
        }
        else
        {
            return false;
        }   
    }

    setSort(event) {
        let newState = event.target.value;
        this.setState({ sort: newState });
    }

    //check file before adding to the list
    validateFile(file) {
        console.log('added file:! ', file.name);

        //check file size, if valid return false
        if (file.size <= this.state.minSize || file.size >= this.state.maxSize)
        {
            alert('file size must be atleast 1 byte big and cannot exceed 2 MB')
            return true;
        }

        //first file, skip dupilated check
        if (this.state.files.length === 0)
        {
            let files = this.state.files;
            let newState = files.concat(file);
            //console.log(newState, files)
            this.setState({ files: newState });
            console.log(this.state.files);
            return false;
        }
        else
        {
            if (this.state.files.length !== 0)
            {
                //get object containing rejected,accepted and newlist
                let statusObject = this.dupilateCheck(this.state.files, file);
                console.log('dupe check ', statusObject);
                let setNewState = statusObject.concated;
                // console.log('new state: ', setNewState);
                this.setState({ files: setNewState });
                console.log(this.state.files);
                return this.removeDupilated(statusObject);
            }
        }      
    };

    //check for dupilate files and return an object
    dupilateCheck(a, b)
    {
        //console.log('b ',b )
        let accepted = [];
        let declined = [];
 
        let currentList = a;
        let upload = b;
            //let dupe = exist.find(file => file === upload[t]);

        let duplicate = currentList.find(file => checker(file, upload));
        console.log('file ', duplicate);
        if (duplicate !== undefined)
        {
                declined.push(upload);
                console.log('a dupe file!', upload.name);
        }
        else
        {
                accepted.push(upload);
        }
        
        let newList = currentList.concat(accepted);
        let obj = {
            accepted: accepted,
            declined: declined,
            concated: newList
        };

        return obj;

        function checker(a, b)
        {
            //console.log('a ',a.name)
            if (a.name === b.name)
            {
                if (a.size === b.size)
                {
                    if (a.type === b.type)
                    {
                        if (a.lastModified === b.lastModified)
                        {
                            return b;
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
    }

    renderList() {
        return this.state.files.map(f =>
            <li key={f.name}>{f.name} - {f.size} bytes
                <button onClick={(e) => { this.removeItem(e, f) }}>press me</button>
            </li>)
    }

    renderList2() {
        var num = 1;

        return (
            <Table>
                <thead>
                    <tr key='props'>
                        <th>nr.</th>
                        <th> name</th>
                        <th> size</th>
                        <th> type</th>
                        <th>status</th>
                        <th>action</th>
                    </tr>
                </thead >
                <tbody>
                    {this.state.files.map(file =>
                        <tr key='value'>
                            <td> {num++}</td>
                            <td>{file.name}</td>
                            <td>{file.size} Bytes</td>
                            <td>{file.type !== "" ? file.type : 'unknown'}</td>
                            <td>{file.status}</td>
                            <td> <button onClick={(e) => { this.removeItem(e, file) }}>remove file</button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }

    render() {

        const config = this.componentConfig;
        const djsConfig = this.djsConfig;

        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            processing: this.check,
            processingmultiple: this.checkM,
            addedfile: this.callback,
            success: this.success,
            error: this.error,
            complete: this.complete,
            removedfile: this.removedfile,
        }

    return (
        <div className="App">
            {this.state.toggleRename &&
                <div className="overlay"></div>}
            <header className="App-header">
                {this.state.toggleRename &&
                    <div className='rename-container'>
                        <h4>{this.state.renameFile.name}</h4>
                        <input
                            type='text'
                        value={this.state.inputNameValue}
                        className={this.state.inputClass}
                        onChange={(e) => { this.updateInputNameValue(e) }}
                            placeholder='new name'>
                        </input>
                        <div>
                        <Button

                            onClick={() => { this.toggleRenameInterface() }}
                            className='renameButton'>cancel </Button>
                        <Button
                            onClick={() => { this.changeName() }}
                            className='renameButton'>confirm </Button>
                        </div>
                    </div>}
                    <h1>React-dropzone component</h1>
                    <DropzoneComponent config={config}
                    eventHandlers={eventHandlers}
                    djsConfig={djsConfig} />    
                {this.state.showList === true &&
                    <div className="container-list">
                    <div className="container-list-control">
                             <h2>Files 
                          {this.state.files.length > 0 &&

                            <Button
                                    className="remove-button"
                                    color="primary"
                                    size="sm"
                                    onClick={(event) => { this.removeItem(event, 0) }}> remove all
                                    </Button>}       
                              </h2>
                        
                        {this.state.files.length > 0 && <select
                            className="dropdown dropdownMenu"
                            value={this.state.filter}
                            onChange={this.setSort}>
                            <option defaultValue="upload">upload</option>
                            <option value="name">name</option>
                            <option value="size">size</option>
                            <option value="type">type</option>
                        </select>}
                    </div>
                    <ul>
                        {this.state.files.length !== 0 &&
                        <ListItem
                            dropzone={this.dropzone}
                            test={this.test}
                            removeFileMethode={this.removeItemList}
                            renameFileMethode={this.renameFileItem}
                            files={this.state.files} />
                         }
                    </ul>
                    </div>}
          </header>
      </div>
    );
  }
}

export default App;
