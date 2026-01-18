import { Button, Grid, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useRef, useState } from 'react';
import { TextField, Box } from '@mui/material';
import { type Base, type Repository } from "../service/Utils";
import { CreateLocation, DeleteLocation, getAllLocation, UpdateLocation } from "../service/service";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const defaultLocationForm: Repository = {
    base: {} as Base,
    building_name: "",
    room_number: "",
    campus: "",
    details: ""
}

export default function LocationTable() {
    const [allLocation, setAllLocation] = useState<Repository[]>([])
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        setUpdate(false)
        getAllLocation()
            .then(res => {
                setAllLocation(res)
                console.log(res)
            })
            .catch(err => console.log(err))
    }, [update])

    const DelLocation = (id: string) => {
        DeleteLocation(id)
        setUpdate(true)
    }

    function CreateForm() {
        const [values, setValues] = useState<Repository>(defaultLocationForm);
        const firstFieldRef = useRef<HTMLInputElement>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
        };

        const handleClear = () => {
            firstFieldRef.current?.focus();
            setValues(defaultLocationForm)
        }

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            console.log(values);
            CreateLocation(values)
            setUpdate(true)
            handleClear()

        };

        return (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={5}>
                        <TextField fullWidth label="Buidling Name" name="building_name" value={values.building_name} inputRef={firstFieldRef} onChange={handleChange} required />
                    </Grid>
                    <Grid size={2}>
                        <TextField fullWidth label="Room Number" name="room_number" value={values.room_number} inputRef={firstFieldRef} onChange={handleChange} required />
                    </Grid>
                    <Grid size={5}>
                        <TextField fullWidth label="Campus" name="campus" value={values.campus} onChange={handleChange} required />
                    </Grid>
                    <TextField fullWidth label="Details" name="details" value={values.details} onChange={handleChange} required />
                    <Stack direction={'row'} width={"100%"} spacing={2} justifyContent={'flex-end'}>
                        <Button variant="outlined" onClick={() => handleClear()}>Clear</Button>
                        <Button type="submit" variant="contained">Submit</Button>
                    </Stack>
                </Grid>
            </Box>
        );
    }
    function UpdateForm({ repository, repositoryId }: { repository: Repository; repositoryId: string }) {
        const [values, setValues] = useState<Repository>(repository);
        const firstFieldRef = useRef<HTMLInputElement>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues({ ...values, [e.target.name]: e.target.value });
        };

        const handleClear = () => {
            firstFieldRef.current?.focus();
            setValues(defaultLocationForm)
        }

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            console.log(values);
            UpdateLocation(values, repositoryId)
            setUpdate(true)
            setOpen(-1)
            handleClear()
        };
        return (
            <Grid width={"100%"} container spacing={2} component="form" onSubmit={handleSubmit}>
                <Grid size={6}>
                    <TextField required fullWidth label="Building Name" name="building_name" value={values.building_name} inputRef={firstFieldRef} onChange={handleChange} />
                </Grid>
                <Grid size={6}>
                    <TextField required fullWidth label="Campus" name="campus" value={values.campus} onChange={handleChange} />
                </Grid>
                <TextField required multiline maxRows={4} fullWidth label="Details" name="details" value={values.details} onChange={handleChange} />
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
            <h1>Mason Exhibitions Installations</h1>
            <Stack width={"100%"}>
                <CreateForm />
            </Stack>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Building Name</TableCell>
                        <TableCell>Campus</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allLocation.map((row, index) => (
                        <React.Fragment key={index}>
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.building_name}
                                </TableCell>
                                <TableCell>{row.campus}</TableCell>
                                <TableCell>{row.details}</TableCell>
                                <TableCell align="right"><IconButton onClick={() => openScroll(index)}><EditIcon /></IconButton><IconButton onClick={() => DelLocation(String(row.base?.id) || "")}><DeleteIcon /></IconButton></TableCell>
                            </TableRow>
                            {open === index && (
                                <TableRow ref={editRowRef}>
                                    <TableCell colSpan={12}>
                                        <Stack direction={'row-reverse'} alignItems={'flex-start'}>
                                            <Button variant="outlined" style={{ margin: '1rem', aspectRatio: '1/1' }} size="large" onClick={() => setOpen(-1)}>Cancel</Button>
                                            <UpdateForm repository={row} repositoryId={String(row.base?.id) || ""} />

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