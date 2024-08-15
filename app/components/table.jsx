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
  Calendar
} from "@nextui-org/react";
import { parseDate } from '@internationalized/date';
import { PlusIcon } from "./PlusIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { columns, users } from "./data";
import { capitalize } from "./utils";


const INITIAL_VISIBLE_COLUMNS = ["item", "quantity", "added on", "expires on", "actions"];

export default function TableDemo() {
  let [value, setValue] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "quantity",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasSearchFilter = Boolean(filterValue);
  // Calendar date: added on 
  const [isCalendarVisible, setIsCalendarVisible] = useState(false); 
  const [selectedDate, setSelectedDate] = useState(null); 
  const calendarRef = useRef(null);  // Ref to the calendar component
  const inputRef = useRef(null);  // Ref to the input component

  // Calendar date: expiry date 
  const [isExpiresCalendarVisible, setExpiresIsCalendarVisible] = useState(false); 
  const [selectedExpiresDate, setExpiresSelectedDate] = useState(null); 
  const expiresCalendarRef = useRef(null);  // Ref to the calendar component
  const expiresInputRef = useRef(null);  // Ref to the input component

  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleCaptureClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleTakePicture = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL('image/png');
    setCapturedImage(imageData);
    videoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Stop the video stream
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsCalendarVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarRef, inputRef]);

  const handleInputClick = (field) => {
    if (field === 'addedOn') {
      setIsCalendarVisible(!isCalendarVisible);
    } else if (field === 'expiresOn') {
      setExpiresIsCalendarVisible(!isExpiresCalendarVisible);
    }
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);  // Update the state with the selected date
    setIsCalendarVisible(false);  // Hide the calendar
  };

const handleExpiresDateSelect = (date) => { 
  setExpiresSelectedDate(date);
  setExpiresIsCalendarVisible(false);
}

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.item.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredUsers;
  }, [users, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "item":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleAddNewClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mt-20">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by item..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />} onClick={handleAddNewClick}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {users.length} users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-semibold">Add Product</div>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                &#x2715;
              </button>
            </div>
            <div className="text-gray-600 mb-6">What are you adding today?</div>
            <div className="mb-4">
              <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product</label>
              <input type="text" id="product" name="product" placeHolder="Banana" className="mt-1 block w-full rounded-md border-black shadow-sm focus:ring-black focus:border-black sm:text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" id="quantity" name="quantity" placeHolder="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-sm" />
            </div>
            <div className="relative">
{/* Added on field */}
<div 
  ref={inputRef} 
  onClick={() => handleInputClick('addedOn')}  // Pass 'addedOn' to handleInputClick
  className="w-full p-2 border rounded-md cursor-pointer flex items-center"
>
  <span role="img" aria-label="calendar" className="mr-2">
    📅
  </span>
  {selectedDate ? selectedDate.toString() : 'Added on'}  {/* Display selected date or default text */}
</div>
{isCalendarVisible && (
  <div ref={calendarRef} className="absolute right-0 mt-2 z-10">
    <Calendar 
      aria-label="Select Expiration Date"
      value={selectedDate}  // Bind to selectedExpiresDate state (corrected typo)
      onChange={handleDateSelect}  // Call handleExpiresDateSelect when a date is selected
      className="rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-sm"
    />
  </div>
)}
{/* Expires on field */}
<div 
  ref={expiresInputRef} 
  onClick={() => handleInputClick('expiresOn')}  // Pass 'expiresOn' to handleInputClick
  className="w-full p-2 border rounded-md cursor-pointer flex items-center"
>
  <span role="img" aria-label="calendar" className="mr-2">
    📅
  </span>
  {selectedExpiresDate ? selectedExpiresDate.toString() : 'Expires on'}  {/* Display selected date or default text */}
</div>

{/* Expires on Calendar */}
{isExpiresCalendarVisible && (
  <div ref={expiresCalendarRef} className="absolute right-0 mt-2 z-10">
    <Calendar 
      aria-label="Select Expiration Date"
      value={selectedExpiresDate}  // Bind to selectedExpiresDate state (corrected typo)
      onChange={handleExpiresDateSelect}  // Call handleExpiresDateSelect when a date is selected
      className="rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-sm"
    />
  </div>
)}
    </div>
    <div>
      {capturedImage ? (
        <div className="mb-4">
          <img src={capturedImage} alt="Captured" className="rounded-md shadow-sm" />
        </div>
      ) : (
        <div className="mb-4">
          <button
            onClick={handleCaptureClick}
            className="mt-1 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Capture
          </button>
          <video className="mt-2" ref={videoRef} style={{ display: capturedImage ? 'none' : 'block' }} />
          <canvas className="mt-2"ref={canvasRef} style={{ display: 'none' }} width="480" height="480"></canvas>
          <button
            onClick={handleTakePicture}
            className="mt-2 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Take Picture
          </button>
        </div>
      )}
    </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                Add To Pantry
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
