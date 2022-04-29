import { useMemo } from "react";
import { useRowSelect, useTable } from "react-table";
import { columns } from "./columns";
import "./style.css";
import { Checkbox } from "./CheckBox";

const Table = ({ apiData, setSelectedValidators }) => {
  const Columns = useMemo(() => columns, []);
  const Data = useMemo(() => apiData, [apiData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
  } = useTable(
    {
      columns: Columns,
      data: Data,
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <Checkbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps()} />,
        },
        ...columns,
      ]);
    }
  );

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => {
            return (
              <tr key={index} {...headerGroup.getFooterGroupProps()}>
                {headerGroup.headers.map((column, index2) => {
                  return (
                    <th key={index2} {...column.getHeaderGroupProps}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr key={index} {...row.getRowProps()}>
                {row.cells.map((cell, index2) => {
                  return (
                    <td
                      key={index2}
                      className={cell.column.Header?.toString()}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={() => {
          setSelectedValidators(selectedFlatRows.map((row) => row.original));
        }}
      >
        delete
      </button>
    </>
  );
};

export default Table;
