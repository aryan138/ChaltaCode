import Card from 'components/card'
import React, { useState } from 'react'
import ComplexTable from './components/ComplexTable'
import {columnsDataComplex} from './variables/columnsData.js'
import tableDataComplex from "./variables/tableDataComplex.json";
// import AddBranches from './components/AddBranches';
import { MdFileUpload } from "react-icons/md";
import AddBranches from './components/AddBranches';

const Branches = () => {
  const [addBranchForm1,setAddBranchForm1] = useState(false);
  const handleOrderClick = ()=>{
    setAddBranchForm1(true);
  }
  const handleModalClose = () => {
    setAddBranchForm1(false);
  };
  return (
    <div className="main-div w-full h-screen flex flex-col gap-4 pr-6 m-4" >
    
    <div className='w-[100%] h-auto flex flex-col p-6 gap-5 rounded-lg items-center lg:flex lg:flex-row lg:justify-center '>
        <div className='w-[350px] h-[40vh] border border-xl bg-white  rounded-xl sm:w-full'>
        
        </div>
        <div className='w-[350px] h-[40vh]  border border-xl rounded-xl sm:w-full bg-white flex  gap-3' >
        {/* card */}
        <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-4 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none 2xl:grid-cols-11">
          <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6 overflow-y-auto">
            <button
              className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0"
              onClick={handleOrderClick}
            >
              <MdFileUpload className="text-[80px] text-brand-500 dark:text-white" />
              <h4 className="text-xl font-bold text-brand-500 dark:text-white">
                Add Branch
              </h4>
              <p className="mt-2 text-sm font-medium text-gray-600">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi, doloribus.
              </p>
            </button>
          </div>

          <div className="col-span-5 flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-white pl-3 pb-4 dark:!bg-navy-800">
            <h5 className="text-left text-xl font-bold leading-9 text-navy-700 dark:text-white">
              Add your branch here
            </h5>
            <p className="leading-1 mt-2 text-base font-normal text-gray-600">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quasi optio nulla deserunt corrupti perferendis aut!
            </p>
            <button
              className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
              onClick={handleOrderClick}
            >
              Add Branch
            </button>
          </div>
        </Card>

        </div>
    </div>
    <div className='w-[100%] h-auto  flex'>
        <div className='w-[100%] h-[50vh] p-3'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        </div>
    </div>
    {addBranchForm1 && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white rounded-lg shadow-lg p-6 w-2/5 h-2/4">
            <AddBranches onClose={handleModalClose} />
          </div>
        </div>
    )}

    </div>
    
  );
}

export default Branches
