import { useState, useEffect, forwardRef, useCallback } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Dialog, Checkbox, TextField, DialogTitle, DialogActions, DialogContent, FormControlLabel, DialogContentText, Grid } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import useApiService from 'src/services/api_services';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';


// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => (
    <Slide direction="left" ref={ref} {...props} />
));

export default function RolePage() {

    const router = useRouter();

    const { showSnackbar } = useSnackbar();

    const { createRole, getRoles } = useApiService();

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [role, setRole] = useState({ "id": 0, "code": "", "description": "", "name": "", "active": false });
    const [roleData, setRoleData] = useState([]);

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [load, setLoad] = useState(true);

    const [errors, setError] = useState({})



    const getUserRoles = useCallback(async () => {
        const response = await getRoles();
        setRoleData(response);
        setLoad(false);
    }, [getRoles]);


    useEffect(() => {
        if (load) {
            getUserRoles();
        }
    }, [load, getUserRoles])

    const handleClickOpen = () => {
        setOpen(true);
        setError('');
    };

    const handleClose = () => {
        setOpen(false);
        setEdit(false);
        setRole({ "id": 0, "code": "", "description": "", "name": "", "active": false });
    };


    const saveRole = async () => {
        const response = await createRole(role);
        if (response.status === "OK") {
            showSnackbar(response.message, 'success');
            getUserRoles();
        } else {
            showSnackbar(response.message, 'warning');
        }
    }

    const updateRole = async () => {
        const response = await createRole(role);
        if (response.status === "OK") {
            showSnackbar(response.message, 'success');
            getUserRoles();
        } else {
            showSnackbar(response.message, 'warning');
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRole((prevState) => ({
            ...prevState,
            [name]: value
        }));
        if (name === 'name' || name === 'code' || name === 'description') {
            if (!value) {
                setError((prevErrors) => ({
                    ...prevErrors,
                    [name]: 'This field is required'
                }))
            } else {
                setError((prevErrors) => ({
                    ...prevErrors,
                    [name]: ""
                }))

            }
        }

    };

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = roleData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleEdit = (row) => {
        setEdit(true);
        setRole({ "id": row.id, "name": row.name, "code": row.code, "description": row.description, "active": row.active });
        setOpen(true);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const dataFiltered = applyFilter({
        inputData: roleData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Container maxWidth="xxl">
            <Card>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0} paddingLeft={2} paddingRight={2} paddingTop={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between"
                        onClick={() => { router.back() }}
                        sx={{
                            color: "#f79520",
                            "&:hover": {
                                color: 'blue',
                                cursor: "pointer",
                            }
                        }}>
                        <KeyboardArrowLeftIcon />
                        <Typography variant="h6">Roles</Typography>
                    </Stack>

                    <Button variant="contained" color="inherit" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
                        New
                    </Button>
                    <Dialog
                        onBackdropClick={false}
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Transition}
                        fullWidth
                        maxWidth="xs"
                        keepMounted
                        PaperProps={{
                            component: 'form',
                            onSubmit: (event) => {
                                event.preventDefault();
                                if (edit) {
                                    updateRole();
                                } else {
                                    saveRole();
                                }
                                handleClose();
                            },
                        }}
                    >
                        <DialogTitle color='#f79520' >{edit ? 'Update Role' : 'Create Role'}</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2}>
                                <DialogContentText>
                                    Create role to controll user
                                </DialogContentText>
                                <TextField
                                    //    error={nameError && setNameError.length ? true : false}
                                    autoFocus
                                    // required
                                    margin="dense"
                                    id="name"
                                    onChange={handleChange}
                                    onBlur={handleChange}
                                    name="name"
                                    value={role.name}
                                    label={
                                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                                            <Iconify sx={{ marginRight: '4px' }} icon="hugeicons:course" width="1.2rem" height="1.2rem" />
                                            <div> Name *</div>
                                        </Grid>}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.name}
                                    error={Boolean(errors.name)}
                                />
                                <TextField
                                    autoFocus
                                    // required
                                    margin="dense"
                                    id="code"
                                    onChange={handleChange}
                                    onBlur={handleChange}
                                    name="code"
                                    inputProps={{ style: { textTransform: "uppercase" } }}
                                    value={role.code}
                                    disabled={edit}
                                    label={
                                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                                            <Iconify sx={{ marginRight: '4px' }} icon="gravity-ui:folder-code" width="1.2rem" height="1.2rem" />
                                            <div> Code *</div>
                                        </Grid>}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.code}
                                    error={Boolean(errors.code)}
                                />

                                <TextField
                                    margin="dense"
                                    id="description"
                                    maxRows={5}
                                    minRows={3}
                                    value={role.description}
                                    multiline
                                    onChange={handleChange}
                                    onBlur={handleChange}
                                    name="description"
                                    label={
                                        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                                            <Iconify sx={{ marginRight: '4px' }} icon="material-symbols-light:description-rounded" width="1.2rem" height="1.2rem" />
                                            <div> Description *</div>
                                        </Grid>}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    helperText={errors.description}
                                    error={Boolean(errors.description)}
                                />
                                {edit ?
                                    <FormControlLabel control={<Checkbox
                                        defaultChecked={role.active}
                                        onChange={(event, value) => {
                                            setRole((prevState) => ({
                                                ...prevState,
                                                'active': value
                                            }));
                                        }} name="active" id="active" />}
                                        label="Status (Active/Inactive)"
                                    />
                                    : null}
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">Cancel</Button>
                            <Button type="submit" color='primary'>{edit ? 'Update' : 'Create'}</Button>
                        </DialogActions>
                    </Dialog>
                </Stack>
                <UserTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <UserTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={roleData.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: '', label: 'S.no' },
                                    { id: 'name', label: 'name' },
                                    { id: 'code', label: 'Code' },
                                    { id: 'description', label: 'Description' },
                                    { id: 'status', label: 'Status', align: 'center' },
                                    { id: '', label: 'Action', align: 'center' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const key = row.id ? `${row.id}` : `${index}`;
                                        return (
                                            <UserTableRow
                                                key={key}  
                                                sno={index + 1}
                                                name={row.name}
                                                code={row.code}
                                                description={row.description}
                                                status={row.active}
                                                selected={selected.indexOf(row.name) !== -1}
                                                handleClick={(event) => handleClick(event, row.name)}
                                                handleEdit={() => handleEdit(row)}
                                            />
                                        );
                                    })}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, roleData.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={roleData.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
