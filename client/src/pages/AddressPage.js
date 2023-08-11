import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Divider, Alert, AlertTitle, Grid, Button, TextField, MenuItem } from '@mui/material';
import LeafletMap from '../components/LeafletMap';
import { Box } from '@mui/system';
import { STATES } from '../constants';
const config = require('../config.json');

export default function AddressPage() {
  
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [foundFlag, setFoundFlag] = useState('');
  const [data, setData] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const address = {
      street: event.target.elements.street.value,
      city: event.target.elements.city.value,
      state: event.target.elements.state.value,
      zip: event.target.elements.zip.value
    };
    fetch(`http://${config.server_host}:${config.server_port}/address/${address.street}/${address.city}/${address.state}/${address.zip}`)
    .then(res => res.json())
    .then(resJson => {
      if (resJson === 0) {
        // if resJson == 0 at this point, we did not find address.
        setFoundFlag(0);
        setData([]);
      }
      else {
        setFoundFlag(1);
        setData(resJson);
      }
    })
  }

  const handleStreetChange = (event) => {
    setStreet(event.target.value);
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleZipChange = (event) => {
    setZip(event.target.value);
  };

  return (
      <Container sx={{padding:'10px 0px 80px'}}>
        <h1>Discover your tract</h1>
        <p>Use our interactive tool to find out the census tract number associated with an address.</p>
        <Divider/>

        <form onSubmit={handleSubmit} spacing={2} style={{padding:'20px'}}>
          <Box>
            <Grid container columns={{ xs: 1, md: 4 }}>
              <Grid item xs={1} style={{padding:'10px', justifyContent: 'center'}} display={'flex'}>
                <TextField 
                    id="street" 
                    label="Street" 
                    variant="outlined" 
                    value={street} 
                    onChange={handleStreetChange} 
                    style={{ width: "200px", textAlign: 'center'}}
                    required />
              </Grid> 
              <Grid item xs={1} style={{padding:'10px', justifyContent: 'center'}} display={'flex'}>
                <TextField 
                    id="city" 
                    label="City" 
                    variant="outlined" 
                    value={city} 
                    onChange={handleCityChange} 
                    style={{ width: "200px", textAlign: 'center'}}
                    required />
              </Grid>
              <Grid item xs={1} style={{padding:'10px', justifyContent: 'center'}} display={'flex'}>
                <TextField
                  id="state"
                  select
                  name="state" 
                  label="State" 
                  defaultValue="Select"
                  value={state}
                  onChange={handleStateChange}
                  style={{ width: "200px", textAlign: 'center'}}
                  autoComplete="on" 
                  required>
              {Object.keys(STATES).map((stateKey) => (
                <MenuItem key={stateKey} value={stateKey}>
                  {stateKey}
                </MenuItem>
              ))}
              </TextField>
            </Grid>
              <Grid item xs={1} style={{padding:'10px', justifyContent: 'center'}} display={'flex'}>
                <TextField 
                    id="zip" 
                    label="Zip code" 
                    variant="outlined" 
                    value={zip} 
                    onChange={handleZipChange} 
                    style={{ width: "200px", textAlign: 'center'}}
                    required />
              </Grid>
            </Grid>
          </Box>
          <Box>
            <div style={{textAlign: 'center'}}>
              <Button variant="contained" type="submit">Submit</Button>
            </div>
          </Box>
          
        </form>
        { foundFlag===0 &&
          <div style={{padding: '5px 0px 5px'}}>
            <Alert severity="error">
              <AlertTitle>Unable to find address</AlertTitle>
                The census website does not have this address on record. <strong>Try a close neighbor</strong>.
            </Alert>
          </div>
        }
        { foundFlag===1  &&
          <div style={{padding: '5px 0px 5px'}}>
            <Alert severity="success">
              <AlertTitle>Found your address!</AlertTitle>
                Your census tract is: <Link to={`../tract_info_page/${data[0]['tract']}`}><strong>{data[0]['tract']}</strong></Link>. Click for more information.
            </Alert>
          </div>
        }
        <LeafletMap data={data} variables={[]}/>
        <Divider/>
        <Box sx={{margin: '40px 0px 5px', padding: '10px 20px 20px 20px', backgroundColor: '#D3D3D3'}}>
          <h1>What is a census tract?</h1>
          <Divider/>
          <p>Census tracts are small statistical subdivisions of a County that can be updated by local participants prior to each decennial census. These census tracts are smaller than a zip code and hey represent the lowest level of collected granularity. They can show significant differences even within areas that are relatively close together. Each census tracts average about 4,000 inhabitants.</p>
        </Box>
      </Container>
      
  );
};