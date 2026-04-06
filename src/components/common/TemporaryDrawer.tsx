import React from 'react';
import { 
  Drawer, 
  Avatar, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  IconButton, 
  Divider, 
  Typography, 
  Stack,
  Button,
  alpha,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';
import VerifiedIcon from '@mui/icons-material/Verified';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface TemporaryDrawerProps {
  isopen: boolean;
  onClose: () => void;
  userData?: any;
}

const TemporaryDrawer: React.FC<TemporaryDrawerProps> = ({ isopen, onClose, userData }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const getInitials = (firstName: string, middleName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${middleName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getGenderText = (genderId: number) => {
    switch (genderId) {
      case 1: return 'Male';
      case 2: return 'Female';
      case 3: return 'Other';
      default: return 'Not Specified';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userdata");
    localStorage.removeItem("theme");
    sessionStorage.clear();
    navigate("/");
    onClose();
  };

  const userDetail = userData?.[0]?.userdetail?.[0] || {};

  return (
    <Drawer
      anchor="right"
      open={isopen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '85%', sm: 360 },
          borderRadius: { xs: 0, sm: '20px 0 0 20px' },
          bgcolor: 'var(--drawer-background)',
          color: 'var(--drawer-color)',
          borderLeft: '1px solid var(--divider-background)',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--divider-background)',
        bgcolor: 'var(--header-background)',
        color: 'var(--header-color)',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          My Profile
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'inherit' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Profile Info */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 3,
        bgcolor: alpha(theme.palette.common.black, 0.02),
      }}>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mb: 2,
            fontSize: '2.5rem',
            fontWeight: 'bold',
            bgcolor: 'var(--primary-color)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {getInitials(userDetail.firsT_NAME, userDetail.middlE_NAME, userDetail.suR_NAME) || 'U'}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
          {userDetail.firsT_NAME} {userDetail.middlE_NAME} {userDetail.suR_NAME}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
          {userDetail.rolename || 'Healthcare Professional'}
        </Typography>
      </Box>

      {/* Details List */}
      <List sx={{ p: 2 }}>
        <ListItem sx={{ borderRadius: '12px', mb: 1 }}>
          <ListItemIcon>
            <BadgeIcon sx={{ color: 'var(--primary-color)' }} />
          </ListItemIcon>
          <ListItemText 
            primary="User ID" 
            secondary={userDetail.logiN_NAME || 'N/A'}
            primaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.6 } }}
          />
        </ListItem>

        <ListItem sx={{ borderRadius: '12px', mb: 1 }}>
          <ListItemIcon>
            <AccountCircleIcon sx={{ color: 'var(--primary-color)' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Full Name" 
            secondary={`${userDetail.firsT_NAME || ''} ${userDetail.middlE_NAME || ''} ${userDetail.suR_NAME || ''}`}
            primaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.6 } }}
          />
        </ListItem>

        {userDetail.dob && (
          <ListItem sx={{ borderRadius: '12px', mb: 1 }}>
            <ListItemIcon>
              <CalendarTodayIcon sx={{ color: 'var(--primary-color)' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Date of Birth" 
              secondary={dayjs(userDetail.dob).format('MMMM DD, YYYY')}
              primaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.6 } }}
            />
          </ListItem>
        )}

        {userDetail.gendeR_ID && (
          <ListItem sx={{ borderRadius: '12px', mb: 1 }}>
            <ListItemIcon>
              <WcIcon sx={{ color: 'var(--primary-color)' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Gender" 
              secondary={getGenderText(userDetail.gendeR_ID)}
              primaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.6 } }}
            />
          </ListItem>
        )}

        {userDetail.cuR_MOBILE && (
          <ListItem sx={{ borderRadius: '12px', mb: 1 }}>
            <ListItemIcon>
              <PhoneIcon sx={{ color: 'var(--primary-color)' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Mobile Number" 
              secondary={userDetail.cuR_MOBILE}
              primaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.6 } }}
            />
          </ListItem>
        )}

        {userDetail.email && (
          <ListItem sx={{ borderRadius: '12px', mb: 1 }}>
            <ListItemIcon>
              <EmailIcon sx={{ color: 'var(--primary-color)' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Email Address" 
              secondary={userDetail.email}
              primaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.6 } }}
            />
          </ListItem>
        )}

        <ListItem sx={{ borderRadius: '12px', mb: 1 }}>
          <ListItemIcon>
            <VerifiedIcon sx={{ color: userDetail.iS_ACTIVE ? '#10b981' : '#f44336' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Account Status" 
            secondary={userDetail.iS_ACTIVE ? 'Active' : 'Inactive'}
            primaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.6 } }}
            secondaryTypographyProps={{ 
              sx: { color: userDetail.iS_ACTIVE ? '#10b981' : '#f44336', fontWeight: 500 }
            }}
          />
        </ListItem>
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid var(--divider-background)' }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
          sx={{
            borderRadius: '12px',
            py: 1.2,
            color: '#f44336',
            borderColor: '#f44336',
            '&:hover': {
              borderColor: '#f44336',
              backgroundColor: alpha('#f44336', 0.04),
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Drawer>
  );
};

export default TemporaryDrawer;