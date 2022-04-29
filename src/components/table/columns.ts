interface col {
  Header: string;
  accessor: string;
}

export const columns: col[] = [
  {
    Header: "Id",
    accessor: "_id",
  },
  {
    Header: "Validator",
    accessor: "validator",
  },
  {
    Header: "Epoch",
    accessor: "epoch",
  },
  {
    Header: "Name",
    accessor: "validatorName",
  },
  {
    Header: "Address",
    accessor: "searchedAddress",
  },
  {
    Header: "Date",
    accessor: "date",
  },
];
