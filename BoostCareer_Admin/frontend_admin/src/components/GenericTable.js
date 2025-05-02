import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormCheck,
  CButton,
  CButtonGroup
} from "@coreui/react";

const GenericTable = ({
  columns = [],
  data = [],
  actions = [],
  cardTitle = "Bảng dữ liệu",
  striped = true,
  bordered = true,
  hover = true,
  keyField = null,
  responsive = true,
  selectable = true,
  button_classname=null,
  selectedRows=[], setSelectedRows=[],
  ...props
}) => {
  // const [selectedRows, setSelectedRows] = useState([]);
  const getRowKey = (item, rowIndex) => {
    // Nếu keyField được chỉ định và item có trường đó
    if (keyField && item[keyField] !== undefined) {
      return item[keyField];
    }
    // Ngược lại, sử dụng rowIndex làm key mặc định
    return rowIndex;
  };
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allKeys = data.map((item, index) => getRowKey(item, index));
      setSelectedRows(allKeys);
    } else {
      setSelectedRows([]);
    }
  };
  
  const handleSelectRow = (item, rowIndex) => {
    const key = getRowKey(item, rowIndex);
    if (selectedRows.includes(key)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== key));
    } else {
      setSelectedRows([...selectedRows, key]);
    }
  };
  return (
    <CCard {...props}>
      <CCardBody>
        <CTable
          striped={striped}
          bordered={bordered}
          hover={hover}
          responsive={responsive}
        >
          <CTableHead color="light">
            <CTableRow>
              {/* Cột chọn */}
              {selectable && (
                <CTableHeaderCell style={{ width: '50px' }}>
                  <CFormCheck
                    id="selectAll"
                    name="selectAll"
                    onChange={handleSelectAll}
                    checked={data.length > 0 && selectedRows.length === data.length}
                    indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                  />
                </CTableHeaderCell>
              )}

              {/* Các cột tiêu đề động */}
              {columns.map((column, index) => (
                <CTableHeaderCell key={index} style={column.style || {}}>
                  {column.header}
                </CTableHeaderCell>
              ))}

              {/* Cột hành động */}
              {actions.length > 0 && (
                <CTableHeaderCell style={{ width: actions.length * 70 + 'px' }} className="text-center">
                  Hành động
                </CTableHeaderCell>
              )}
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <CTableRow key={rowIndex}>
                  {/* Ô chọn */}
                  {selectable && (
                    <CTableDataCell>
                      <CFormCheck
                        id={`select-${getRowKey(item, rowIndex)}`}
                        name={`select-${getRowKey(item, rowIndex)}`}
                        checked={selectedRows.includes(getRowKey(item, rowIndex))}
                        onChange={() => handleSelectRow(item, rowIndex)}
                      />
                    </CTableDataCell>
                  )}

                  {/* Các ô dữ liệu động */}
                  {columns.map((column, colIndex) => (
                    <CTableDataCell key={colIndex}>
                      {column.render ? column.render(item, rowIndex) : item[column.field]}
                    </CTableDataCell>
                  ))}

                  {/* Ô hành động */}
                  {actions.length > 0 && (
                    <CTableDataCell>
                      <div className="d-flex gap-2 justify-content-center">
                        {actions.map((action, actionIndex) => (
                          <CButton
                            key={actionIndex}
                            color={typeof action.color === 'function' ? action.color(item) : action.color || "primary"}
                            onClick={() => action.onClick(item, rowIndex)}
                            // size="sm"
                            disabled={action.disabled ? action.disabled(item) : false}
                            className="fixed-action-btn"
                          >
                            {typeof action.label === 'function' ? action.label(item) : action.label}
                          </CButton>
                        ))}
                      </div>
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={columns.length + (selectable ? 2 : 1)}>
                  <div className="text-center py-4">Không có dữ liệu</div>
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default GenericTable;