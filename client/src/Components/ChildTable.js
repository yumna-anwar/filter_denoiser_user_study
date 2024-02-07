import React from "react";
import DataTable from "react-data-table-component";

const ChildTable = ({ data, columns }) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      noHeader
      defaultSortField="name"
      defaultSortAsc={true}
    />
  );
};

export default ChildTable;
