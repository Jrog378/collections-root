import { Box, Stack, Tab, Tabs } from "@mui/material";
import React from "react";
import { CustomTabPanel } from "./CustomTabPanel";
import ArtworkTable from "./ArtworkTable";
import ArtistTable from "./ArtistTable";
import Exports from "./Exports";
import LocationTable from "./LocationTable";
import DonorTable from "./DonorTable";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Index() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack sx={{ borderBottom: 1, borderColor: 'divider', justifyContent:'space-around' }} direction={'row'}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Artwork" {...a11yProps(0)} />
          <Tab label="Artists" {...a11yProps(1)} />
          <Tab label="Donors" {...a11yProps(2)} />
          <Tab label="Installations" {...a11yProps(3)} />
          <Tab label="Label Export" {...a11yProps(4)} />
        </Tabs>
      </Stack>
      <CustomTabPanel value={value} index={0}>
        <ArtworkTable/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ArtistTable/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DonorTable/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <LocationTable/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Exports/>
      </CustomTabPanel>
    </Box>
  );
}