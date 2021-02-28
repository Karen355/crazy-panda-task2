import React, { Component } from 'react'
import ReactPaginate from 'react-paginate';
import TableSearch from './TableSearch/TableSearch'
import Loader from './Loader/Loader'
import Table from './Table/Table'
import _ from 'lodash'

class App extends Component {
  
  state = {
    isLoading: true,
    data: [],
    search: '',
    sort: 'asc', // desc
    sortField: 'id',
    currentPage: 0
  }

  async componentDidMount() {
    const res = await fetch(`http://localhost:4000/users`);
    const data = await res.json();

    this.setState({
      isLoading: false,
      data: _.orderBy(data, this.state.sortField, this.state.sort)
    })
  }

  onSort = sortField => {
    const clonedData = this.state.data.concat();
    const sort = this.state.sort === 'asc' ? 'desc' : 'asc';
    const data = _.orderBy(clonedData, sortField, sort);
    this.setState({data, sort, sortField})
  }

  pageChangeHandler = ({selected}) => {
    this.setState({
      currentPage: selected
    })
  }

  searchHandler = e => {
    const search = e.target.value
    this.setState({search, currentPage: 0});
  }

  getFilteredData() {
    const {data, search} = this.state;

    if (!search) {
      return data
    }

    return data.filter(item => {
      return item['firstName'].toLowerCase().includes(search.toLowerCase())
          || item['lastName'].toLowerCase().includes(search.toLowerCase())
          || item['email'].toLowerCase().includes(search.toLowerCase())
          || item['phone'].toLowerCase().includes(search.toLowerCase())
    })
  }

  render() {
    const pageSize = 50;
    const filteredData = this.getFilteredData();
    const pageCount = Math.ceil(filteredData.length / pageSize)
    const displayData = _.chunk(filteredData, pageSize)[this.state.currentPage]

    return (
      <div className="container">
        {
          this.state.isLoading
            ? <Loader/>
            : <>
                <TableSearch
                  onSearch = {this.searchHandler}
                />
                <Table
                  data = {displayData}
                  onSort={this.onSort}
                  sort={this.state.sort}
                  sortField={this.state.sortField}
                />
                <ReactPaginate
                  previousLabel={'<'}
                  nextLabel={'>'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.pageChangeHandler}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  forcePage={this.state.currentPage}
                />
              </> 
        }
      </div>
    )
  }
}

export default App;