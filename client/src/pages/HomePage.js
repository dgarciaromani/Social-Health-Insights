import { Container, Typography, Box, Stack, Button, Divider, Card, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import EconomicDomain from '../images/Homepage/1.gif';
import EducationDomain from '../images/Homepage/2.gif';
import HealthcareDomain from '../images/Homepage/3.gif';
import InfrasctructureDomain from '../images/Homepage/4.gif';
import SocialDomain from '../images/Homepage/5.gif';

export default function HomePage() {

    const domainsSDOH = [
        {
            name: 'Economic Context',
            url: 'https://health.gov/healthypeople/objectives-and-data/browse-objectives/economic-stability',
            img: EconomicDomain,
        },
        {
            name: 'Education Access',
            url: 'https://health.gov/healthypeople/topic/education-access-and-quality',
            img: EducationDomain,
        },
        {
            name: 'Healthcare Context',
            url: 'https://health.gov/healthypeople/topic/health-care-access-and-quality',
            img: HealthcareDomain,
        },
        {
            name: 'Physical Infrastructure',
            url: 'https://health.gov/healthypeople/topic/neighborhood-and-built-environment',
            img: InfrasctructureDomain,
        },
        {
            name: 'Community & Social Context',
            url: 'https://health.gov/healthypeople/topic/social-and-community-context',
            img: SocialDomain,
        },
    ]

    return(
        <>
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                bgcolor: 'background.paper',
                pt: 12,
                pb: 10,
            }}
            >
            <Container maxWidth="sm"
                sx={{ flexBasis: '70%' }}>
                <Typography
                    component="h3"
                    variant="h3"
                    align="left"
                    color="text.primary"
                    gutterBottom>
                    Discover the Social Determinants of Health and Health Outcomes of any 
                    neighborhood in seconds
                </Typography>
                <Typography variant="h6" align="left" color="text.secondary" paragraph>
                    Use our web application to interact with a selection of two main data sets, 
                    including one with Social Determinants of Health data and one with 
                    Health Outcomes data.
                </Typography>
                
            </Container>
            <Container maxWidth="sm"
                sx={{ flexBasis: '30%' }}>
                <img src={require("../images/Homepage/Healthy People 2030 SDOH Graphic.png")} 
                    alt="SDoH" 
                    style={{ width: '100%' }}/>
            </Container>
            <Container>
                <Stack
                    sx={{ pt: 4,
                        flexWrap: 'wrap',
                        '& > button': {
                          width: '100%',
                          maxWidth: '250px',
                        },
                        '@media (max-width: 600px)': {
                          justifyContent: 'center',
                        }, 
                        alignItems: 'center'}}
                    direction="row"
                    spacing={2}
                    justifyContent="center">
                    <Button 
                        component={Link} to="../address_page" 
                        variant="contained" 
                        sx={{ textDecoration: 'none', 
                            height: '60px', padding: '20px', margin: '20px'}}>
                            Find an Address
                    </Button>
                    <Button 
                        component="a" 
                        href="#content"
                        variant="outlined"
                        sx={{ textDecoration: 'none', 
                            height: '60px', padding: '20px', margin: '20px'}}>
                            Learn more about SDoH & Health Outcomes
                    </Button>
                </Stack>
            </Container>
        </Box>
        <Box>
            <Box id="content"
                sx={{
                    margin: '0px', 
                    padding: '60px', 
                    'backgroundColor': '#D3D3D3'}}>
                    <h1>What are Social Determinants of Health?</h1>
                    <Divider/>
                    <p>Social determinants of health (SDoH) are the conditions in the environments where people are born, live, learn, work, play, 
                        worship, and age that affect a wide range of health, functioning, and quality-of-life outcomes and risks. The World Health 
                        Commission on the SDoH documented a 28 year disparity between the life expectancies of the richest and poorest postal codes. 
                        The United States has been collecting SDoH data which is grouped into 5 domains:
                    </p>

                    <Container>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '10px' }}>
                            
                            {domainsSDOH.map((item, index) => (
                                <a key={index} 
                                    href={item.url} 
                                    style={{ textDecoration: 'none' }} 
                                    onClick={(event) => {
                                    event.preventDefault();
                                    window.open(event.currentTarget.href, '_blank');
                                }}>
                                <Card sx={{ width: 150, margin: '10px' }}>
                                    <CardMedia sx={{ width: '100px', height: '100px', padding: '10px', margin: 'auto' }}
                                        component="img"
                                        src={item.img}
                                        height="150"
                                        alt={item.name}                                        
                                    />
                                    <CardContent sx={{ padding: '10px' }}>
                                        <Typography gutterBottom variant="h6">
                                            {item.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                </a>
                            ))}
                        </Box>
                    </Container>
                    <p>We are working with the <a href="https://www.ahrq.gov/sdoh/data-analytics/sdoh-data.html" 
                    onClick={(event) => {
                        event.preventDefault();
                        window.open(event.currentTarget.href, '_blank');
                    }} style={{ color: '#00695c' }}>AHRQ's database on Social Determinants of Health (SDOH)</a>, 
                        that has 321 different variables that correspond to five key SDoH domains. We selected 44 variables of interest, all collected at the census tract level, 
                        to synthesize this data in an easily digestible website to help demonstrate the differences between opportunities in different areas of the United States.
                    </p>
                    <p> The combination of SDoH data with <a href="https://www.cdc.gov/places/social-determinants-of-health-and-places-data/index.html"
                    onClick={(event) => {
                        event.preventDefault();
                        window.open(event.currentTarget.href, '_blank');
                    }} style={{ color: '#00695c' }}>community-level chronic disease measures from PLACES</a> (Health Outcomes) can enhance the value of both data types in comprehending community health. 
                        By analyzing these data jointly, one can identify the areas where health and SDoH problems intersect, and utilize this insight while developing public health 
                        promotion, prevention, treatment, and management plans. For instance, pinpointing regions with elevated rates of chronic disease coupled with high social 
                        vulnerability can highlight locations requiring targeted strategies to address the conditions affecting residents. Moreover, the integration of this data 
                        can aid in planning efforts across various sectors such as education, transportation, and housing, who are working together to enhance environmental 
                        conditions and improve public health.
                    </p>
            </Box>
        </Box>
        </>
    )
}