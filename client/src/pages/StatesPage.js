import { useState } from 'react';
import { Container, MenuItem, Select, TextField, InputAdornment, Button, Alert, AlertTitle, Divider } from '@mui/material';
import { HEALTHOUTCOMES } from '../constants';
import { Box } from '@mui/system';
import StatesCards from '../components/StatesCards';
const config = require('../config.json');

export default function StatesPage() {
    const [tempHealthOutcome, setTempHealthOutcome] = useState('All teeth lost among adults');
    const [healthOutcome, setHealthOutcome] = useState('');
    const [tempAvgPrevalence, setTempAvgPrevalence] = useState([]);
    const [avgPrevalence, setAvgPrevalence] = useState([]);
    const [tempPercentage, setTempPercentage] = useState([]);
    const [percentage, setPercentage] = useState([]);
    const [tempMoreLess, setTempMoreLess] = useState(['>']);
    const [moreLess, setMoreLess] = useState([]);
    const [tempAboveBelow, setTempAboveBelow] = useState(['<']);
    const [aboveBelow, setAboveBelow] = useState([]);
    
    const [foundFlag, setFoundFlag] = useState('');
    const [data, setData] = useState([]);
    const [showMe, setShowMe] = useState(false);
    const count = data.length;

    const handleSubmit = (event) => {
        event.preventDefault();
    fetch(`http://${config.server_host}:${config.server_port}/states/${tempHealthOutcome}/${tempAvgPrevalence}/${tempPercentage}/${tempMoreLess}/${tempAboveBelow}`)
    .then(res => res.json())
    .then(resJson => {
        if (resJson.length === undefined) {
            // if resJson == 0 at this point, we did not find states.
            setFoundFlag(0);
            setData([]);
        }
        else {
            setFoundFlag(1);
            setData(resJson);
            setShowMe(true);
            setHealthOutcome(tempHealthOutcome);
            setAvgPrevalence(tempAvgPrevalence);
            setPercentage(tempPercentage);
            setMoreLess(tempMoreLess);
            setAboveBelow(tempAboveBelow);
        }
        })
    }

    const handleHealthOutcomeChange = (event) => {
        setTempHealthOutcome(event.target.value);
    };

    const handleAvgPrevalenceChange = (event) => {
        setTempAvgPrevalence(event.target.value);
    };

    const handlePercentageChange = (event) => {
        setTempPercentage(event.target.value);
    };

    const handleMoreLessChange = (event) => {
        setTempMoreLess(event.target.value);
    };

    const handleAboveBelowChange = (event) => {
        setTempAboveBelow(event.target.value);
    };

    return (
        <Container sx={{ padding: '10px 0px 80px' }}>
            <h1>Get States</h1>
            <p>Complete the sentence to discover the states that meet the established parameters. </p>
            <Divider />

            <form onSubmit={handleSubmit} style={{ padding: '20px 0px 20px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    
                    <h2>
                        <Select sx={{ m: 1, minWidth: 130 }}
                            id="moreLess"
                            name="moreLess"
                            label="More or Less"
                            value={tempMoreLess}
                            onChange={handleMoreLessChange}
                            variant="filled"
                            size="small"
                            autoWidth
                            required>
                            <MenuItem value={'>'}>More</MenuItem>
                            <MenuItem value={'<'}>Less</MenuItem>
                        </Select> 
                        
                        than a

                        <TextField sx={{ m: 1, minWidth: 130 }}
                            inputProps={{ min: 0, max: 100, type: "number" }}
                            style={{ padding: '0px 10px 0px 0px' }}
                            id="percentage"
                            label="Percentage"
                            name="percentage"
                            value={tempPercentage}
                            variant="filled"
                            size="small"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            onChange={handlePercentageChange}
                            required />
                            
                            of the Counties within the {count} States shown here have 
   
                        <Select sx={{ m: 1, minWidth: 130 }}
                            id="aboveBelow"
                            name="aboveBelow"
                            label="Above or Below"
                            value={tempAboveBelow}
                            onChange={handleAboveBelowChange}
                            variant="filled"
                            size="small"
                            autoWidth
                            required>
                            <MenuItem value={'>'}>above</MenuItem>
                            <MenuItem value={'<'}>below</MenuItem>
                        </Select> 

                        <TextField sx={{ m: 1, minWidth: 130 }} 
                                inputProps={{ min: 0, max: 100, type: "number" }}
                                style={{ padding: '0px 10px 0px 0px' }}
                                id="avgPrevalence"
                                label="Average"
                                value={tempAvgPrevalence}
                                variant="filled"
                                size="small"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                onChange={handleAvgPrevalenceChange}
                                required />
                        
                        prevalence of&nbsp;
                    
                        <Select sx={{ m: 1, minWidth: 130 }} 
                            labelId="healthOutcome-label"
                            id="healthOutcome"
                            name="healthOutcome"
                            label="healthOutcome"
                            value={tempHealthOutcome}
                            onChange={handleHealthOutcomeChange}
                            variant="filled"
                            size="small"
                            autoWidth
                            required>
                            {Object.keys(HEALTHOUTCOMES).map((labelKey) => (
                                <MenuItem key={labelKey} value={labelKey}>
                                    {labelKey}
                                </MenuItem>
                            ))}
                        </Select> 

                        &nbsp;in each of them.</h2>
                </Box>
                <div style={{ textAlign: 'center' }}>
                    <Button variant="contained" type="submit">Submit</Button>
                </div>
            </form>
            {foundFlag === 0 &&
                <div style={{ padding: '5px 0px 5px' }}>
                    <Alert severity="error">
                        <AlertTitle>Unable to find States</AlertTitle>
                        There are no States matching your parameters. Please try again.
                    </Alert>
                </div>}
            {foundFlag === 1 &&
                <Container>
                    <Divider />
                    {showMe && <h3>States found: {count}</h3>}
                    <StatesCards data={data}></StatesCards>
                </Container>
            }

        </Container>
    )
}