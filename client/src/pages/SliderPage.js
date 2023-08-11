import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Slider, Divider, Alert, AlertTitle, Switch, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import LeafletMap from "../components/LeafletMap";
import { LABELS, STATES } from "../constants";
const config = require('../config.json');

const colors = {
    "Education": '#7986cb',
    "Healthcare context": '#4dd0e1', 
    "Housing": '#4db6ac', 
    "Income": '#81c784', 
    "Living conditions": '#dce775', 
    "Transportation": '#ff8a65'
}

function propertyFunc(category) {
    return {
        p: 1,
        m: 1,
        bgcolor: colors[category],
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '20px',
        height: '90%',
        display: 'flex', 
        alignItems: 'flex-end',
        justifyContent: 'center'  
    }
}

export default function SliderPage() {
    const [state, setState] = useState('');
    const [variable, setVariable] = useState('');
    const [sliders, setSliders] = useState([]);
    const [radios, setRadios] = useState([]);
    const [warningOpen, setWarningOpen] = useState(false);
    const [returnedData, setReturnedData] = useState([]);
    const [noneFound, setNoneFound] = useState(false);
    const [listOfVars, setListOfVars] = useState([]);
    const [sliderBool, setSliderBool] = useState(false);
    const [variableList, setVariableList] = useState([]);
    const [permVariableList, setPermVariableList] = useState([]);

    const handleStateChange = (event) => {
        setWarningOpen(false)
        setState(event.target.value);
    };

    const handleCreateForm = () => {
        if (variable==='') {
            return
        }
        if (sliderBool) {
            let newSlider = {'label': '', 'value': [], 'maximum': '', 'minimum': '', 'step': '', 'category': ''};
            newSlider.label = variable;
            newSlider.maximum = LABELS[variable]['maximum'];
            newSlider.minimum = LABELS[variable]['minimum'];
            newSlider.value[0] = LABELS[variable]['minimum'];
            newSlider.value[1] = LABELS[variable]['maximum'];
            newSlider.step = LABELS[variable]['step'];
            newSlider.category = LABELS[variable]['category'];
            setSliders([...sliders, newSlider]);
            
        } else {
            let newRadio = {'label': '', 'value': '1', 'category': ''}
            newRadio.label = variable;
            newRadio.category = LABELS[variable]['category'];
            setRadios([...radios, newRadio]);
        }
        setListOfVars([...listOfVars, variable])
        setVariable('')
        setVariableList(variableList.filter((item) => item.props.value !== variable))

    }

    const handleVariableChange = (event) => {
        const selectedValue = event.target.value;
        setVariable(selectedValue);
    }

    const handleSearch = () => {
        setNoneFound(false)
        if (state===''){
            setWarningOpen(true)
            return
        }
        let string = `${state}/`
        if (sliderBool) {
            sliders.forEach((variable) => {
                string = string + `${LABELS[variable.label].label}-${variable.value[0]}-${variable.value[1]}/`
            })
            fetch(`http://${config.server_host}:${config.server_port}/slider/${string}`)
                .then(res => res.json())
                .then(resJson => {
                    if(resJson.length === undefined) {
                        setNoneFound(true)
                        setReturnedData([]);
                    } else {
                        setReturnedData(resJson)
                    }
                    
                })
        } else {
            radios.forEach((variable) => {
                string = string + `${LABELS[variable.label].label}-${variable.value}/`
            })
            fetch(`http://${config.server_host}:${config.server_port}/radios/${string}`)
                .then(res => res.json())
                .then(resJson => {
                    if(resJson.length === undefined) {
                        setNoneFound(true)
                        setReturnedData([]);
                    } else {
                        setReturnedData(resJson)
                    }
                    
                })
        }
    }

    const handleSwitchChange = () => {
        // clear the list of sliders and the list of radio components
        setSliders([])
        setListOfVars([])
        setRadios([])
        setNoneFound(false)
        setSliderBool(prevBool => !prevBool)
        setVariableList(permVariableList)
    }

    useEffect(() => {
        let tempArr = []
        // create the variable dropdown list        
        Object.keys(LABELS).map((labelKey, index) => {
            tempArr.push(<MenuItem key={labelKey} value={labelKey}>{labelKey}</MenuItem>)
            return null
        })
        setVariableList(tempArr)
        setPermVariableList(tempArr)
    }, [])

    
    return (
        <Container sx={{padding:'10px 0px 80px'}}>
            <h1>Compare tracts within a State</h1>
            <p>Use our interactive tool to compare different census tracts within a State. First, choose a State 
                and then add different SDoH variables to start the comparison. You will be able to use the sliders 
                to adjust each variable. Once you finish setting up the variables, press " Search" to see the 
                results in the map. </p>
            <Divider/>
                <Box sx={{display: 'flex', justifyContent: 'center', padding:'20px 0px 0px'}}>
                    <div>
                        <span style={{padding: '0px 10px 0px'}}>Raw Slider Numbers </span>
                        <FormControlLabel
                            control = {<Switch onChange={handleSwitchChange} defaultChecked/>}
                        />
                        <span>Percentile Groups</span>
                    </div>
                </Box>             
                <Box sx={{display: 'flex', justifyContent: 'center', padding:'10px 0px 20px'}}>
                    <div>
                        <FormControl sx={{m:1, minWidth: 120}}>
                            <InputLabel id="state-label">State</InputLabel>
                            <Select labelId="state-label"
                                    id="state" 
                                    name="state"
                                    label="State" 
                                    value={state} 
                                    onChange={handleStateChange} 
                                    style={{ width: "100%" }} >   
                                {Object.keys(STATES).map((stateKey) => (
                                <MenuItem key={stateKey} value={stateKey}>
                                    {stateKey}
                                </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <FormControl sx={{m:1, minWidth: 120}}>
                            <InputLabel id="variable-label">Variable</InputLabel>
                            <Select labelId="variable-label"
                                    id="variable" 
                                    name="variable" 
                                    label="Variable"
                                    value={variable} 
                                    onChange={handleVariableChange} 
                                    style={{ width: "100%" }} >
                                {variableList}
                            </Select>
                        </FormControl>
                    </div>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'center', padding:'0px 0px 20px'}}>
                    <div>
                        <Button variant="contained" onClick={handleCreateForm}>Add Search Variable</Button>
                    </div>
                </Box>
            {/* If slider is switched */}
            { sliderBool && 
                <Grid container justifyContent="center" columns={{ xs: 4, sm: 8, md: 12 }} >
                    {sliders.map((slider, index) => {
                        return (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                                <Box sx={propertyFunc(slider['category'])}>
                                    <div style={{width: '100%'}}>
                                        <p >{slider.label}</p>
                                        <Slider
                                            value={slider.value}
                                            min={slider.minimum}
                                            max={slider.maximum}
                                            step={slider.step}
                                            onChange={(e, newValue) => {
                                                let data = [...sliders]
                                                data[index].value = newValue
                                                setSliders(data)
                                            }}
                                            valueLabelDisplay='auto'
                                        />
                                        <Button 
                                            variant="outlined" 
                                            color="error"
                                            onClick={e => {
                                                let data = [...sliders];
                                                data.splice(index,1)
                                                let vars = [...listOfVars];
                                                vars.splice(index,1)
                                                setSliders(data)
                                                setListOfVars(vars)
                                                // need to add the variable back into the variablelist
                                                let dropDownVars = [...variableList];
                                                dropDownVars.push(<MenuItem key={slider.label} value={slider.label}>{slider.label}</MenuItem>)
                                                setVariableList(dropDownVars)
                                            }}>
                                                Delete
                                        </Button>
                                    </div>
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid>
            } 
            {/* If percentile groups is switched */}
            { (!sliderBool && radios.length > 0) && 
            <Box sx={{display: 'flex', justifyContent: 'center', padding:'0px 0px 0px'}}>
                <div>
                    <p>Variables were ranked from lowest to highest values.</p>
                    <p>
                        <strong>Group 1:</strong> under 20th percentile. 
                        <strong> Group 2:</strong> 20 - 40th percentile. 
                        <strong> Group 3:</strong> 40 - 60th percentile. 
                        <strong> Group 4:</strong> 60 - 80th percentile. 
                        <strong> Group 5:</strong> over 80th percentile.
                    </p>
                </div>
            </Box> 
            }
            { !sliderBool &&
                <Grid container justifyContent="center" columns={{ xs: 4, sm: 8, md: 12 }} >
                {radios.map((radio, index) => {
                    return (
                        <Grid item xs={2} sm={4} md={4} key={index}>
                            <Box sx={propertyFunc(radio['category'])}>
                                <div style={{width: '100%'}}>
                                    <p >{radio.label}</p>
                                    <div>
                                    <FormControl>
                                        <RadioGroup 
                                            row 
                                            value={radio.value} 
                                            onChange={e => { 
                                                let data = [...radios]
                                                data[index].value = e.target.value
                                                setRadios(data) 
                                            }}>
                                            <FormControlLabel value='1' control={<Radio />} label='1' />
                                            <FormControlLabel value='2' control={<Radio />} label='2' />
                                            <FormControlLabel value='3' control={<Radio />} label='3' />
                                            <FormControlLabel value='4' control={<Radio />} label='4' />
                                            <FormControlLabel value='5' control={<Radio />} label='5' />
                                        </RadioGroup>
                                    </FormControl>
                                    </div>
                                    <Button 
                                        variant="outlined" 
                                        color="error"
                                        onClick={e => {
                                            let data = [...radios];
                                            data.splice(index,1)
                                            let vars = [...listOfVars];
                                            vars.splice(index,1)
                                            setRadios(data)
                                            setListOfVars(vars)
                                            // need to add the variable back into the variablelist
                                            let dropDownVars = [...variableList];
                                            dropDownVars.push(<MenuItem key={radio.label} value={radio.label}>{radio.label}</MenuItem>)
                                            setVariableList(dropDownVars)
                                        }}>
                                            Delete
                                    </Button>
                                </div>
                            </Box>
                        </Grid>
                    )
                })}
            </Grid>            
            }
            { warningOpen &&
                <div style={{padding: '5px 0px 5px'}}>
                    <Alert severity="error">
                    <AlertTitle>No State Chosen</AlertTitle>
                        Please choose a state.
                    </Alert>
                </div>
            }
            { (sliders.length > 0 || radios.length > 0) && <Box sx={{display: 'flex', justifyContent: 'center', paddingBottom: '5px'}}>
                <div>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSearch}>
                        Search
                    </Button>
                </div>
            </Box>}
            { noneFound &&
                <div style={{padding: '5px 0px 5px'}}>
                    <Alert severity="warning">
                    <AlertTitle>No tracts found</AlertTitle>
                        No tracts matched your search! Try a different range.
                    </Alert>
                </div>
            }
            <LeafletMap data = {returnedData} variables={listOfVars}></LeafletMap>
        </Container>
    )
}