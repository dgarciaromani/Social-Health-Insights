import * as React from 'react';
import { AppBar, Container, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Button } from '@mui/material'
import Link from '@mui/material/Link';

const pages = {
  'Census Tract': '/address_page',
  'Tract Data': '/tract_info_page/42101036902',
  'Compare Tracts': '/slider_page',
  'Health Outcomes': '/health_outcomes',
  'Find States': '/states_page' 
};

export default function ResponsiveNavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position='sticky' top= '0'>
      <Container maxWidth='xl'>

        <Toolbar disableGutters>
          <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'system-ui',
                fontWeight: 600,
                color: 'inherit',
                textDecoration: 'none',
              }}>
              SHI
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <img src="/menu.png" width="40" alt="menu"></img>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {Object.keys(pages).map((key) => (
                  <MenuItem key={key} value={pages[key]} onClick={handleCloseNavMenu}>
                    <Link color="inherit" underline="none" href={pages[key]}>
                      <Typography style={{
                        marginRight: '30px',
                        fontFamily: 'system-ui',
                        fontWeight: 400
                      }}>
                        {key}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'system-ui',
                fontWeight: 300,
                color: 'inherit',
                textDecoration: 'none',
              }}>
              Social Health Insights
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {Object.keys(pages).map((key) => (
                  <Button 
                    key={key} 
                    value={pages[key]} 
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}
                    href={pages[key]}>
                    <Typography style={{
                        marginRight: '10px',
                        fontFamily: 'system-ui',
                        fontWeight: 300
                      }}>
                        {key}
                      </Typography>
                  </Button>
                ))}
            </Box>

          </Toolbar>
      </Container>
    </AppBar>
  );
}