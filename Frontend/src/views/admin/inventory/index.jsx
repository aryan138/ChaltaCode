import React from 'react'
import Storage from './components/Storage'
import Upload from './components/Upload'
import Card from 'components/card'
import Table from './components/Table'
import { 
  columnsDataCheck,
} from "./variables/columnsData";
import tableDataCheck from "./variables/tableDataCheck.json";

function Inventory() {
  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
      <Storage/>
      <Upload/>
      </div>
      <div className="mt-5 grid w-full h-full pb-4 "> 
      <Table columnsData={columnsDataCheck} tableData={tableDataCheck} />
      </div>
    </div>
  )
}

export default Inventory
