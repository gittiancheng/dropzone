import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey, faSort, faSortUp, faSortDown, faTrashAlt, faPen } from '@fortawesome/free-solid-svg-icons';
import './ListItem.scss';

library.add(faEnvelope, faKey, faSort, faSortUp, faSortDown, faTrashAlt, faPen);

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: this.props.files || [],
            dropzone: this.props.dropzone,
            sortedFiles: [],
            sortDirectionNr: 'none',
            sortDirectionName: 'none',
            sortDirectionSize: 'none',
            sortDirectionType: 'none',
            sortDirectionStatus: 'none',
            originelFiles: [] ,
            sortDirection: [
                { value: 'nr', direction: 'none' },
                { value: 'name', direction: 'none' },
                { value: 'size', direction: 'none' },
                { value: 'type', direction: 'none' },
                { value: 'status', direction: 'none' }
            ]
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log(prevProps, prevState)
        //console.log(this.props.files)
            if (prevProps.files !== this.props.files) {
                this.setState({
                    files: this.props.files,
                    dropzone: this.props.dropzone
                    });
            }
        }

    static getDerivedStateFromProps(nextProps, prevState) {
        //console.log(nextProps, prevState);
        if (nextProps.files !== prevState.files) {
            return { newFileState: nextProps.files };
        }
        else return null;
    }

    //todo remove
    test(e, f, sort) {
        let string1 ='';
        for (let key in f ) {
            string1 += [key]+", ";
        }
        console.log(string1);

        console.log(sort);
        let sortedFiles = this.state.files;
        if (sort === 'up')
        {
            sortedFiles.sort((a, b) => (a.size < b.size) ? 1 : ((b.size < a.size) ? -1 : 0));
        }
        else
        {
            sortedFiles.sort((a, b) => (a.size > b.size) ? 1 : ((b.size > a.size) ? -1 : 0));
        }
       
        this.setState({ files: sortedFiles });
        //console.log(Object.keys(this.state.files[0]))
        //console.log(Object.getOwnPropertyNames(this.state.files[0]))
        //console.log(this.state.dropzone)
        this.props.test();
        
    }

    //todo salvage and remove
    validator(itemOne, ItemTwo, value) {

        console.log(typeof itemOne, '= ', itemOne);
        console.log(typeof ItemTwo, '= ', ItemTwo);
        console.log('value: ', value);
        let valueOne;
        let valueTwo;

        if (typeof itemOne[value] === 'string') {
            console.log(itemOne[value], ' = string');
            valueOne = itemOne[value].toLowerCase().replace(/\s/g, '');
        }

        if (typeof itemOne[value] === 'number') {
            console.log(itemOne[value], ' = number');
            valueOne = itemOne[value];
        }

        if (typeof itemOne[value] === 'object') {
            console.log(itemOne[value], ' = object');
        }

        if (typeof ItemTwo[value] === 'string') {
            console.log(ItemTwo[value], ' = string');
            valueTwo = ItemTwo[value].toLowerCase().replace(/\s/g, '');
        }

        if (typeof ItemTwo[value] === 'number') {
            console.log(ItemTwo[value], ' = number');
            valueTwo = ItemTwo[value];
        }

        if (typeof ItemTwo[value] === 'object') {
            console.log(ItemTwo[value], ' = object');
        }

        //compare function short if
        let res = (valueOne > valueTwo ? 1 : (valueTwo > valueOne) ? -1 : 0);
        console.log('compare -> ',res)
        return res;
    }

    //filtering todo expand
    filter(value) {
        console.log(value)

        if (typeof value === 'string') {
            console.log(value, ' = string');
            return value.toLowerCase().trim().replace(/\s/g, '');
        }

        if (typeof value === 'number') {
            console.log(value, ' = number');
            return value = value;
        }
        //incase its not a number or string
        return value;
    }

    //reorder the items in the list
    setOrder(direction,value) {

        let original = this.state.originelFiles;
        if (!Array.isArray(original) || !original.length || original.lenght !== this.state.files) {


            console.log('no array, set copy')
            let newstate = this.state.files;
            this.setState({ originelFiles: newstate })
            // array does not exist, is not an array, or is empty
        } else {
            console.log('get copy', this.state.originelFiles)
        }

        //make copy of to sort
        let sortedFiles = this.state.files.slice();

        switch (direction) {
            case 'up': sortedFiles.sort((a, b) =>
                     (this.filter(a[value]) < this.filter(b[value])) ? 1 :
                        (this.filter(b[value]) < this.filter(a[value])) ? -1 : 0);
                break;
            case 'down': sortedFiles.sort((a, b) =>
                     (this.filter(a[value]) > this.filter(b[value])) ? 1 :
                         (this.filter(b[value]) > this.filter(a[value])) ? -1 : 0);
                break;
            case 'none':
                console.log(this.state.files, this.state.originelFiles)
                sortedFiles = this.state.originelFiles;
                break;
            case 'backup2': sortedFiles.sort((a, b) => { this.validator(a, b, value, direction) });
                break;
            case 'backup': sortedFiles.sort((a, b) =>
                (a[value].replace(/\s/g, '') > b[value].replace(/\s/g, '')) ? 1 : ((b[value].replace(/\s/g, '') > a[value]) ? -1 : 0));;
                break;
            default: sortedFiles = this.state.originelFiles;
        }

        this.setState({ files: sortedFiles });
    }

