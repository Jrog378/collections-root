import { Button, Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useRef, useState } from 'react';
import { TextField, Box } from '@mui/material';
import { type Donor, type Base } from "../service/Utils";
import {CreateDonor, DeleteDonor, getAllDonor, UpdateDonor } from "../service/service";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const defaultDonorForm: Donor = {
    base: {} as Base,
    first_name: "",
    last_name: "",
    birth_year: "",
    death_year: "",
    bio: "",
    id: ""
}

export default function DonorTable() {
    const [allDonor, setAllDonor] = useState<Donor[]>([])
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        setUpdate(false)
        getAllDonor()
            .then(res => {
                setAllDonor(res)
                console.log(res)
            })
            .catch(err => console.log(err))
    }, [update])

    const DelDonor = (id: string) => {
        DeleteDonor(id)
        setUpdate(true)
    }

    function CreateForm() {
        const [values, setValues] = useState<Donor>(defaultDonorForm);
        const firstFieldRef = useRef<HTMLInputElement>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
        };

        const handleClear = () => {
            firstFieldRef.current?.focus();
            setValues(defaultDonorForm)
        }

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            console.log(values);
            CreateDonor(values)
            setUpdate(true)
            handleClear()
        };

        return (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <TextField fullWidth label="First Name" name="first_name" value={values.first_name} inputRef={firstFieldRef} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <TextField fullWidth label="Last Name" name="last_name" value={values.last_name} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <TextField fullWidth label="Birth Year" name="birth_year" value={values.birth_year} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <TextField fullWidth label="Death Year" name="death_year" value={values.death_year} onChange={handleChange} />
                    </Grid>
                    <TextField multiline maxRows={4} fullWidth label="Short Biography" name="bio" value={values.bio} onChange={handleChange} />
                    <Stack width={'100%'} direction={'row'} spacing={2} justifyContent={'flex-end'}>
                        <Button style={{ alignSelf: 'center' }} variant="outlined" onClick={() => handleClear()}>Clear</Button>
                        <Button type="submit" style={{ alignSelf: 'center' }} variant="contained">Submit</Button>
                    </Stack>
                </Grid>
            </Box>
        );
    }
    function UpdateForm({ donor, donorId }: { donor: Donor; donorId: string }) {
        const [values, setValues] = useState<Donor>(donor);
        const firstFieldRef = useRef<HTMLInputElement>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
        };

        const handleClear = () => {
            firstFieldRef.current?.focus();
            setValues(defaultDonorForm)
        }

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            console.log(values);
            UpdateDonor(values, donorId)
            setUpdate(true)
            setOpen(-1)
            handleClear()
        };

        return (
            <Grid width={"100%"} container spacing={2} component="form" onSubmit={handleSubmit}>
                <Grid size={6}>
                    <TextField fullWidth label="First Name" name="first_name" value={values.first_name} inputRef={firstFieldRef} onChange={handleChange} />
                </Grid>
                <Grid size={6}>
                    <TextField fullWidth label="Last Name" name="last_name" value={values.last_name} onChange={handleChange} />
                </Grid>
                <Grid size={6}>
                    <TextField fullWidth label="Birth Year" name="birth_year" value={values.birth_year || ""} onChange={handleChange} />
                </Grid>
                <Grid size={6}>
                    <TextField fullWidth label="Death Year" name="death_year" value={values.death_year || ""} onChange={handleChange} />
                </Grid>
                <TextField multiline maxRows={4} fullWidth label="Biography" name="bio" value={values.bio} onChange={handleChange} />
                <Button type="submit" style={{ alignSelf: 'center' }} variant="contained">Submit</Button>
            </Grid>
        );
    }
    const editRowRef = useRef<HTMLTableRowElement>(null);
    const [open, setOpen] = useState(-1)
    const openScroll = (id: number) => {
        setOpen(id)
        setTimeout(() => {
            editRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
    }

    return (
        <Stack style={{ alignItems: 'center', padding: '0rem 8rem' }}>
            <h1>Mason Exhibitions Donors</h1>
            <Stack width={"100%"}>
                <CreateForm />
            </Stack>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Birth Year</TableCell>
                        <TableCell>Death Year</TableCell>
                        <TableCell>Short Biography</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allDonor.map((row, index) => (
                        <React.Fragment key={index}>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.first_name}
                                </TableCell>
                                <TableCell>{row.last_name}</TableCell>
                                <TableCell>{row.birth_year}</TableCell>
                                <TableCell>{row.death_year}</TableCell>
                                <TableCell>{row.bio}</TableCell>
                                <TableCell align="right"><IconButton onClick={() => openScroll(index)}><EditIcon /></IconButton><IconButton onClick={() => DelDonor(String(row.base?.id) || "")}><DeleteIcon /></IconButton></TableCell>
                            </TableRow>
                            {open === index && (
                                <TableRow ref={editRowRef}>
                                    <TableCell colSpan={12}>
                                        <Stack direction={'row-reverse'} alignItems={'flex-start'}>
                                            <Button variant="text" style={{ margin: '1rem', aspectRatio: '1/1' }} size="large" onClick={() => setOpen(-1)}>Cancel</Button>
                                            <UpdateForm donor={row} donorId={String(row.base?.id) || ""} />
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </Stack>
    )
}