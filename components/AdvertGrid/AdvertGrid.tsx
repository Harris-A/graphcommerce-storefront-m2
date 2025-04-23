import { Typography, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import * as React from 'react';



const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

// emotionCSS styling for advert images
const StyledImg = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
  objectFit: 'cover',
});

const StyledButton = styled(Button)({
  position: { xs: 'absolute' },
  bottom: { xs: '42%', sm: '42%', md:'58%' },
  left: '10',
  fontSize: '1rem',
  color: '#fff',
  background: '#97CB0E',
  textTransform: 'uppercase',
})

export default function BasicGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} alignItems='stretch'>
        <Grid item xs={8}>
          <Item sx={{ height: '100%' }}>
            <StyledImg alt='Man Running' src='advert-5.png' sx={{ height: '100%' }} />
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item sx={{ height: '100%' }}>
            <StyledImg alt='Man Running' src='advert-2.png' sx={{ height: '100%' }} />
            <Typography
              variant='h2'
              sx={{
                position: { xs: 'absolute' },
                bottom: { xs: '42%', sm: '42%', md:'38%' },
                fontSize: { xs: '1rem', sm: '1rem', md: '1.5rem' },
                color: (theme) => (theme.palette.mode === 'dark' ? '#fff' : '#fff'),
                background: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#97CB0E7A'),
                textAlign: 'right',
                textTransform: 'uppercase',
                maxWidth: { xs: '50%', sm: '60%' },
                padding: '0.5rem',
                zIndex: 1,
              }}
            >
              Pace yourself
            </Typography>
            <StyledButton>shop</StyledButton>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item sx={{ height: '100%' }}>
            <StyledImg alt='Man Cycling' src='advert-1.png' sx={{ height: '100%' }} />
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item sx={{ height: '100%' }}>
            <StyledImg alt='Woman doing yoga stretch' src='advert-4.png' sx={{ height: '100%' }} />
          </Item>
        </Grid>
      </Grid>
    </Box>
  )
}