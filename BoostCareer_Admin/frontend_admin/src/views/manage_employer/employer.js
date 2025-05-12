import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  useFetchEmployersQuery,
  useDelete_EmployersMutation,
  useUpdate_EmployersMutation,
  useUpdate_status_EmployersMutation,
  useSend_message_employerMutation,
  useReset_Password_employerMutation 
} from "../../redux/api/api_employers";
import { clearEmployerErrors } from "../../redux/slices/employerSlice";
import { CCol, CRow, CForm, CSpinner, CAlert, CToast, CToastBody, CToastHeader, CToaster } from "@coreui/react";
import SelectField from "../../components/SelectField";
import SearchControlRow from "../../components/ComboSearchcontrol";
import GenericTable from "../../components/GenericTable";
import { config_employertable } from "./config_employertable.js";
import { Pagination } from "../../components/pagination";

const Employer = () => {
  // Redux hooks
  const dispatch = useDispatch();
  const { industries, cities, object_status, scales } = useSelector((state) => state.Catalog_state);
  const { employers, loading, error, totalPages: reduxTotalPages } = useSelector((state) => state.Employers_state);
   
  // API mutations
  const [deleteEmployers, { isLoading: isDeleting }] = useDelete_EmployersMutation();
  const [updateStatusEmployer, { isLoading: isUpdatingStatus }] = useUpdate_status_EmployersMutation();
  const [sendMessage, { isLoading: isSendingMessage }] = useSend_message_employerMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useReset_Password_employerMutation();
 
  // Local state
  const [selectedRows, setSelectedRows] = useState([]);
  const [need_reload, setNeed_reload] = useState(true);
  const [toasts, setToasts] = useState([]);
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
   
  // RTK Query hook
  const { refetch } = useFetchEmployersQuery({
    searchData: searchData_employer,
    paging,
  }, {
    skip: !need_reload,
    refetchOnMountOrArgChange: false
  });

  // Toast message function
  const addToast = (title, message, color = 'primary') => {
    setToasts(prev => [
      ...prev,
      { title, message, color, timestamp: new Date() }
    ]);
  };

  // Config table
  const config = config_employertable(need_reload, setNeed_reload);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearEmployerErrors());
    };
  }, [dispatch]);

  useEffect(() => {
    if (need_reload) {
      const fetchData = async () => {
        try {
          const result = await refetch();
          if (result.data) {
            setPaging(prev => ({...prev, totalPages: result.data.totalPages || 1 }));
          }
          setNeed_reload(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          addToast('Error', 'Failed to fetch employer data', 'danger');
          setNeed_reload(false);
        }
      };
      fetchData();
    }
  }, [need_reload, refetch]);

  // Handle error display
  useEffect(() => {
    if (error) {
      addToast('Error', error, 'danger');
      dispatch(clearEmployerErrors());
    }
  }, [error, dispatch]);

  const handleInputChange = (field, value) => {
    setSearchData_employer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    setPaging((prev) => ({...prev, active_page: 1}));
    setNeed_reload(true); // Trigger refetch
  };
   
  const handle_Multidelete = async () => {
    if (selectedRows.length > 0) {
      try {
        const result = await deleteEmployers({ employer_ids: selectedRows });
        if (result.data) {
          setSelectedRows([]);
          setNeed_reload(true);
          addToast('Success', `${selectedRows.length} employers deleted successfully`, 'success');
        }
      } catch (error) {
        console.error("Delete error:", error);
        addToast('Error', 'Failed to delete employers', 'danger');
      }
    } else {
      addToast('Warning', 'Please select employers to delete', 'warning');
    }
  };
 
  const handle_update_status = async (status_) => {
    if (selectedRows.length > 0) {
      try {
        const result = await updateStatusEmployer({
          'status_': status_,
          'employer_ids': selectedRows
        });
        if (result.data) {
          setSelectedRows([]);
          setNeed_reload(true);
          addToast('Success', `Status updated for ${selectedRows.length} employers`, 'success');
        }
      } catch (error) {
        console.error("Status update error:", error);
        addToast('Error', 'Failed to update status', 'danger');
      }
    } else {
      addToast('Warning', 'Please select employers to update status', 'warning');
    }
  };

  const handle_change_active_page = (newpage) => {
    setNeed_reload(true);
    setPaging((prev) => ({ ...prev, active_page: newpage }));
  };

  const handle_change_paging_size = (newsize) => {
    setNeed_reload(true);
    setPaging((prev) => ({ ...prev, paging_size: newsize })); 
  };
 
  return (
    <>
      {/* Toast container */}
      <CToaster position="top-end">
        {toasts.map((toast, index) => (
          <CToast
            key={index}
            autohide={true}
            delay={5000}
            visible={true}
            color={toast.color}
            className="text-white align-items-center"
          >
            <CToastHeader closeButton>
              <strong className="me-auto">{toast.title}</strong>
              <small>{toast.timestamp.toLocaleTimeString()}</small>
            </CToastHeader>
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
      </CToaster>
      
      {/* Error display */}
      {error && (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      )}

      <CForm onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <CRow>
          <CCol xs="auto" sm="auto" lg="auto">
            <SelectField 
              class_name_="mb-3" 
              header_2="Lĩnh vực" 
              label={"Chọn lĩnh vực"} 
              data={industries} 
              valueKey="industry_id" 
              labelKey="industry_name"
              onChange={(value) => handleInputChange('industry', value)} 
            />
          </CCol>
          <CCol xs="auto" sm="auto" lg="auto">
            <SelectField 
              class_name_="mb-3" 
              header_2="Địa điểm" 
              label={"Chọn tỉnh thành"} 
              data={cities} 
              valueKey="city_id" 
              labelKey="city_name"
              onChange={(value) => handleInputChange('work_location', value)} 
            />
          </CCol>   
          <CCol xs="auto" sm="auto" lg="auto">
            <SelectField 
              class_name_="mb-3" 
              header_2="Quy mô" 
              label={"Chọn quy mô"} 
              data={scales} 
              valueKey="scale_id" 
              labelKey="scale_id"
              onChange={(value) => handleInputChange('scale_id', value)} 
            />
          </CCol>
          <CCol xs="auto" sm="auto" lg="auto">
            <SelectField 
              class_name_="mb-2" 
              header_2="Trạng thái" 
              label={"Bất kỳ"} 
              data={object_status} 
              valueKey="id" 
              labelKey="name"
              onChange={(value) => handleInputChange('employer_status', value)} 
            />
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
          disableActions={loading || isDeleting || isUpdatingStatus}
          isDeleting={isDeleting}
          isUpdatingStatus={isUpdatingStatus}
        />

        {/* Loading indicator */}
        {loading && (
          <div className="text-center my-3">
            <CSpinner color="primary" />
          </div>
        )}

        {/* Table */}
        {!loading && (
          <GenericTable
            columns={config.columns}
            data={employers || []}
            actions={config.actions}
            cardTitle="Danh sách nhà tuyển dụng"
            className="mt-3"
            keyField='employer_id'
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
          />
        )}

        {/* Message Modal */}
        {config.messageModal}

        {/* Pagination */}
        <Pagination
          activePage={paging.active_page}
          totalPages={paging.totalPages || reduxTotalPages || 1}
          onPageChange={handle_change_active_page}
        />
      </CForm>
    </>
  );
};

export default Employer;