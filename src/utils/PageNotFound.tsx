import React from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// Import relevant icons for healthcare/records
import FolderOffIcon from '@mui/icons-material/FolderOff'; // Represents missing record/file
import HealingIcon from '@mui/icons-material/Healing'; // Represents care/fixing
import SearchOffIcon from '@mui/icons-material/SearchOff'; // Represents search failed
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // Represents the hospital context
import { motion } from 'framer-motion';
import { Theme } from '@mui/material/styles'; // Import the Theme type

// Styled Components for better UI control
// Add type annotation { theme: Theme } to the callback function's parameter
const ErrorContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', // Use minHeight to ensure it fills viewport but can grow
    textAlign: 'center',
    // Use a calming, professional background color, perhaps a light blue or grey
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
    padding: theme.spacing(4), // Increase padding for better spacing
    overflow: 'hidden', // Prevent scrollbars from animations going slightly out
}));

// Add type annotation { theme: Theme } here as well
const IconWrapper = styled(motion.div)(({ theme }: { theme: Theme }) => ({
    marginBottom: theme.spacing(3), // Consistent margin below icons
    color: theme.palette.primary.light, // Use theme colors
}));

// These don't use the theme directly in their style definitions, so no type needed here
const TextWrapper = styled(motion.div)({
    marginBottom: '24px', // Use direct value or theme.spacing if preferred later
});

const ButtonWrapper = styled(motion.div)({
    marginTop: '16px', // Use direct value or theme.spacing if preferred later
});


const PageNotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleDashboardRedirect = (): void => {
        // Make sure '/home' is your actual dashboard route
        navigate('/home');
    };

    return (
        <ErrorContainer>
            {/* Primary Icon: Animated Search/Folder Off */}
            <IconWrapper
                initial={{ opacity: 0, y: -30 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    rotate: [-3, 3, -3, 0], // Subtle rotation animation like searching/shaking head
                }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
                {/* Choose one icon that fits best: FolderOffIcon or SearchOffIcon */}
                <SearchOffIcon sx={{ fontSize: 100 }} />
                {/* <FolderOffIcon sx={{ fontSize: 100 }} /> */}
            </IconWrapper>

            {/* Heading Text */}
            <TextWrapper
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <Typography variant="h4" component="h1" color="text.primary" gutterBottom>
                    Record Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    We couldn't locate the patient record or page you were looking for.
                    It might have been moved, archived, or the link may be incorrect.
                </Typography>
            </TextWrapper>

            {/* Secondary Contextual Icon: Animated Hospital/Healing */}
            <IconWrapper
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: 0.6, // Make it slightly subtle
                    scale: 1,
                    y: [0, -8, 0] // Gentle floating animation
                 }}
                transition={{
                    delay: 0.8,
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse" // Make the float smooth
                }}
            >
                 {/* Choose one icon: LocalHospitalIcon or HealingIcon */}
                 <LocalHospitalIcon sx={{ fontSize: 60 }} />
                 {/* <HealingIcon sx={{ fontSize: 60 }} /> */}
            </IconWrapper>

             {/* Call to Action Button */}
            <ButtonWrapper
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDashboardRedirect}
                    startIcon={<LocalHospitalIcon />} // Add context to button
                >
                    Return to Dashboard
                </Button>
            </ButtonWrapper>
        </ErrorContainer>
    );
};

export default PageNotFound;