import { useEffect, useState } from 'react';
import { Container, Divider, InputLabel, MenuItem, FormControl, Select, Grid } from '@mui/material';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LABELS, STATES } from '../constants';
import { Box } from '@mui/system';
const config = require('../config.json');

export default function RankPage() {
    const [state, setState] = useState('All States');
    const [variable, setVariable] = useState('% of teens and adults who are unemployed and not in school (ages 16 - 19)');
    const [data, setData] = useState([]);

    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/ranks?state=${state}&variable=${LABELS[variable]['label']}`)
      .then(res => res.json())
      .then(resJson => setData(resJson))
    }, [state, variable])

    const handleStateChange = (event) => {
          setState(event.target.value);  
    };
    
    const handleVariableChange = (event) => {
        setVariable(event.target.value);
    };

    const boxProperties = {
      p: 1,
      m: 1,
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
      color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
      border: '1px solid',
      borderColor: (theme) =>
        theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
      borderRadius: 2,
      fontSize: '0.875rem',
      fontWeight: '700',
      padding:'20px'
    }

    return (
      <Container sx={{padding:'10px 0px 80px'}}>
        <h1>Health Outcomes</h1>
        <p>Use our interactive tool to see the relationship between SDoH and Health Outcomes. 
          Select a State and an SDoH variable to select tracts with the highest and lowest 5% values 
          for that variable. From there, we average all of the health outcome scores in those tracts 
          and normalize based on the country maximum. For example, select 'Miles to nearest urgent care' 
          and you will find that in every state, those tracts with higher values have higher incidences 
          of all poor health outcomes compared to the tracts with lower values. Read the results "Lowest 5%: 40.48" as 
          "the average health outcome, in tracts with the lowest 5% in this state, is 40% as bad as the 
          worst tract in the country" </p>
        <Divider/>
        <Box sx={boxProperties}>
          <Grid container >
            <Grid item xs={3}>
                <div style={{width:'100%', display:'flex', justifyContent:'right'}}>
                  <FormControl sx={{m:1, minWidth: 120}}>
                  <InputLabel id="state-label">State</InputLabel>
                      <Select labelId = "state-label"
                              id="state" 
                              name="state" 
                              label="State"
                              value={state} 
                              onChange={handleStateChange} 
                              style={{ width: "100%" }} >   
                        <MenuItem key={"all"} value={'All States'}>
                            All States
                          </MenuItem>
                        {Object.keys(STATES).map((stateKey) => (
                          <MenuItem key={stateKey} value={stateKey}>
                            {stateKey}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={9}>
                <div style={{width:'100%', display:'flex', justifyContent:'left'}}>
                  <FormControl sx={{m:1, minWidth: 120}}>
                    <InputLabel id="variable-label">Variable</InputLabel>
                      <Select labelId="variable-label"
                              id="variable" 
                              name="variable" 
                              label="Variable"
                              value={variable} 
                              onChange={handleVariableChange} 
                              style={{ width: "100%" }} 
                              required>
                        {Object.keys(LABELS).map((labelKey) => (
                          <MenuItem key={labelKey} value={labelKey}>
                            {labelKey}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
            <ResponsiveContainer height={500}> 
                <RadarChart
                    data={data}
                    margin={{ left: 40 }}
                    >
                    <PolarGrid />
                    <PolarAngleAxis dataKey='label' />
                    <PolarRadiusAxis angle={30} domain={[0,100]} />
                    <Radar name="Lowest 5%" dataKey='bottom 5 percent' stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} animationDuration={200} />
                    <Tooltip />
                    <Radar name="Highest 5%" dataKey='top 5 percent' stroke="#8884d8" fill="#8884d8" fillOpacity={0.4} animationDuration={200}/>
                    <Legend/>
                </RadarChart>
            </ResponsiveContainer>
          </Box>
          <Divider/>
          <Box sx={{margin: '40px 0px 5px', padding: '10px 20px 20px 20px', backgroundColor: '#D3D3D3'}}>
            <h1>Social Determinants of Health (SDOH) and Health Outcomes</h1>
            <Divider/>
            <p> We expect some of the SDoH variables in our database to have positive effects on the population as they increase,
              and some will have negative effects. Can you find examples of variables where the highest value tracts have better
              health outcomes (lower values)? </p>
          </Box>
      </Container>
    ) 
}