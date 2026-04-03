// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Typography,
//   IconButton,
//   InputAdornment,
//   Alert,
//   Snackbar,
//   Stack,
//   useTheme,
//   alpha,
//   Tooltip,
// } from '@mui/material';
// import {
//   SearchOutlined,
//   Close as CloseIcon,
//   InfoOutlined,
// } from '@mui/icons-material';

// interface SearchResult {
//   id: string | number;
//   name: string;
//   mobile: string;
//   dob: string;
//   email: string;
//   active: string;
//   role: string;
//   sections?: string[];
//   [key: string]: any;
// }

// const GlobalSearch: React.FC = () => {
//   const theme = useTheme();
//   const [searchText, setSearchText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState<SearchResult[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean;
//     message: string;
//     severity: 'success' | 'error' | 'info' | 'warning';
//   }>({
//     open: false,
//     message: '',
//     severity: 'info',
//   });

//   const API_BASE_URL = 'https://symantic_searchapi.mssplonline.in';

//   const showMessage = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleSearch = async () => {
//     const trimmedQuery = searchText.trim();
//     if (!trimmedQuery) {
//       showMessage('Please enter something to search', 'info');
//       return;
//     }

//     setLoading(true);
//     setResults([]);
//     setIsModalOpen(false);

//     try {
//       const url = `${API_BASE_URL}/search?query=${encodeURIComponent(trimmedQuery)}`;

//       const response = await fetch(url, {
//         method: 'GET',
//         mode: 'cors',
//         credentials: 'omit',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text().catch(() => '');
//         throw new Error(`API error: ${response.status}`);
//       }

//       const data = await response.json();
//       const searchResults = Array.isArray(data?.results) ? data.results : [];
//       setResults(searchResults);

//       if (searchResults.length > 0) {
//         setIsModalOpen(true);
//         showMessage(`Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`, 'success');
//       } else {
//         showMessage('No results found', 'warning');
//       }
//     } catch (err: any) {
//       console.error('Search failed:', err);
//       const errorMsg = err.message?.includes('CORS') ? 'CORS issue detected' :
//                        err.message?.includes('Failed to fetch') ? 'Cannot reach server' :
//                        'Something went wrong';
//       showMessage(errorMsg, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (event: React.KeyboardEvent) => {
//     if (event.key === 'Enter') {
//       event.preventDefault();
//       handleSearch();
//     }
//   };

//   const getStatusColor = (status?: string) => {
//     if (!status) return 'default';
//     switch (status.toLowerCase()) {
//       case 'active': return 'success';
//       case 'inactive': return 'error';
//       default: return 'default';
//     }
//   };

//   const getStatusLabel = (status?: string) => {
//     if (!status) return 'N/A';
//     return status.charAt(0).toUpperCase() + status.slice(1);
//   };

//   return (
//     <>
//       {/* Search Input - Compact */}
//       <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 ,marginRight: 2 , marginTop: 2   }}>
//           <TextField
//             size="small"
//             placeholder="Search patient..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             onKeyPress={handleKeyPress}
//             disabled={loading}
//             sx={{
//               width: 260,
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '20px 0 0 20px',
//                 '& fieldset': { borderRight: 'none' },
//                 backgroundColor: theme.palette.background.paper,
//               },
//               '& .MuiInputBase-input': {
//                 color: theme.palette.text.primary,
//               },
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchOutlined sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Button
//             variant="contained"
//             onClick={handleSearch}
//             disabled={loading}
//             size="small"
//             sx={{
//               borderRadius: '0 20px 20px 0',
//               height: 40,
//               minWidth: 80,
//               textTransform: 'none',
//               boxShadow: 'none',
//               backgroundColor: theme.palette.primary.main,
//               color: theme.palette.primary.contrastText,
//               '&:hover': { 
//                 boxShadow: 'none',
//                 backgroundColor: theme.palette.primary.dark,
//               },
//             }}
//           >
//             {loading ? <CircularProgress size={20} sx={{ color: theme.palette.primary.contrastText }} /> : 'Search'}
//           </Button>
//         </Box>
//       </Box>

