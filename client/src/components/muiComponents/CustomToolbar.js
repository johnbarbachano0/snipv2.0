import React from "react";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  gridClasses,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";

function CustomToolbar({ onSelectedDel, disabled, role }) {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
      <GridToolbarColumnsButton
        sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
      />
      <GridToolbarFilterButton
        sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
      />
      <GridToolbarDensitySelector sx={{ marginRight: 2 }} />
      {role === "Admin" && (
        <Button
          size="small"
          onClick={() => onSelectedDel()}
          disabled={disabled}
        >
          <DeleteSweepRoundedIcon sx={{ fontSize: 20, marginRight: 1 }} />
          Delete Selected
        </Button>
      )}
    </GridToolbarContainer>
  );
}

export default CustomToolbar;
