import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Divider, Grid, Box, TextField, Button, Alert, AlertTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LABELS } from '../constants';
const config = require('../config.json');

export default function TractPage() {
    const { tract_id } = useParams();
    const [tempTract, setTempTract] = useState([]);
    const [showTract, setShowTract] = useState(false);
    const [foundFlag, setFoundFlag] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/tract_page/${tract_id}`)
        .then(res => res.json())
        .then(resJson => {
            if (resJson.length === undefined) {
                // if resJson == 0 at this point, we did not find tract.
                setFoundFlag(0);
                setData([]);
                setShowTract(false);
            }
            else {
                setFoundFlag(1);
                resJson.forEach(row => {
                    // map the label to its full text for use in the table
                    // this is brutally inefficient but works :)
                    Object.entries(LABELS).forEach((entry) => {
                        const [key, value] = entry;
                        if (value.label === row.Variable) {
                            row.Variable = key
                        }
                    })
                })
                setData(resJson);
                setShowTract(true);
            }
            })
      }, [tract_id, tempTract])

    const handleSubmit = (event) => {
        event.preventDefault();
        window.location.href = `../tract_info_page/${tempTract}`
    }

    const handleTractChange = (event) => {
        setTempTract(event.target.value);  
    };

    const columns = [
        {field: 'Variable', headerName: 'Variable', flex:2.5},
        {field: 'Category', headerName: 'Category', flex:0.7},
        {field: 'Domain', headerName: 'Domain', flex:0.9},
        {field: 'Tract Value', headerName: 'Tract', flex:0.4},
        {field: 'County Average', headerName: 'County Avg', flex:0.5},
        {field: 'State Average', headerName: 'State Avg', flex:0.4},
    ]

    return(
        <Container sx={{padding:'10px 0px 80px'}}>
            <h1>Available data about tract</h1>
            {showTract && <h1>{tract_id}</h1>}
            <p>Here you will find all the available data related to a specific tract. You will also find columns showing 
                aggregated information on the same variable at the County and State level for comparison purposes. </p>
            <Divider/>

            <form onSubmit={handleSubmit} style={{ padding: '20px 0px 20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    <Grid item xs={3}>
                        <Container sx={{ margin: '10px' }}>
                            <TextField inputProps={{ type: "number" }}
                                style={{ padding: '0px 10px 0px 0px' }}
                                id="tract"
                                label="Tract Number"
                                variant="outlined"
                                value={tempTract}
                                onChange={handleTractChange}
                                required />
                        </Container>
                    </Grid>
                </Box>
                <div style={{ textAlign: 'center' }}>
                    <Button variant="contained" type="submit">Submit</Button>
                </div>
            </form>
            {foundFlag === 0 &&
                <div style={{ padding: '5px 0px 5px' }}>
                    <Alert severity="error">
                        <AlertTitle>Unable to find tract</AlertTitle>
                        There is no tract matching your input. Please try again.
                    </Alert>
                </div>}
            {foundFlag === 1 &&
                <Container>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        autoHeight = {true}
                        columnBuffer={6}
                        getRowId={(row) => row.Variable}
                    />
                </Container>
            }
        </Container>
    )
}