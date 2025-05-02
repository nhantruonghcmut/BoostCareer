import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {       useFetchjobseekersQuery,
  useDelete_jobseekersMutation,
  useUpdate_jobseekersMutation,
  useUpdate_status_jobseekersMutation,
  useSend_message_jobseekerMutation,
  useReset_Password_jobseekerMutation, } from "../../redux/api/api_jobseeker";
import { CCol, CRow, CForm, } from "@coreui/react";
import SelectField from "../../components/SelectField";
import Combo2Input from "../../components/Combo2Input";
import Combo2date from "../../components/Combo2date";
import Combo1Input from "../../components/Combo1Input";
import SearchControlRow from "../../components/ComboSearchcontrol";
import GenericTable from "../../components/GenericTable";
import { config_jobseekertable } from "./config_jobseekertable.js"
import { Pagination } from "../../components/pagination";
const jobseeker = () => 
  {
 
   ///// redux state
   const { jobfunctions,districts, cities, object_status,joblevels,educations,languages,experiences_jobseeker } = useSelector((state) => state.Catalog_state);
   const [deletejobseekers] = useDelete_jobseekersMutation();
   const [updateStatus_jobseeker] = useUpdate_status_jobseekersMutation();
   const [sendMessage] = useSend_message_jobseekerMutation();
   const [resetPassword] = useReset_Password_jobseekerMutation();
 
   // Thêm state local 
   const [selectedRows, setSelectedRows] = useState([]);
   const {jobseekers} = useSelector((state) => state.Jobseekers_state);
   const [need_reload, setNeed_reload] = useState(!jobseekers || jobseekers.length === 0);
   const [searchData_jobseeker, setSearchData_jobseeker] = useState({
     title: "",
     job_function_id: "",
     district_id: "",
     level_id: "",    
      year_exp : "",
      age_min: "",
      age_max: "",
      gender: "",
      status_: "",
      language_id: "",
      education_id: "",
   });
   const [paging, setPaging] = useState({
     active_page: 1,
     paging_size: 10,
     totalItems: 0,
     totalPages: 1
   });
   const { data: res, refetch } = useFetchjobseekersQuery({
     searchData: searchData_jobseeker,
     paging,
   },
     { skip: !need_reload
       ,refetchOnMountOrArgChange: false }
   );
     //// config table
   const config = config_jobseekertable(need_reload, setNeed_reload);
   console.log("jobseeker data ", jobseekers);
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
     setSearchData_jobseeker(prev => ({
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
         const result = await deletejobseekers({ jobseeker_ids: selectedRows });
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
         await updateStatus_jobseeker({
           'status_': status_,
           'jobseeker_ids': selectedRows
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
           <SelectField class_name_="mb-3" header_2="Ngành nghề" label={"Chọn ngành nghề"} data={jobfunctions} valueKey="job_function_id" labelKey="job_function_name"
             onChange={(value) => handleInputChange('job_function_id', value)} />
            <Combo2Input class_name_="mb-3" header_2="Tuổi" holder1="Từ" holder2="Đến" step="1"
            onChange_1={(value) => handleInputChange('age_min', value)} onChange_2={(value) => handleInputChange('age_max', value)} />
         </CCol>         
         <CCol xs="auto" sm="auto" lg="auto">
            <SelectField class_name_="mb-3" header_2="Nơi ở hiện tại" label={"Chọn tỉnh thành - quận huyện"} data={districts} valueKey="district_id" labelKey="district_name"
                onChange={(value) => handleInputChange('district_id', value)} />
            <SelectField class_name_="mb-3" header_2="Cấp bậc" label={"Bất kỳ"} data={joblevels} valueKey="level_id" labelKey="level_name"
                onChange={(value) => handleInputChange('level_id', value)} />
          </CCol>   

         <CCol xs="auto" sm="auto" lg="auto">
           <SelectField class_name_="mb-3" header_2="Số năm kinh nghiệm" label={"Bất kỳ"} data={experiences_jobseeker} valueKey="id" labelKey="name"
             onChange={(value) => handleInputChange('year_exp', value)} />
            <SelectField class_name_="mb-3" header_2="Ngoại ngữ" label={"Bất kỳ"} data={languages} valueKey="language_id" labelKey="metric_display"
             onChange={(value) => handleInputChange('language_id', value)} />
         </CCol>
         <CCol xs="auto" sm="auto" lg="auto">
             <SelectField class_name_="mb-2" header_2="Trình độ học vấn" label={"Bất kỳ"} data={educations} valueKey="education_id" labelKey="education_title"
                 onChange={(value) => handleInputChange('education_id', value)} />
               <SelectField class_name_="mb-2" header_2="Trạng thái" label={"Bất kỳ"} data={object_status} valueKey="id" labelKey="name"
                 onChange={(value) => handleInputChange('status_', value)} />
         </CCol>
        <CCol xs="auto" sm="auto" lg="auto">
            <SelectField class_name_="mb-3" header_2="Giới tính" label={"Bất kỳ"} data={[{id:1,name:"Nam"},{id:2,name:"Nữ"}]} valueKey="id" labelKey="name"
             onChange={(value) => handleInputChange('gender', value)} />
        </CCol>
        </CRow>
       <SearchControlRow
         marginTop="4" marginBottom="2" marginX="5"
         is_job={false}
         onSearch={handleSearch}
         onChange={(value) => handleInputChange('title', value)}
         onDelete={handle_Multidelete}
         onstatus={handle_update_status}
         setPageSize={handle_change_paging_size}
         pagingSize={paging.paging_size}
       />
       {jobseekers? (<GenericTable
         columns={config.columns}
         data={jobseekers}
         actions={config.actions}
         cardTitle="Danh sách tin tuyển dụng"
         className="mt-3"
         keyField='jobseeker_id'
         setSelectedRows={setSelectedRows}
         selectedRows={selectedRows} 
       />):(<GenericTable
        columns={config.columns}
        data={[]}
        actions={config.actions}
        cardTitle="Danh sách tin tuyển dụng"
        className="mt-3"
        keyField='jobseeker_id'
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows} 
      />)}

       <Pagination
         activePage={paging.active_page}
         totalPages={paging.totalPages}
         onPageChange={handle_change_active_page}
       />
     </CForm>
   );
 };

export default jobseeker;