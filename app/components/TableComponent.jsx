import React, { useState, useMemo, useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";

//table components 

export default function TableComponent({data}){ 
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "quantity",
        direction: "ascending",
      });
      const [page, setPage] = useState(1);
      const [rowsPerPage, setRowsPerPage] = useState(5);
}