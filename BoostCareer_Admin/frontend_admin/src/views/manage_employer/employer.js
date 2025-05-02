import React, { useState, useEffect } from "react";
import { useSelector,  } from "react-redux";
import {   useFetchEmployersQuery,
  useDelete_EmployersMutation,
  useUpdate_EmployersMutation,
  useUpdate_status_EmployersMutation,
  useSend_message_employerMutation,
  useReset_Password_employerMutation } from "../../redux/api/api_employers";
import { CCol, CRow, CForm, } from "@coreui/react";
import SelectField from "../../components/SelectField";
import Combo2Input from "../../components/Combo2Input";
import Combo2date from "../../components/Combo2date";
import Combo1Input from "../../components/Combo1Input";
import SearchControlRow from "../../components/ComboSearchcontrol";
import GenericTable from "../../components/GenericTable";
import { config_employertable } from "./config_employertable.js"
import { Pagination } from "../../components/pagination";
const Employer = () => 
  {
 
   ///// redux state
   const { industries, cities, object_status,scales } = useSelector((state) => state.Catalog_state);
   const [deleteemployers] = useDelete_EmployersMutation();
   const [updateStatus_employer] = useUpdate_status_EmployersMutation();
   const [sendMessage] = useSend_message_employerMutation();
   const [resetPassword] = useReset_Password_employerMutation();
 
   // Thêm state local 
   const [selectedRows, setSelectedRows] = useState([]);
   const [need_reload, setNeed_reload] = useState(true);
   const [searchData_employer, setSearchData_employer] = useState({
     title: "",
     industry: "",
     work_location: "",
     scale_id: "",     
     employer_status: ""
   });
   const [paging, setPaging] = useState({
     active_page: 1,
     paging_size: 10,
     totalItems: 0,
     totalPages: 1
   });
   const { data: res, refetch } = useFetchEmployersQuery({
     searchData: searchData_employer,
     paging,
   },
     { skip: !need_reload
       ,refetchOnMountOrArgChange: false }
   );
   const {employers} = useSelector((state) => state.Employers_state);
 
   //// config table
   const config = config_employertable(need_reload, setNeed_reload);

 useEffect(() => {
   if (need_reload) {
     const fetchData = async () => {
       try {
           const result = await refetch();
         if (result.data) {
           setPaging(prev => ({...prev,totalPages: result.data.totalPages || 1 }));
         }
         setNeed_reload(false);
       } catch (error) {
         console.error("Error fetching data:", error);
         setNeed_reload(false);
       }
     };
     fetchData();
   }
 }, [need_reload]);
 
   const handleInputChange = (field, value) => {
     setSearchData_employer(prev => ({
       ...prev,
       [field]: value
     }));
   };
   const handleSearch = async () => {
       setPaging((prev) => ({...prev, active_page: 1}));
       setNeed_reload(true); // Cập nhật lại state need_reload để trigger refetch
     };
   
   const handle_Multidelete = async () => {
     if (selectedRows.length > 0) {
       try {
         const result = await deleteemployers({ employer_ids: selectedRows });
         if (result.data) {
         setSelectedRows([]);
         setNeed_reload(true);
         }
       } catch (error) {
         console.error("Delete error:", error);
       }
     }
   };
 
   const handle_update_status = async (status_) => {
     if (selectedRows.length > 0) {
       try {
         await updateStatus_employer({
           'status_': status_,
           'employer_ids': selectedRows
         });
         setSelectedRows([]);
         setNeed_reload(true);
       } catch (error) {
         console.error("Status update error:", error);
       }
     }
   };
   const handle_change_active_page = (newpage) => {
     // Cập nhật Redux state
     setNeed_reload(true);
     setPaging((prev) => ({ ...prev, active_page: newpage }));
     console.log("set state new active page ", newpage);
     
   };
   const handle_change_paging_size = (newsize) => {
     // Cập nhật Redux state
     setNeed_reload(true);
     setPaging((prev) => ({ ...prev, paging_size: newsize })); 
     console.log("set state new paging size ", newsize);
   };
 
  
   return (
     <CForm onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
       <CRow>
         <CCol xs="auto" sm="auto" lg="auto">
           <SelectField class_name_="mb-3" header_2="Lĩnh vực" label={"Chọn lĩnh vực"} data={industries} valueKey="industry_id" labelKey="industry_name"
             onChange={(value) => handleInputChange('industry', value)} />
         </CCol>
         <CCol xs="auto" sm="auto" lg="auto">
         <SelectField class_name_="mb-3" header_2="Địa diểm" label={"Chọn tỉnh thành"} data={cities} valueKey="city_id" labelKey="city_name"
             onChange={(value) => handleInputChange('work_location', value)} />
          </CCol>   
         <CCol xs="auto" sm="auto" lg="auto">
           <SelectField class_name_="mb-3" header_2="Quy mô" label={"Chọn quy mô"} data={scales} valueKey="scale_id" labelKey="scale_id"
             onChange={(value) => handleInputChange('scale_id', value)} />
         </CCol>
         <CCol xs="auto" sm="auto" lg="auto">
             <CCol>
               <SelectField class_name_="mb-2" header_2="Trạng thái" label={"Bất kỳ"} data={object_status} valueKey="id" labelKey="name"
                 onChange={(value) => handleInputChange('status_', value)} />
             </CCol>
         </CCol>
       </CRow>
       <SearchControlRow
         marginTop="4"
         marginBottom="2"
         marginX="5"
         is_job={false}
         onSearch={handleSearch}
         onChange={(value) => handleInputChange('title', value)}
         onDelete={handle_Multidelete}
         onstatus={handle_update_status}
         setPageSize={handle_change_paging_size}
         pagingSize={paging.paging_size}
       />
       {employers? (<GenericTable
         columns={config.columns}
         data={employers}
         actions={config.actions}
         cardTitle="Danh sách tin tuyển dụng"
         className="mt-3"
         keyField='employer_id'
         setSelectedRows={setSelectedRows}
         selectedRows={selectedRows}
        />):<GenericTable
        columns={config.columns}
        data={[]}
        actions={config.actions}
        cardTitle="Danh sách tin tuyển dụng"
        className="mt-3"
        keyField='employer_id'
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
       />}
       <Pagination
         activePage={paging.active_page}
         totalPages={paging.totalPages}
         onPageChange={handle_change_active_page}
       />
     </CForm>
   );
 };

export default Employer;