//       {/* Results Modal - Compact */}
//       <Dialog
//         open={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: '12px',
//             maxHeight: '70vh',
//             backgroundColor: theme.palette.background.paper,
//           },
//         }}
//       >
//         <DialogTitle sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center',
//           py: 1.5,
//           px: 2,
//           borderBottom: `1px solid ${theme.palette.divider}`,
//           backgroundColor: theme.palette.background.paper,
//           color: theme.palette.text.primary,
//         }}>
//           <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
//             Results for "{searchText}"
//           </Typography>
//           <IconButton onClick={() => setIsModalOpen(false)} size="small" sx={{ color: theme.palette.text.secondary }}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ p: 0, overflow: 'auto', backgroundColor: theme.palette.background.default }}>
//           {results.length > 0 ? (
//             <TableContainer sx={{ maxHeight: '55vh' }}>
//               <Table stickyHeader size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ bgcolor: theme.palette.grey[100], py: 1, fontWeight: 600, color: theme.palette.text.primary }}>Sr.No.</TableCell>
//                     <TableCell sx={{ bgcolor: theme.palette.grey[100], py: 1, fontWeight: 600, color: theme.palette.text.primary }}>Name</TableCell>
//                     <TableCell sx={{ bgcolor: theme.palette.grey[100], py: 1, fontWeight: 600, color: theme.palette.text.primary }}>Mobile</TableCell>
//                     <TableCell sx={{ bgcolor: theme.palette.grey[100], py: 1, fontWeight: 600, color: theme.palette.text.primary }}>Status</TableCell>
//                     <TableCell sx={{ bgcolor: theme.palette.grey[100], py: 1, fontWeight: 600, color: theme.palette.text.primary }}>Role</TableCell>
//                     <TableCell sx={{ bgcolor: theme.palette.grey[100], py: 1, fontWeight: 600, color: theme.palette.text.primary }}>Sections</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {results.map((result, index) => (
//                     <TableRow 
//                       key={result.id || index} 
//                       hover 
//                       sx={{ 
//                         '&:nth-of-type(even)': { bgcolor: theme.palette.grey[50] },
//                         '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
//                       }}
//                     >
//                       <TableCell sx={{ color: theme.palette.text.primary }}>{index + 1}</TableCell>
//                       <TableCell>
//                         <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
//                           {result.name || '-'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ color: theme.palette.text.primary }}>{result.mobile || '-'}</TableCell>
//                       <TableCell>
//                         <Chip
//                           label={getStatusLabel(result.active)}
//                           color={getStatusColor(result.active) as any}
//                           size="small"
//                           sx={{ height: 24, fontSize: '12px', fontWeight: 500 }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ color: theme.palette.text.primary }}>{result.role || '-'}</TableCell>
//                       <TableCell>
//                         {result.sections?.length ? (
//                           <Stack direction="row" spacing={0.5} flexWrap="wrap">
//                             {result.sections.slice(0, 2).map((s, i) => (
//                               <Chip 
//                                 key={i} 
//                                 label={s} 
//                                 size="small" 
//                                 variant="outlined" 
//                                 sx={{ 
//                                   height: 24, 
//                                   fontSize: '11px',
//                                   color: theme.palette.text.primary,
//                                   borderColor: theme.palette.divider,
//                                 }} 
//                               />
//                             ))}
//                             {result.sections.length > 2 && (
//                               <Tooltip title={result.sections.slice(2).join(', ')}>
//                                 <Chip 
//                                   label={`+${result.sections.length - 2}`} 
//                                   size="small" 
//                                   variant="outlined" 
//                                   sx={{ 
//                                     height: 24,
//                                     color: theme.palette.text.primary,
//                                     borderColor: theme.palette.divider,
//                                     cursor: 'pointer',
//                                   }} 
//                                 />
//                               </Tooltip>
//                             )}
//                           </Stack>
//                         ) : <span style={{ color: theme.palette.text.secondary }}>-</span>}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ) : (
//             <Box sx={{ py: 6, textAlign: 'center' }}>
//               <InfoOutlined sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 1 }} />
//               <Typography color={theme.palette.text.secondary}>
//                 No results found for "{searchText}"
//               </Typography>
//             </Box>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           severity={snackbar.severity} 
//           variant="filled" 
//           sx={{ 
//             py: 0,
//             color: 'white',
//             '& .MuiAlert-icon': {
//               color: 'white',
//             },
//           }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default GlobalSearch;














import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  Snackbar,
  Stack,
  useTheme,
  alpha,
  Tooltip,
  TableSortLabel,
  InputBase,
} from '@mui/material';
import {
  SearchOutlined,
  Close as CloseIcon,
  InfoOutlined,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled Components
const StickyTableHeader = styled(TableHead)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 5,

  '& .MuiTableCell-root': {
    backgroundColor: theme.palette.primary.dark, // 👈 BLUE 800
    color: '#fff', // 👈 white text
    fontWeight: 700,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: 'none',
    padding: '12px 16px',

    position: 'sticky',
    top: 0,
    zIndex: 6,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const TableSearchInput = styled(InputBase)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderRadius: '20px',
  padding: '4px 12px',
  fontSize: '0.75rem',
  width: '180px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  '&.Mui-focused': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '12px 16px',
  borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  backgroundColor: theme.palette.background.paper,
}));

