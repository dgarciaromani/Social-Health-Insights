import {Card, Container, CardContent, CardMedia, Typography, Box} from '@mui/material';

export default function ActionAreaCard({data}) {
    return (
        <Container>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '10px' }}>
                {data.map((states) =>
                    <Card sx={{ width: 200, margin: '10px' }} key={states.STATE}>
                        <CardMedia sx={{ width: '100px', height: '100px', padding: '10px', margin: 'auto' }}
                            component="img"
                            src="img"
                            height="150"
                            image={require("../images/States/" + states.STATE + ".png")}
                            alt={states.STATE}
                        />
                        <CardContent sx={{ padding: '10px' }}>
                            <Typography gutterBottom variant="h6">
                                {states.STATE}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Container>
    );
}