import { Autocomplete, Button, Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useRef, useState } from 'react';
import { TextField, Box } from '@mui/material';
import { type Artist, type Artwork, type Base, type Donor, type Repository } from "../service/Utils";
import { CreateArtwork, CreateChunkArtwork, DeleteArtwork, getAllArtist, getAllArtwork, getAllDonor, getAllLocation, UpdateArtwork } from "../service/service";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { fullName } from "./Formatter";

export const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        await CreateChunkArtwork(file);
    }
};

export const defaultArtworkForm: Artwork = {
    base: {} as Base,
    catalog: "",
    title: '',
    medium: '',
    art_height: '',
    art_width: '',
    art_depth: '',
    year: '',
    cataloged: '',
    quantity: '',
    url: '',
}

export default function ArtworkTable() {

    const [allArt, setAllArt] = useState<Artwork[]>([])
    const [allArtist, setAllArtist] = useState<Artist[]>([])
    const [allLocation, setAllLocation] = useState<Repository[]>([])
    const [allDonor, setAllDonor] = useState<Donor[]>([])
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        getAllArtist()
            .then(res => {
                setAllArtist(res)
                console.log(res)
            })
            .catch(err => console.log(err))
        getAllLocation()
            .then(res => {
                setAllLocation(res)
                console.log(res)
            })
            .catch(err => console.log(err))
        getAllDonor()
            .then(res => {
                setAllDonor(res)
                console.log(res)
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        setUpdate(false)
        getAllArtwork()
            .then(res => {
                setAllArt(res)
                console.log(res)
            })
            .catch(err => console.log(err))
    }, [update])

    const DelArtwork = (id: string) => {
        DeleteArtwork(id)
        setUpdate(true)
    }

    function CreateForm() {
        const [values, setValues] = useState<Artwork>(defaultArtworkForm);
        const firstFieldRef = useRef<HTMLInputElement>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
        };

        const handleClear = () => {
            firstFieldRef.current?.focus();
            setValues(defaultArtworkForm)
        }

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            console.log(values);
            CreateArtwork(values)
            setUpdate(true)
            handleClear()
        };

        return (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={8}>
                        <TextField fullWidth label="Title" name="title" value={values.title} inputRef={firstFieldRef} onChange={handleChange} />
                    </Grid>
                    <Grid size={2}>
                        <TextField fullWidth label="Year Created" name="year" value={values.year} onChange={handleChange} />
                    </Grid>
                    <Grid size={2}>
                        <TextField fullWidth label="Year Cataloged" name="cataloged" value={values.cataloged} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <TextField fullWidth label="Medium" name="medium" value={values.medium} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <Autocomplete
                            fullWidth
                            options={allArtist}
                            getOptionLabel={(option) => fullName(option.first_name, option.last_name)} // must return string
                            value={values.artist}
                            onChange={(_, newValue) => setValues({ ...values, artist_id: newValue?.base?.id || undefined })}
                            renderInput={(params) => (
                                <TextField {...params} label="Artist" />
                            )}
                            isOptionEqualToValue={(option, value) => option.base?.id === value.base?.id}
                            renderOption={(props, option) => (
                                <li {...props} key={option.base?.id || `${option.first_name}-${option.last_name}`}>
                                    {fullName(option.first_name, option.last_name)}
                                </li>
                            )}
                        />
                    </Grid>
                    <Grid size={3}>
                        <TextField fullWidth label="Art Height (Inches)" name="art_height" value={values.art_height} onChange={handleChange} />
                    </Grid>
                    <Grid size={3}>
                        <TextField fullWidth label="Art Width (Inches)" name="art_width" value={values.art_width} onChange={handleChange} />
                    </Grid>
                    <Grid size={3}>
                        <TextField fullWidth label="Art Depth (Inches)" name="art_depth" value={values.art_depth} onChange={handleChange} />
                    </Grid>
                    <Grid size={3}>
                        <TextField fullWidth label="Quantity" name="quantity" value={values.quantity} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <Autocomplete
                            fullWidth
                            options={allDonor}
                            getOptionLabel={(option) => fullName(option.first_name, option.last_name, "Donor")} // must return string
                            value={values.donor}
                            onChange={(_, newValue) => setValues({ ...values, donor_id: newValue?.base?.id || undefined })}
                            renderInput={(params) => (
                                <TextField {...params} label="Donor" />
                            )}
                            isOptionEqualToValue={(option, value) => option.base?.id === value.base?.id}
                            renderOption={(props, option) => (
                                <li {...props} key={option.base?.id || `${option.first_name}-${option.last_name}`}>
                                    {fullName(option.first_name, option.last_name, 'Donor')}
                                </li>
                            )}
                        />
                    </Grid>
                    <Grid size={6}>
                        <Autocomplete
                            fullWidth
                            options={allLocation} // array of Artist objects
                            getOptionLabel={(option) => option.building_name || "No Repository"} // what displays in dropdown
                            value={values.repository}
                            onChange={(_, newValue) => setValues({ ...values, repository_id: newValue?.base?.id || undefined })}
                            renderInput={(params) => (
                                <TextField {...params} label="Repository" />
                            )}
                            isOptionEqualToValue={(option, value) => option.base?.id === value.base?.id} // important for object comparison
                            renderOption={(props, option) => (
                                <li {...props} key={option.base?.id || `${option.building_name}`}>
                                    {option.building_name}
                                </li>
                            )}
                        />
                    </Grid>
                    <Stack direction={'row'} justifyContent={"space-between"} spacing={2} width={'100%'}>
                        <Button variant="contained" component="label" style={{ alignSelf: 'flex-start', margin: '1rem' }}>
                            Upload File
                            <input type="file" accept=".csv" hidden onChange={handleFileChange} />
                        </Button>
                        <Stack direction={"row"} spacing={2}>
                            <Button style={{ alignSelf: 'center' }} variant="outlined" onClick={() => handleClear()}>Clear</Button>
                            <Button type="submit" style={{ alignSelf: 'center' }} variant="contained">Submit</Button>
                        </Stack>
                    </Stack>
                </Grid>
            </Box>
        );
    }

    function UpdateForm({ artwork, artworkId }: { artwork: Artwork; artworkId: string }) {
        const [values, setValues] = useState<Artwork>(artwork);
        const firstFieldRef = useRef<HTMLInputElement>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
        };

        const handleClear = () => {
            firstFieldRef.current?.focus();
            setValues(defaultArtworkForm)
        }

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            console.log(values);
            UpdateArtwork(values, artworkId)
            setUpdate(true)
            setOpen(-1)
            handleClear()
        };

        return (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={8}>
                        <TextField fullWidth label="Title" name="title" value={values.title} inputRef={firstFieldRef} onChange={handleChange} />
                    </Grid>
                    <Grid size={2}>
                        <TextField fullWidth label="Year Created" name="year" value={values.year} onChange={handleChange} />
                    </Grid>
                    <Grid size={2}>
                        <TextField fullWidth label="Year Cataloged" name="cataloged" value={values.cataloged} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <TextField fullWidth label="Medium" name="medium" value={values.medium} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <Autocomplete
                            fullWidth
                            options={allArtist} // array of Artist objects
                            getOptionLabel={(option) => fullName(option.first_name, option.last_name)} // what displays in dropdown
                            value={values.artist}
                            onChange={(_, newValue) => setValues({ ...values, artist_id: newValue?.base?.id || undefined })}
                            renderInput={(params) => (
                                <TextField {...params} label="Artist" />
                            )}
                            isOptionEqualToValue={(option, value) => option.base?.id === value.base?.id} // important for object comparison
                            renderOption={(props, option) => (
                                <li {...props} key={option.base?.id || `${option.first_name}-${option.last_name}`}>
                                    {fullName(option.first_name, option.last_name)}
                                </li>
                            )}
                        />
                    </Grid>
                    <Grid size={3}>
                        <TextField fullWidth label="Art Height (Inches)" name="art_height" value={values.art_height} onChange={handleChange} />
                    </Grid>
                    <Grid size={3}>
                        <TextField fullWidth label="Art Width (Inches)" name="art_width" value={values.art_width} onChange={handleChange} />
                    </Grid>
                    <Grid size={3}>
                        <TextField fullWidth label="Art Depth (Inches)" name="art_depth" value={values.art_depth} onChange={handleChange} />
                    </Grid>
                    <Grid size={3}>
                        <TextField fullWidth label="Quantity" name="quantity" value={values.quantity} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <Autocomplete
                            fullWidth
                            options={allDonor}
                            getOptionLabel={(option) => fullName(option.first_name, option.last_name, "Donor")} // must return string
                            value={values.donor}
                            onChange={(_, newValue) => setValues({ ...values, donor_id: newValue?.base?.id || undefined })}
                            renderInput={(params) => (
                                <TextField {...params} label="Donor" />
                            )}
                            isOptionEqualToValue={(option, value) => option.base?.id === value.base?.id}
                            renderOption={(props, option) => (
                                <li {...props} key={option.base?.id || `${option.first_name}-${option.last_name}`}>
                                    {fullName(option.first_name, option.last_name, "Donor")}
                                </li>
                            )}
                        />
                    </Grid>
                    <Grid size={6}>
                        <Autocomplete
                            fullWidth
                            options={allLocation} // array of Artist objects
                            getOptionLabel={(option) => option.building_name || "No Location"} // what displays in dropdown
                            value={values.repository}
                            onChange={(_, newValue) => setValues({ ...values, repository_id: newValue?.base?.id || undefined })}
                            renderInput={(params) => (
                                <TextField {...params} label="Repository" />
                            )}
                            isOptionEqualToValue={(option, value) => option.base?.id === value.base?.id} // important for object comparison
                            renderOption={(props, option) => (
                                <li {...props} key={option.base?.id || `${option.building_name}`}>
                                    {option.building_name}
                                </li>
                            )}
                        />
                    </Grid>
                    <Button variant="outlined" style={{alignSelf:'center'}} onClick={() => setOpen(-1)}>Cancel</Button>
                    <Button style={{ alignSelf: 'center' }} variant="contained" onClick={() => handleClear()}>Clear</Button>
                    <Button type="submit" style={{ alignSelf: 'center' }} variant="contained">Submit</Button>
                </Grid>
            </Box>
        );
    }

    const editRowRef = useRef<HTMLTableRowElement>(null);
    const [open, setOpen] = useState(-1)

    const openScroll = (id: number) => {
        setOpen(prev => (prev === -1 ? id : -1))
        setTimeout(() => {
            editRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
    }

    return (
        <Stack style={{ alignItems: 'center', padding: '0rem 8rem' }}>
            <h1>Mason Exhibitions Artwork</h1>
            <Stack width={"100%"}>
                <CreateForm />
            </Stack>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Catalog #</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Medium</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell>Cataloged</TableCell>
                        <TableCell>Height</TableCell>
                        <TableCell>Width</TableCell>
                        <TableCell>Depth</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Artist</TableCell>
                        <TableCell>Artist</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allArt.map((row, index) => (
                        <React.Fragment key={row.base?.id}>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{row.catalog}</TableCell>
                                <TableCell component="th" scope="row">
                                    {row.title}
                                </TableCell>
                                <TableCell>{row.medium}</TableCell>
                                <TableCell>{row.year}</TableCell>
                                <TableCell>{row.cataloged}</TableCell>
                                <TableCell>{row.art_height}</TableCell>
                                <TableCell>{row.art_width}</TableCell>
                                <TableCell>{row.art_depth}</TableCell>
                                <TableCell>{row.quantity}</TableCell>
                                <TableCell>{fullName(row.artist?.first_name, row.artist?.last_name)}</TableCell>
                                <TableCell>{fullName(row.donor?.first_name, row.donor?.last_name, "Donor")}</TableCell>
                                <TableCell>{row.repository?.building_name || "No Repository"}</TableCell>
                                <TableCell align="right"><IconButton onClick={() => openScroll(index)}><EditIcon /></IconButton><IconButton onClick={() => DelArtwork(String(row.base?.id) || "")}><DeleteIcon /></IconButton></TableCell>
                            </TableRow>
                            {open === index && (
                                <TableRow ref={editRowRef}>
                                    <TableCell colSpan={12}>
                                        <UpdateForm artwork={row} artworkId={String(row.base?.id) || ""} />
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </Stack >
    )
}