import { Button, Card, CardContent, Grid, IconButton, InputAdornment, Select, Stack, TextField, Typography } from "@mui/material";
import { getAllArtwork } from "../service/service";
import { useEffect, useState } from "react";
import type { Artwork } from "../service/Utils";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { artistDates, donorAuto, fullName, sizingAuto, unknownYear } from "./Formatter";

export function downloadLabelsCSV(filteredArt: Artwork[]) {
    const rows = filteredArt.map(a => {
        const artist = fullName(a.artist?.first_name, a.artist?.last_name)
        const title = (a.title?.trim() || "Untitled").replace(/"/g, '""')
        const catalog = a.catalog?.trim() || a.base?.id;
        const label = `${artist} - "${title}" - ${catalog}`;
        return `"${label.replace(/"/g, '""')}"`; // CSV-escape whole field
    });

    const csv = "Label\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "art-labels.csv"; a.click();
    URL.revokeObjectURL(url);
}

export default function Exports() {
    // const [allArtist, setAllArtist] = useState<Artist[]>([])
    const [allArtwork, setAllArtwork] = useState<Artwork[]>([])
    const [count, setCount] = useState(0)

    useEffect(() => {
        // getAllArtist()
        //     .then(res => {
        //         setAllArtist(res)
        //         console.log(res)
        //     })
        //     .catch(err => console.log(err))
        getAllArtwork()
            .then(res => {
                setAllArtwork(res)
                setFilteredArt(res)
                setCount(res.length)
                console.log(res)
            }
            )
            .catch(err => console.log(err))
    }, [])

    const [filterType, setFilterType] = useState("Artist")
    const [filteredArt, setFilteredArt] = useState(allArtwork)
    const filterArtwork = (text: string) => {
        console.log(filterType)
        if (filterType === "Artwork") {
            setFilteredArt(allArtwork.filter(art =>
                art.title.toLowerCase().includes(text.toLowerCase())
            ))
        } else if (filterType === "Artist") {
            setFilteredArt(allArtwork.filter(art => {
                const fullArtist = String(fullName(art.artist?.first_name, art.artist?.last_name))
                console.log(typeof (fullArtist))
                return fullArtist.toLowerCase().includes(text.toLowerCase())
            }))
        } else {
            if (filterType === "Location") {
                setFilteredArt(allArtwork.filter(art => {
                    const building = art.repository?.building_name || ""
                    return building.toLowerCase().includes(text.toLowerCase())
                }
                ))
            }
        }
        setCount(filteredArt.length)
    };
// ${art.quantity && art.quantity !== "" ? `${art.quantity} <br/>` : ""}

    const textChunk = filteredArt.map(art => `
  <b>${fullName(art.artist?.first_name, art.artist?.last_name)}${artistDates(art.artist?.birth_year, art.artist?.death_year)}</b><br/>
  <i>${art.title}</i>${unknownYear(art.year)}<br/>
  ${art.medium}<br/>
  ${sizingAuto({ height: art.art_height, width: art.art_width, depth: art.art_depth, inches: true })}
  ${donorAuto({ first_name: art.donor?.first_name, last_name: art.donor?.last_name })}
  ${art.catalog || "No Number"}
`);

    const textChunksBios = filteredArt.map(art => `
        <b>${fullName(art.artist?.first_name, art.artist?.last_name) + artistDates(art.artist?.birth_year, art.artist?.death_year)}</b><br/>
        <i>${art.title}</i>${unknownYear(art.year)}<br/>
        ${art.medium} <br/>
        ${sizingAuto({ height: art.art_height, width: art.art_width, depth: art.art_depth, inches: true })}
        ${art.catalog || "No Number"} <br/>
        <br/>
        ${art.artist?.bio || "No Artist Bio"}
        `);

    const ExportPDFLabels = ({ textChunks = textChunk }: { textChunks?: string[] } = {}) => {
        const rows = [];
        for (let i = 0; i < textChunks.length; i += 2) {
            const left = textChunks[i] || '';
            const right = textChunks[i + 1] || '';
            rows.push(`
      <tr>
        <td class="label">${left}</td>
        <td class="gap"></td>
        <td class="label">${right}</td>
      </tr>
    `);
        }

        const html = `
<html>
<head>
  <title>Labels</title>
  <style>
    @page {
      size: 8.5in 11in;
      margin: 0.5in 0.16in 0in 0.16in;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      font-size: 12pt;
    }
    table.label-sheet {
      width: 100%;
      border-collapse: separate; /* or remove entirely */
    }
    td.label {
      width: 4in;
      height: 2in;
      padding: 0.2in;
      vertical-align: top;
      box-sizing: border-box;
      border: none; /* removed */
    }
    td.gap {
      width: 0.19in;
    }
  </style>
</head>
    <body>
      <table class="label-sheet">
        ${rows.join('')}
      </table>
      <script>
        window.onload = () => window.print();
      </script>
    </body>
    </html>
  `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
        }
    };

    // const csvRowsBios = textChunksBios.map(label => `"${label.replace(/"/g, '""')}"`);
    // const csvContentBios = csvRowsBios.join('\n');

    // const ExportCSVBios = () => {
    //     const blob = new Blob([csvContentBios], { type: 'text/csv' });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'labelsBios.csv';
    //     a.click();
    //     URL.revokeObjectURL(url);
    // }

    const [bios] = useState(false)
    const [open] = useState(false)

    // const copyLabel = (label: string) => {
    //     console.log(label)
    //     navigator.clipboard.writeText(label);
    // }

    const copySingleHtml = async (htmlChunk: string) => {
        const plain = htmlChunk.replace(/<[^>]+>/g, '');

        await navigator.clipboard.write([
            new ClipboardItem({
                'text/plain': new Blob([plain], { type: 'text/plain' }),
                'text/html': new Blob([htmlChunk], { type: 'text/html' }),
            }),
        ]);
    };

    const popArtwork = () => {
        setFilterType("Artwork")
    }

    const popArtist = () => {
        setFilterType("Artist")
    }

    const popLocation = () => {
        setFilterType("Location")
    }

    function MenuPopupState() {
        return (
            <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                    <React.Fragment>
                        <IconButton style={{ padding: '1rem', border: '0.1rem solid lightgray', margin: '0' }} {...bindTrigger(popupState)}>
                            <FilterListIcon />
                        </IconButton>
                        <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={() => { popArtwork(); popupState.close(); }}>Artwork</MenuItem>
                            <MenuItem onClick={() => { popArtist(); popupState.close(); }}>Artist</MenuItem>
                            <MenuItem onClick={() => { popLocation(); popupState.close(); }}>Installation</MenuItem>
                        </Menu>
                    </React.Fragment>
                )}
            </PopupState>
        );
    }

    const data = !bios ? textChunk : textChunksBios;

    return (
        <Stack>
            <Stack direction={'row'} width={"100%"} justifyContent={"flex-start"} alignContent={'center'} alignItems={'center'} spacing={2} padding={'1rem'}>
                <TextField onChange={(e) => filterArtwork(e.target.value)} fullWidth style={{ alignSelf: 'center', margin: '0 1rem' }} type="search" label={`Filter Labels by ${filterType}`} slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}>
                    SearchBar
                </TextField>
                <MenuPopupState />
                {/* <FormControlLabel style={{ alignSelf: 'flex-end', margin: 'auto', textWrap: 'nowrap' }} control={
                    <Switch
                        checked={bios}
                        onChange={() => setBios(!bios)}
                    />
                } label="Add Artist Bios?" /> */}
                {/* <Button variant="outlined" onClick={() => ExportPDFLabels({textChunks: textChunksBios})}>
                    Export Labels with Bios
                </Button> */}
                <Button variant="outlined" onClick={() => downloadLabelsCSV(filteredArt)}>
                    Export Catalog Labels
                </Button>
                <Button variant="contained" onClick={() => ExportPDFLabels()}>
                    Export Wall Labels
                </Button>

            </Stack>
            <CardContent>
                <Typography>
                    Count: {count}
                </Typography>
            </CardContent>
            {open &&
                <Stack direction={'row'} spacing={2} width={"100%"}>
                    <Select />
                    <TextField />
                </Stack>
            }
            <Grid container spacing={2}>
                {data.map((art, index) => (
                    <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={index} width={"100%"}>
                        <Card>
                            <CardContent style={{ textWrap: 'wrap', padding: '16px' }}>
                                <div dangerouslySetInnerHTML={{ __html: art }} />
                                <Stack direction={"row"} justifyContent={'space-between'} sx={{ pt: '.4rem' }}>
                                    <Button onClick={() => copySingleHtml(art)}>
                                        Copy
                                    </Button>
                                    <Button onClick={() => copySingleHtml(art)}>
                                        View
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    )
}