interface SearchResult {
  id: string | number;
  name: string;
  mobile: string;
  dob: string;
  email: string;
  active: string;
  role: string;
  sections?: string[];
  [key: string]: any;
}

const GlobalSearch: React.FC = () => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Table search/filter state
  const [tableSearch, setTableSearch] = useState('');
  const [orderBy, setOrderBy] = useState<keyof SearchResult>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const API_BASE_URL = 'https://symantic_searchapi.mssplonline.in';

  const showMessage = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSearch = async () => {
    const trimmedQuery = searchText.trim();
    if (!trimmedQuery) {
      showMessage('Please enter something to search', 'info');
      return;
    }

    setLoading(true);
    setResults([]);
    setIsModalOpen(false);
    setPage(0);
    setTableSearch('');
    setOrderBy('name');
    setOrder('asc');

    try {
      const url = `${API_BASE_URL}/search?query=${encodeURIComponent(trimmedQuery)}`;

      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const searchResults = Array.isArray(data?.results) ? data.results : [];
      setResults(searchResults);

      if (searchResults.length > 0) {
        setIsModalOpen(true);
        showMessage(`Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`, 'success');
      } else {
        showMessage('No results found', 'warning');
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      const errorMsg = err.message?.includes('CORS') ? 'CORS issue detected' :
                       err.message?.includes('Failed to fetch') ? 'Cannot reach server' :
                       'Something went wrong';
      showMessage(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return 'N/A';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleSort = (property: keyof SearchResult) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    if (tableSearch.trim()) {
      const searchTerm = tableSearch.toLowerCase();
      filtered = filtered.filter((result) =>
        result.name?.toLowerCase().includes(searchTerm) ||
        result.mobile?.toLowerCase().includes(searchTerm) ||
        result.role?.toLowerCase().includes(searchTerm) ||
        result.email?.toLowerCase().includes(searchTerm)
      );
    }

    filtered.sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [results, tableSearch, orderBy, order]);

  const paginatedResults = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredAndSortedResults.slice(start, start + rowsPerPage);
  }, [filteredAndSortedResults, page, rowsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedResults.length / rowsPerPage);

  const handleFirstPage = () => setPage(0);
  const handlePreviousPage = () => setPage(Math.max(0, page - 1));
  const handleNextPage = () => setPage(Math.min(totalPages - 1, page + 1));
  const handleLastPage = () => setPage(totalPages - 1);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearTableSearch = () => {
    setTableSearch('');
    setPage(0);
  };

  return (
    <>
      {/* Search Input */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: 2, marginTop: 2 }}>
          <TextField
            size="small"
            placeholder="Search patient..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            sx={{
              width: 260,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px 0 0 20px',
                '& fieldset': { borderRight: 'none' },
                backgroundColor: theme.palette.background.paper,
              },
              '& .MuiInputBase-input': {
                color: theme.palette.text.primary,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            size="small"
            sx={{
              borderRadius: '0 20px 20px 0',
              height: 40,
              minWidth: 80,
              textTransform: 'none',
              boxShadow: 'none',
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': { 
                boxShadow: 'none',
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: theme.palette.primary.contrastText }} /> : 'Search'}
          </Button>
        </Box>
      </Box>

      {/* Results Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '85vh',
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          py: 1.5,
          px: 2.5,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          backgroundColor: theme.palette.background.paper,
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Results for "{searchText}"
            <Typography component="span" variant="caption" sx={{ ml: 1, color: theme.palette.text.secondary }}>
              ({filteredAndSortedResults.length} records)
            </Typography>
          </Typography>
          <IconButton onClick={() => setIsModalOpen(false)} size="small" sx={{ color: theme.palette.text.secondary }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, backgroundColor: theme.palette.background.default }}>
          {results.length > 0 ? (
            <>
              {/* Table Search Bar */}
              {/* <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'center', 
                p: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                backgroundColor: theme.palette.background.paper,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterListIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                  <TableSearchInput
                    placeholder="Filter in table..."
                    value={tableSearch}
                    onChange={(e) => {
                      setTableSearch(e.target.value);
                      setPage(0);
                    }}
                    endAdornment={
                      tableSearch && (
                        <IconButton size="small" onClick={clearTableSearch} sx={{ p: 0.5 }}>
                          <ClearIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      )
                    }
                  />
                </Box>
              </Box> */}

              {/* Results Table */}
           <TableContainer 
  sx={{ 
    maxHeight: '55vh',
    overflow: 'auto', // 👈 IMPORTANT
    position: 'relative',
  }}
>
                <Table stickyHeader size="small">
                  <StickyTableHeader>
                    <TableRow>
                      <TableCell sx={{ width: '60px' }}>Sr.No.</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'name'}
                          direction={orderBy === 'name' ? order : 'asc'}
                          onClick={() => handleSort('name')}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'mobile'}
                          direction={orderBy === 'mobile' ? order : 'asc'}
                          onClick={() => handleSort('mobile')}
                        >
                          Mobile
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'active'}
                          direction={orderBy === 'active' ? order : 'asc'}
                          onClick={() => handleSort('active')}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'role'}
                          direction={orderBy === 'role' ? order : 'asc'}
                          onClick={() => handleSort('role')}
                        >
                          Role
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Sections</TableCell>
                    </TableRow>
                  </StickyTableHeader>
                  <TableBody>
                    {paginatedResults.map((result, index) => (
                      <StyledTableRow key={result.id || index}>
                        <TableCell sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                            {result.name || '-'}
                          </Typography>
                          {result.email && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                              {result.email}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: theme.palette.text.primary, fontFamily: 'monospace' }}>
                          {result.mobile || '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(result.active)}
                            color={getStatusColor(result.active) as any}
                            size="small"
                            sx={{ height: 24, fontSize: '11px', fontWeight: 600, borderRadius: '12px' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={result.role || '-'}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              height: 24, 
                              fontSize: '11px',
                              borderRadius: '12px',
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                              color: theme.palette.primary.main,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {result.sections?.length ? (
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                              {result.sections.slice(0, 2).map((s, i) => (
                                <Chip 
                                  key={i} 
                                  label={s} 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ 
                                    height: 22, 
                                    fontSize: '10px',
                                    borderRadius: '11px',
                                  }} 
                                />
                              ))}
                              {result.sections.length > 2 && (
                                <Tooltip title={result.sections.slice(2).join(', ')} arrow>
                                  <Chip 
                                    label={`+${result.sections.length - 2}`} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ 
                                      height: 22,
                                      fontSize: '10px',
                                      borderRadius: '11px',
                                      cursor: 'pointer',
                                    }} 
                                  />
                                </Tooltip>
                              )}
                            </Stack>
                          ) : (
                            <Typography variant="caption" color="text.secondary">-</Typography>
                          )}
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination - Only First, Previous, Next, Last */}
              <PaginationContainer>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Rows per page:
                    </Typography>
                    <select
                      value={rowsPerPage}
                      onChange={handleChangeRowsPerPage}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        backgroundColor: theme.palette.background.paper,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      {[5, 10, 25, 50].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <Typography variant="caption" color="text.secondary">
                      {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, filteredAndSortedResults.length)} of {filteredAndSortedResults.length}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="First Page">
                      <span>
                        <IconButton
                          onClick={handleFirstPage}
                          disabled={page === 0}
                          size="small"
                          sx={{ 
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                          }}
                        >
                          <FirstPageIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    
                    <Tooltip title="Previous Page">
                      <span>
                        <IconButton
                          onClick={handlePreviousPage}
                          disabled={page === 0}
                          size="small"
                          sx={{ 
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                          }}
                        >
                          <ChevronLeftIcon />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Typography variant="body2" sx={{ mx: 1, fontWeight: 500, color: theme.palette.primary.main }}>
                      Page {page + 1} of {totalPages}
                    </Typography>

                    <Tooltip title="Next Page">
                      <span>
                        <IconButton
                          onClick={handleNextPage}
                          disabled={page >= totalPages - 1}
                          size="small"
                          sx={{ 
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                          }}
                        >
                          <ChevronRightIcon />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Last Page">
                      <span>
                        <IconButton
                          onClick={handleLastPage}
                          disabled={page >= totalPages - 1}
                          size="small"
                          sx={{ 
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                          }}
                        >
                          <LastPageIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Box>
              </PaginationContainer>
            </>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <InfoOutlined sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 1 }} />
              <Typography color={theme.palette.text.secondary}>
                No results found for "{searchText}"
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          variant="filled" 
          sx={{ 
            py: 0,
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GlobalSearch;