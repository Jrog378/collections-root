import { NavLink, Outlet } from 'react-router-dom'
import { createTheme, CssBaseline, IconButton, Stack, ThemeProvider } from '@mui/material'
import { useState } from 'react';
import ContrastIcon from '@mui/icons-material/Contrast';

// const lightTheme = createTheme({ palette: { mode: 'light' } });
// const darkTheme = createTheme({ palette: { mode: 'dark' } });
// import { lightBlue } from '@mui/material/colors';

export const lightGreenTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#388e3c' },      // Material green[700]
    secondary: { main: '#81c784' },    // Material green[300]
    background: { default: '#e8f5e9' }, // Material green[50]
  },
});

// Dark green theme
export const darkGreenTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#81c784' },     // Material green[300]
    secondary: { main: '#388e3c' },   // Material green[700]
    background: { default: '#1b1f1b' }, // A deep dark greenish background
  },
});



// Light theme: Blue background, green buttons
export const lightBlueTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },       // Blue for main elements (e.g., app bar, links)
    secondary: { main: '#388e3c' },     // Green for buttons
    background: { default: '#e3f2fd' }, // Blue[50]
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#388e3c',   // Green
          color: '#fff',
          '&:hover': {
            backgroundColor: '#2e7031', // Darker green
          },
        },
      },
    },
  },
});

// Dark theme: Blue background, green buttons
export const darkBlueTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },       // Blue[200]
    secondary: { main: '#81c784' },     // Green[300] for buttons
    background: { default: '#121a25' }, // Very dark blue
  },
});

export const lightTanTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },         // Keep blue as your main accent
    secondary: { main: '#388e3c' },       // Green for buttons
    background: {
      default: '#faf6ee',                 // Barely tan (off-white, subtle warmth)
      paper: '#f5efe3',                   // Slightly darker tan for surfaces
    },
  },
});


export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  return (
    <ThemeProvider theme={mode === 'light' ? lightTanTheme : darkBlueTheme}>
      <CssBaseline />
      <Stack style={{ border: ".05rem solid grey", borderRadius: '1rem', maxWidth:'100%' }}>
        <Stack direction={'row'} sx={{ justifyContent: 'space-between', width: '100%' }}>
          <Stack direction={'row'}>
            <NavLink to={'/'} className={'nav-links'}><h1>Mason Exhibitions</h1></NavLink>
          </Stack>
          <Stack direction={'row'} alignItems={'center'}>
            <IconButton style={{padding:'1rem'}} onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
              <ContrastIcon/>
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <Outlet />
    </ThemeProvider>
  )
}