'use client';
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  User,
  Calendar,
  table
} from "@nextui-org/react";
import { parseDate } from '@internationalized/date';
import { PlusIcon } from "./PlusIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { columns, users } from "./data";
import { capitalize } from "./utils";
// Table and data 
export default function TableDemo() { 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]); 

    const handleAddNewClick = () => { 
        setIsModalOpen(true); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }; 

    const addItemToTable = (newItem) => { 
        setTableData([...tableData, newItem])
    }

    return( 
        <>
        
        </>
    );
}