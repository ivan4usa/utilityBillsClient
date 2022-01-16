/*eslint-disable*/
import React, {forwardRef, useState} from "react";
import {
  useTable,
  useFilters,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";
import classnames from "classnames";
import { matchSorter } from "match-sorter";
import { Container, Row, Col, FormGroup, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {Card} from "react-bootstrap";

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <FormGroup>
      <Input
        placeholder={`Search ${count} records...`}
        type="text"
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
      />
    </FormGroup>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Our table component
function Table({ columns, data }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
      <button className="btn btn-warning text-nowrap w-auto px-sm-4" onClick={onClick} ref={ref}>
        {value}
      </button>
  ));


  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    visibleColumns,
    nextPage,
    pageOptions,
    pageCount,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
    gotoPage,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      initialState: { pageSize: 10, pageIndex: 0 },
    },
    useFilters, // useFilters!
    useSortBy,
    usePagination
  );

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  // const firstPageRows = rows.slice(0, 10);

  let pageSelectData = Array.apply(
    null,
    Array(pageOptions.length)
  ).map(function () {});

  return (
    <>
      <div className="ReactTable -striped -highlight primary-pagination">
        <div className="pagination-top">
          <div className="-pagination">
            <div className="-center">
              <Container>
                <Row className="justify-content-between">
                  <Col sm="6" md="5" lg="4" xl="3" className="d-flex justify-content-start p-0 my-1">
                    {/*<div className="-previous">*/}
                      <button
                          type="button"
                          onClick={() => previousPage()}
                          disabled={!canPreviousPage}
                          className="-btn btn w-auto px-sm-4"
                      >
                        <FontAwesomeIcon icon={faArrowLeft}/>
                      </button>
                    {/*</div>*/}
                    <div className="d-flex mx-2 justify-content-center align-items-center">
                      2020
                    </div>
                      <button
                          type="button"
                          onClick={() => nextPage()}
                          disabled={!canNextPage}
                          className="-btn btn w-auto px-sm-4"
                      >
                        <FontAwesomeIcon icon={faArrowRight}/>
                      </button>

                  </Col>


                  <Col sm="6" md="5" lg="4" xl="3" className="d-flex p-0 justify-content-end my-1">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="MMM yyyy"
                        showMonthYearPicker
                        customInput={<ExampleCustomInput />}
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="MMM yyyy"
                        showMonthYearPicker
                        customInput={<ExampleCustomInput />}
                    />
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </div>
        <table {...getTableProps()} className="rt-table">
          <thead className="rt-thead -header">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="rt-tr">
                {headerGroup.headers.map((column, key) => (
                  <th key={key} className={classnames("rt-th rt-resizable-header")}>
                    <div className="rt-resizable-header-content">
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="rt-tbody">
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr key={i}
                  {...row.getRowProps()}
                  className={classnames(
                    "rt-tr",
                    { " -odd": i % 2 === 0 },
                    { " -even": i % 2 === 1 },
                      {"min": i !== 0},
                      {"text-nowrap": i === 0}
                  )}
                ><Card className="w-100 d-flex flex-row mb-0 p-2">
                  {row.cells.map((cell, index) => {
                    if (index % 7 === 0) {
                      console.log(cell)
                    }

                    return (
                          <div {...cell.getCellProps()} className="rt-td">
                            <div>
                              {cell.render("Cell")}
                            </div>

                          </div>


                    );
                  })}
                </Card>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination-bottom"></div>
      </div>
    </>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

export default Table;
