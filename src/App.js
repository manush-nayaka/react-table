import React from 'react';
import logo from './logo.svg';
import './App.css';
import './table.css';

class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            users: [],
            currentPageNum:1,
            currentPageLen:10,
        }
        this.handlePageSelect = this.handlePageSelect.bind(this);
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
    };

    compareBy = (key) => {
        return function(a, b) {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        };
    };
       
    sortBy = (key) => {
        let arrayCopy = [...this.state.users];
        arrayCopy.sort(this.compareBy(key));
        this.setState({users: arrayCopy});
    };

    remove = (rowId) => {
        const arrayCopy = this.state.users.filter((row) => row.id !== rowId);
        this.setState({users: arrayCopy});
    };

    componentWillMount() {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        users: result,
                        currentPageLen:result.length
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                });
    };

    renderTableHeader() {
        return (<React.Fragment>
            <th onClick={() => this.sortBy('name')}>Name</th>
            <th>UserName</th>
            <th onClick={() => this.sortBy('email')}>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Company</th>
            <th>Action</th>
            </React.Fragment>
    )};

    renderTableData() { 
        const { error, isLoaded, users, currentPageNum } = this.state
        const indexOfLastPage = currentPageNum * this.state.currentPageLen;
        const indexOfFirstPage = indexOfLastPage - this.state.currentPageLen;
        const currentUsers = users.slice(indexOfFirstPage, indexOfLastPage);    
        return currentUsers.map((user, index) => {
            return (
                <tr key={user["id"]}>
                    <td>{user["name"]}</td>
                    <td>{user["username"]}</td>
                    <td>{user["email"]}</td>
                    <td>{JSON.stringify(user["address"])}</td>
                    <td>{user["phone"]}</td>
                    <td>{user["website"]}</td>
                    <td>{JSON.stringify(user["company"])}</td>
                    <td><a href="#" onClick={() => this.remove(user["id"])}>del</a>
                        <br></br>
                        <a href={"https://jsonplaceholder.typicode.com/users/" + user["id"]} target="_blank">view</a>
                    </td>
                </tr>
            )
        });
    };

    handlePageSelect(event) {
        this.setState({
            currentPageNum: Number(event.target.id)
        });
    };

    handlePaginationChange(event){
        console.log(event.target.value);
        this.setState({
            currentPageLen: Number(event.target.value)
        });

    };

    renderPagination(){
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.state.users.length / this.state.currentPageLen); i++) {
          pageNumbers.push(i);
        }
        return pageNumbers.map(number => {
            return (
                <a href="#"
                    key={number}
                    id={number}
                    onClick={this.handlePageSelect}
                    >
                    {number}
                </a>
          );
        });
    };

    renderPaginationSelect(){
        const pageNumbers = [];
        for (let i = 1; i <= this.state.users.length; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers.map(number => {
            return (
                <option value={number}>{number}</option>
            );
        });
    }
 
   render() {
      return (
         <div>
            <h1 id='title'>React Dynamic Table</h1>
            <div className="right"><select onChange={this.handlePaginationChange} value={this.state.currentPageLen}>{this.renderPaginationSelect()}</select></div>
            <table id='students'>
               <tbody>
                  <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData()}
               </tbody>
            </table>
         <div className="right"><div className="pagination">{this.renderPagination()}</div></div>
         </div>
      )
   }
}

export default Table;
