import MUIDataTable from "mui-datatables";
import { Button } from 'antd';
import { noti } from './../noti';
const columns = [
  {
   name: "id",
   label: "id",
   options: {
    display:false,
    filter: false,
    sort: false,
    customBodyRender : (val, tableMeta, updateValue) => (
      <div className="text-left w-28 ">{val}</div>
    )
   }
  },
  {
   name: "name",
   label: "ชื่อโรค",
   options: {
    filter: true,
    sort: false,
    customBodyRender : (val, tableMeta, updateValue) => (
      <div className="text-left w-28 ">{val}</div>
    )
   }
  },
  {
   name: "amount",
   label: "จำนวน",
   options: {
    filter: true,
    sort: false,
    customBodyRender : (val, tableMeta, updateValue) => (
      <div className="w-12 text-right">{val}</div>
    )
   }
  },
  {
   name: "option",
   label: "แสดงแบบประเมิน",
   options: {
    filter: true,
    sort: false,
    print:false,
    customBodyRender : (val, {rowData}, updateValue) => (
      <Button className="text-left" onClick={()=>noti("info",`show ${rowData[0]}`)}>รายละเอียด</Button>
    )
   }
  },
 
 ];
 
 const data = [
  {id : "asd",name: "โรคเบาหวาน" , amount : "10"},
  {id : "asd1",name: "โรคความดันโลหิตสูง" , amount : "2"},
  {id : "asd2",name: "โรคถุงลมโป่งพอง" , amount : "5"},
  {id : "asd3",name: "โรคหลอดเลือดสมอง" , amount : "7"},
  {id : "asd4",name: "โรคมะเร็ง" , amount : "8"},
  {id : "asd5",name: "โรคอ้วนลงพุง" , amount : "1"},
 ];

const options = {
  filterType: "dropdown",
  responsive: "standard",
  selectableRows: 'none'
};


export default function FoodTable() {


  return (
    <MUIDataTable
      title={"แบบประเมินความเสี่ยงโรคไมติดต่อเรื้อรัง"}
      data={data}
      columns={columns}
      options={options}
    />
  );
}
