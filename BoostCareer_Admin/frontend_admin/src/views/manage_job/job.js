import React, { useState, useEffect } from "react";
import { useSelector,  } from "react-redux";
import { useFetchJobsQuery, useDelete_jobsMutation, useUpdate_status_Mutation } from "../../redux/api/api_jobs";
import { CCol, CRow, CForm, } from "@coreui/react";
import SelectField from "../../components/SelectField";
import Combo2Input from "../../components/Combo2Input";
import Combo2date from "../../components/Combo2date";
import Combo1Input from "../../components/Combo1Input";
import SearchControlRow from "../../components/ComboSearchcontrol";
import GenericTable from "../../components/GenericTable";
import { useConfigJobtable } from "./config_jobtable"
import { Pagination } from "../../components/pagination";
const Job = () => {

  ///// redux state
  const { industries, jobfunctions, cities, joblevels, experiences, object_status } = useSelector((state) => state.Catalog_state);
  const [deleteJobs] = useDelete_jobsMutation();
  const [updateStatus_Job] = useUpdate_status_Mutation();

  // Thêm state local 
  const [selectedRows, setSelectedRows] = useState([]);
  const {jobs} = useSelector((state) => state.Jobs_state);
  const [need_reload, setNeed_reload] = useState(!jobs || jobs.length === 0);
  const [searchData_job, setSearchData_job] = useState({
    title: "",
    industry: "",
    work_location: "",
    job_function: "",
    date_from: "",
    date_to: "",
    salary_min: "",
    salary_max: "",
    level_id: "",
    company_name: "",
    require_experience: "",
    status_: ""
  });
  const [paging, setPaging] = useState({
    active_page: 1,
    paging_size: 10,
    totalItems: 0,
    totalPages: 1
  });
  // Sử dụng queryParams thay vì trực tiếp searchData và paging
  const { data: res, refetch } = useFetchJobsQuery({
    searchData: searchData_job,
    paging,
  },
    { skip: !need_reload
      ,refetchOnMountOrArgChange: false }
  );


  //// config table
  const config = useConfigJobtable(need_reload, setNeed_reload);
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
    setSearchData_job(prev => ({
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
        const result = await deleteJobs({ job_ids: selectedRows });
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
        await updateStatus_Job({
          'status_': status_,
          'job_ids': selectedRows
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
          <SelectField class_name_="mb-3" header_2="Địa diểm" label={"Chọn tỉnh thành"} data={cities} valueKey="city_id" labelKey="city_name"
            onChange={(value) => handleInputChange('work_location', value)} />
          <Combo2date header_2="Khoảng thời gian" startLabel="Từ ngày" endLabel="Đến ngày"
            onChange_1={(value) => handleInputChange('date_from', value)} onChange_2={(value) => handleInputChange('date_to', value)} />
        </CCol>
        <CCol xs="auto" sm="auto" lg="auto">
          <SelectField class_name_="mb-3" header_2="Ngành nghề" label={"Chọn ngành nghề"} data={jobfunctions} valueKey="job_function_id" labelKey="job_function_name"
            onChange={(value) => handleInputChange('job_function', value)} />
          <Combo2Input class_name_="mb-3" header_2="Mức lương" holder1="Từ" holder2="Đến" step="500000"
            onChange_1={(value) => handleInputChange('salary_min', value)} onChange_2={(value) => handleInputChange('salary_max', value)} />
          <Combo1Input header_2="Đơn vị tuyển dụng" holder="Nhập từ khóa" onChange={(value)=> handleInputChange('company_name',value)}/>
        </CCol>
        <CCol xs="auto" sm="auto" lg="auto">
          <SelectField class_name_="mb-4" header_2="Cấp bậc" label={"Bất kỳ"} data={joblevels} valueKey="level_id" labelKey="level_name"
            onChange={(value) => handleInputChange('level_id', value)} />
          <CRow>
            <CCol>
              <SelectField class_name_="mb-2" header_2="Trạng thái" label={"Bất kỳ"} data={object_status} valueKey="id" labelKey="name"
                onChange={(value) => handleInputChange('status_', value)} />
            </CCol>
            <CCol>
              <SelectField class_name_="mb-2" header_2="Kinh nghiệm" label={"Bất kỳ"} data={experiences} valueKey="id" labelKey="name"
                onChange={(value) => handleInputChange('require_experience', value)} />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <SearchControlRow
        marginTop="4"
        marginBottom="2"
        marginX="5"
        onSearch={handleSearch}
        onChange={(value) => handleInputChange('title', value)}
        onDelete={handle_Multidelete}
        onstatus={handle_update_status}
        setPageSize={handle_change_paging_size}
        pagingSize={paging.paging_size}
      />
      {!jobs? (<GenericTable
        columns={config.columns}
        data={[]}
        actions={config.actions}
        cardTitle="Danh sách tin tuyển dụng"
        className="mt-3"
        keyField='job_id'
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
      />):
      (<GenericTable
        columns={config.columns}
        data={jobs}
        actions={config.actions}
        cardTitle="Danh sách tin tuyển dụng"
        className="mt-3"
        keyField='job_id'
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

export default Job;