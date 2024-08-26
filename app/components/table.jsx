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
import { PlusIcon } from "./PlusIcon";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import { SearchIcon } from "./SearchIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { capitalize } from './utils';
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase"; 
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs} from "firebase/firestore";

const INITIAL_VISIBLE_COLUMNS = ["item", "quantity", "added on", "expires on", "actions"];
const columns = [
  { name: "ITEM", uid: "item", sortable: true },
  { name: "QUANTITY", uid: "quantity", sortable: true },
  { name: "ADDED ON", uid: "added on", sortable: true },
  { name: "EXPIRES ON", uid: "expires on", sortable: true },
  { name: "ACTIONS", uid: "actions" }
];

export default function TableDemo() {
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
  const [tableData, setTableData] = useState([]); // State for table data
  const [editingItem, setEditingItem] = useState(null); 

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

      if (
        expiresCalendarRef.current &&
        !expiresCalendarRef.current.contains(event.target) &&
        expiresInputRef.current &&
        !expiresInputRef.current.contains(event.target)
      ) {
        setExpiresIsCalendarVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarRef, inputRef, expiresCalendarRef, expiresInputRef]);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    const auth = getAuth(); // Move this inside the function to ensure the latest state
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    // Collect the form data
    const newItem = {
      product: e.target.product.value,
      quantity: e.target.quantity.value,
      addedOn: selectedDate ? selectedDate.toString() : "N/A",
      expiresOn: selectedExpiresDate ? selectedExpiresDate.toString() : "N/A",
      image: capturedImage,
      userId: user.uid, // Include user ID
      userEmail: user.email, // Include user email
    };

    try {
      if (editingItem){ 
        const docRef = await addDoc(collection(db, "products"), newItem);
        await updateDoc(docRef,newItem);

        const updatedTableData = tableData.map(item=> item.id === editingItem.id ? {...item,...newItem}: item); 
        setTableData(updatedTableData);
      }
      else { 
      // Save the new item to Firestore
      const docRef = await addDoc(collection(db, "products"), newItem);
      console.log("Document written with ID: ", docRef.id);

      // Update the local state to include the new item
      setTableData((prevData) => [...prevData, { id: docRef.id, ...newItem }]);
      } 
      // Close the modal
      setEditingItem(null);
      handleCloseModal();
    } catch (e) {
      console.error("Error adding/editing document: ", e);
    }
  };
  
  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredItems = [...tableData];
    if (filterValue) {
      filteredItems = filteredItems.filter((item) =>
        item.product.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredItems;
  }, [tableData, filterValue]);

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

  const handleEditClick = (item) => { 
    setEditingItem(item);  
    setSelectedDate(null);
    setExpiresSelectedDate(null);
    setCapturedImage(null); 
    setIsModalOpen(true); 
  };
  
  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "item":
        return (  
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={item.image} 
              alt={`${item.product} avatar`} 
              style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} 
            />
            {item.product}
          </div>
        );
      case "quantity":
          return item.quantity;
      case "added on":
          return item.addedOn;
      case "expires on":
          return item.expiresOn;
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
                <DropdownItem onClick={() => handleEditClick(item)}>Edit</DropdownItem>
                <DropdownItem onClick={() => handleDeleteItem(item)}>Delete</DropdownItem>
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
    setSelectedDate(null);  // Reset the 'added on' date
    setExpiresSelectedDate(null);  // Reset the 'expires on' date
    setEditingItem(null);  // Ensure no item is being edited
    setIsModalOpen(true);
    setCapturedImage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteItem = async (item) => {  // Declare the function as async
    if (!item.id) {
      console.error("Item ID is missing. Cannot delete.");
      return;
    }
  
    try { 
      const docRef = doc(db, "products", item.id);
      await deleteDoc(docRef);  // Now 'await' can be used correctly
      setTableData(prevData => prevData.filter(dataItem => dataItem.id !== item.id));
      console.log("Item deleted with ID: ", item.id);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };
  

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col justify-gap-4 mt-20 ">
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
          <span className="text-default-400 text-small">Total {tableData.length} items</span>
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
    tableData.length,
    onSearchChange,
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
  }, [selectedKeys, items.length, page, pages]);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      const querySnapshot = await getDocs(collection(db, "products"));
      const userItems = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === user.uid) {
          userItems.push({ id: doc.id, ...doc.data() });
        }
      });
      setTableData(userItems);
    };

    fetchData();
  }, []);

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
        <TableBody emptyContent={"No items found"} items={sortedItems}>
          {sortedItems.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.uid}>
                  {renderCell(item, column.uid)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <form onSubmit={handleFormSubmit}>
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-semibold">{editingItem ? " Edit Product" : "Add Product"}</div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  &#x2715;
                </button>
              </div>
              <div className="text-gray-600 mb-6">
                {editingItem ? "What are you editing today?" : "What are you adding today?"} 
              </div>
              <div className="mb-4">
                <label
                  htmlFor="product"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product
                </label>
                <input
                  type="text"
                  id="product"
                  name="product"
                  placeholder="Banana"
                  className="mt-1 block w-full rounded-md border-black shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  defaultValue={editingItem ? editingItem.product : ""}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  placeholder="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  defaultValue={editingItem ? editingItem.quantity : ""}  
                  required
                />
              </div>

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
                <div ref={calendarRef} className="flex justify-center items-center">
                  <Calendar 
                    aria-label="Select Expiration Date"
                    value={selectedDate} 
                    onChange={handleDateSelect}  
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
                <div ref={expiresCalendarRef} className="flex justify-center items-center">
                  <Calendar 
                    aria-label="Select Expiration Date"
                    value={selectedExpiresDate}  // Bind to selectedExpiresDate state (corrected typo)
                    onChange={handleExpiresDateSelect}  // Call handleExpiresDateSelect when a date is selected
                    className="rounded-md border-gray-300 shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
              )}
              
              <div>
                {capturedImage ? (
                  <div className="mb-4">
                    <img src={capturedImage} alt="Captured" className="rounded-md shadow-sm" />
                  </div>
                ) : (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={handleCaptureClick}
                      className="mt-1 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Capture
                    </button>
                    <video className="mt-2" ref={videoRef} style={{ display: capturedImage ? 'none' : 'block' }} />
                    <canvas className="mt-2" ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
                    <button
                      type="button"
                      onClick={handleTakePicture}
                      className="mt-2 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Take Picture
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Add To Pantry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