//trigger rename item in parent component
    renameAction(e, f) {
        console.log(f);
        this.props.renameFileMethode(e, f);
    }

    //trigger remove item in parent component
    removeAction(e, f){
        console.log(e, f);
        this.props.removeFileMethode(e, f, this.state.dropzone);
    }

    //change direction methode
    setSortDirection(value) {
        let targetValue;
        let newDirection;

        switch (value) {
            case 'nr':
                targetValue = this.state.sortDirectionNr;
                newDirection = this.setDirection(targetValue);
                this.test([],[],newDirection); // custom edit needed
                this.setState({ sortDirectionNr: newDirection });
            break;
            case 'name': 
                targetValue = this.state.sortDirectionName;
                newDirection = this.setDirection(targetValue);
                this.setOrder(newDirection,value);
                this.setState({ sortDirectionName: newDirection });
                break;
            case 'size':
                targetValue = this.state.sortDirectionSize;
                newDirection = this.setDirection(targetValue);
                this.setOrder(newDirection, value);
                this.setState({ sortDirectionSize: newDirection });
                break;
            case 'type':
                targetValue = this.state.sortDirectionType;
                newDirection = this.setDirection(targetValue);
                this.setOrder(newDirection, value);
                this.setState({ sortDirectionType: newDirection });
                break;
            case 'status':
                targetValue = this.state.sortDirectionStatus;
                newDirection = this.setDirection(targetValue);
                this.setOrder(newDirection, value);
                this.setState({ sortDirectionStatus: newDirection });
                break;
            default: alert('missing onclick value, check switch setState direction');
        }     
    }

    //set return direction values 
    setDirection(direction) {
        console.log('current: ', direction);

        switch (direction) {
            case 'none': return 'up';
            case 'up': return 'down';
            case 'down': return 'none';
            default: return 'none';
        }
    }

    //get matching icon of each direction
    getIcon(value) {
        //default direction is none
        let direction = 'none';

        switch (value) {
            case 'nr':
                direction = this.state.sortDirectionNr;
                return this.setIcon(direction);
            case 'name':
                direction = this.state.sortDirectionName;
                return this.setIcon(direction);
            case 'size':
                direction = this.state.sortDirectionSize;
                return this.setIcon(direction);
            case 'type':
                direction = this.state.sortDirectionType;
                return this.setIcon(direction);
            case 'status':
                direction = this.state.sortDirectionStatus;
                return this.setIcon(direction);
            default: alert('missing onclick value, check switch 2 getIcon');
        }     
    }

    //set matching icon of each direction
    setIcon(direction) {
        //each direction has own icon-code
        //for more infromation, check font - awesome react documentation
        switch (direction) {
            case 'none': return 'sort';
            case 'up': return 'sort-up';
            case 'down': return 'sort-down';
            default: return 'sort';
        }
    }

    //get unique key for list purpose 
    getId(file) {
        //console.log(file.name)
        let id = [];

        //uuic is unique for each file so far
        for (var key in file['upload']) {
            //console.log(key); // alerts key
            //console.log('[', key, ']: ', file['upload'][key]); //alerts key's value
            id.push(file['upload'][key]);
        }
        //console.log(id)
        return id[0];    //first key should be uuic, check console.log  
    }

    setFileSize(size) {
        console.log(size/ 1000);
        console.log(size)
        if ((size/1000) >= 100) {
            return (size / (Math.pow(1000, 2))).toFixed(2) + ' MB';
        }
        return (size / 1000).toFixed(2) + ' KB';
    }

    render() {
        var num = 1;
        return (
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>nr.
                            <FontAwesomeIcon
                                onClick={() => { this.setSortDirection('nr') }}
                                className="styleSort"
                                icon={this.getIcon('nr')} />
                        </th>
                        <th> name 
                            <FontAwesomeIcon
                                onClick={() => { this.setSortDirection('name') }}
                                className="styleSort"
                                icon={this.getIcon('name')} />
                        </th>
                        <th> size 
                            <FontAwesomeIcon
                                onClick={() => { this.setSortDirection('size') }}
                                className="styleSort"
                                icon={this.getIcon('size')} />
                        </th>
                        <th> type 
                            <FontAwesomeIcon
                                onClick={() => { this.setSortDirection('type') }}
                                className="styleSort"
                                icon={this.getIcon('type')} />
                        </th>
                        <th>status 
                            <FontAwesomeIcon
                                onClick={() => { this.setSortDirection('status') }}
                                className="styleSort"
                                icon={this.getIcon('status')} />
                        </th>
                        <th>action
                            
                        </th>
                    </tr>
                </thead >
                <tbody>
                    {this.state.files.map(f =>
                        <tr key={this.getId(f)}>
                            <td>{this.getId(f).substring(1,6)}</td>
                            <td>{num++}</td>
                            <td>{f.name}</td>
                            <td>{this.setFileSize(f.size)}</td>
                            <td>{f.type !== "" ? f.type.substring(0,24) : 'unknown'}</td>
                            <td>{f.status}</td>
                            <td>
                                <i title='rename item'>
                                    <FontAwesomeIcon
                                        onClick={(e) => { this.renameAction(e, f) }}
                                        className="icon"
                                        icon="pen" />
                                </i>
                                <i title='delete item'>
                                    <FontAwesomeIcon
                                        onClick={(e) => { this.removeAction(e,f) }}
                                        className="icon"
                                        icon="trash-alt" />   
                                 </i>
                           </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }
}

export default ListItem;