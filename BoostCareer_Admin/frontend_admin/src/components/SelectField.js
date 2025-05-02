import React from "react";
import { CCard, CCardBody, CCardHeader, CFormSelect } from "@coreui/react";

const SelectField = ({
  className = "",
  useCard = true,
  header_2 = "",
  label = "Chọn một mục",
  data = [],
  valueKey = "id",
  labelKey = "name",
  onChange,
  ...props
}) => {
  if (!data || data.length === 0) {
    return <p className="text-danger">Không có dữ liệu!</p>;
  }

  const selectComponent = (
    <CFormSelect onChange={(e) => onChange && onChange(e.target.value)} {...props}>
      <option value="">{label}</option>
      {data.map((item) => (
        <option key={item[valueKey]} value={item[valueKey]}>
          {item[labelKey]}
        </option>
      ))}
    </CFormSelect>
  );

  return useCard ? (
    <CCard className={className}>
      {header_2 && <CCardHeader><strong>{header_2}</strong></CCardHeader>}
      <CCardBody>{selectComponent}</CCardBody>
    </CCard>
  ) : (
    selectComponent
  );
};

export default SelectField;
