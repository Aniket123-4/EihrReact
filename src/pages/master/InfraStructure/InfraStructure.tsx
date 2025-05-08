import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Chip,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../utils/Url';

// Create a theme with primary and secondary colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

// Initial values structure
const initialFormValues = {
  disease: null as { diseaseID: string; diseaseName: string } | null,
  medicines: {} as Record<string, {
    selected: boolean;
    itemID: string;
    noOfDays: string;
    noOfTimesPerDay: string;
    qtyPerTimes: string;
    instruction: string;
    advice: string;
    diet: string;
  }>,
  tests: {} as Record<string, {
    selected: boolean;
    invParameterID: string;
  }>
};

const InfraStructure = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for medicine list data
  const [medicines, setMedicines] = useState<any[]>([]);

  // State for test parameters
  const [testParameters, setTestParameters] = useState<any[]>([]);

  // State for diseases
  const [diseases, setDiseases] = useState<any[]>([]);

  // State for error handling
  const [error, setError] = useState<string | null>(null);

  // Formik form handling
  const formik = useFormik({
    initialValues: initialFormValues,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null);

        if (!values.disease) {
          toast.error('Please select a disease');
          return;
        }

        // Prepare payload for tests (type 1)
        const testPayload = {
          diseasesID: values.disease.diseaseID,
          lstTypeInv: Object.entries(values.tests)
            .filter(([_, test]) => test.selected)
            .map(([_, test]) => ({
              col1: test.invParameterID,
              col2: "",
              col3: "",
              col4: "",
              col5: "",
              col6: "",
              col7: "",
              col8: "",
              col9: "",
              col10: "",
              col11: "",
              col12: "",
              col13: "",
              col14: "",
              col15: ""
            })),
          userID: -1,
          formID: -1,
          type: 1
        };

        // Prepare payload for medicines (type 2)
        const medicinePayload = {
          diseasesID: values.disease.diseaseID,
          lstTypeInv: Object.entries(values.medicines)
            .filter(([_, medicine]) => medicine.selected)
            .map(([_, medicine]) => ({
              col1: medicine.itemID,
              col2: medicine.noOfDays,
              col3: medicine.noOfTimesPerDay,
              col4: medicine.qtyPerTimes,
              col5: medicine.instruction,
              col6: medicine.advice,
              col7: medicine.diet,
              col8: "",
              col9: "",
              col10: "",
              col11: "",
              col12: "",
              col13: "",
              col14: "",
              col15: ""
            })),
          userID: -1,
          formID: -1,
          type: 2
        };

        // Submit both payloads
        const [testResponse, medicineResponse] = await Promise.all([
          api.post(`MasterForm/AddUpdateDiseaseLink`, testPayload),
          api.post(`MasterForm/AddUpdateDiseaseLink`, medicinePayload)
        ]);

        if (testResponse.data.isSuccess && medicineResponse.data.isSuccess) {
          toast.success('Data saved successfully!');
          formik.resetForm();
        } else {
          throw new Error(testResponse.data.msg || medicineResponse.data.msg || 'Failed to save data');
        }
      } catch (err) {
        console.error("Error submitting form:", err);
        toast.error(err.message || 'Failed to save data');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  // Fetch diseases from API
  const fetchDiseases = async () => {
    try {
      const payload = {
        diseaseID: "-1",
        diseaseTypeID: "-1",
        specialTypeID: "-1",
        isActive: "-1",
        type: 1
      };

      const response = await api.post(`MasterForm/api/GetDisease`, payload);

      if (response.data.isSuccess && response.data.result) {
        setDiseases(response.data.result);
      } else {
        throw new Error(response.data.msg || 'Failed to fetch diseases');
      }
    } catch (err) {
      console.error("Error fetching diseases:", err);
      toast.error('Failed to load diseases. Please try again later.');
      setDiseases([]);
    }
  };

  // Fetch test parameters from API
  const fetchTestParameters = async () => {
    try {
      const payload = {
        invParameterID: -1,
        invGroupID: -1,
        isActive: -1,
        formID: -1,
        type: 1
      };

      const response = await api.post(`MasterForm/api/GetInvParameterMasterList`, payload);

      if (response.data.isSuccess && response.data.result) {
        setTestParameters(response.data.result);
      } else {
        throw new Error(response.data.msg || 'Failed to fetch test parameters');
      }
    } catch (err) {
      console.error("Error fetching test parameters:", err);
      toast.error('Failed to load test parameters. Please try again later.');
      setTestParameters([]);
    }
  };

  // Fetch medicines from API
  const fetchMedicines = async () => {
    try {
      const payload = {
        itemID: -1,
        itemCatID: -1,
        itemSearch: "",
        userID: -1,
        formID: -1,
        type: 1
      };

      const response = await api.post(`InventoryForm/GetItem`, payload);

      if (response.data.isSuccess && response.data.result) {
        setMedicines(response.data.result);
      } else {
        throw new Error(response.data.msg || 'Failed to fetch medicines');
      }
    } catch (err) {
      console.error("Error fetching medicines:", err);
      toast.error('Failed to load medicines. Please try again later.');
      setMedicines([]);
    }
  };

  // Fetch linked data when disease is selected
  const fetchLinkedData = async (diseaseId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const [medResponse, testResponse] = await Promise.all([
        api.post(`MasterForm/GetDiseaseLink`, {
          diseaseID: diseaseId,
          userID: -1,
          formID: -1,
          type: 2
        }),
        api.post(`MasterForm/GetDiseaseLink`, {
          diseaseID: diseaseId,
          userID: -1,
          formID: -1,
          type: 1
        })
      ]);

      if (medResponse.data.isSuccess && testResponse.data.isSuccess) {
        // Initialize medicine object
        const initialMedicines = {};
        medicines.forEach((medicine) => {
          initialMedicines[medicine.itemName] = {
            selected: false,
            itemID: medicine.itemID,
            noOfDays: '',
            noOfTimesPerDay: '',
            qtyPerTimes: '',
            instruction: '',
            advice: '',
            diet: ''
          };
        });

        medResponse.data.result?.forEach((item) => {
          const matchingMedicine = medicines.find(m => m.itemID === item.itemID);
          if (matchingMedicine) {
            initialMedicines[matchingMedicine.itemName] = {
              selected: true,
              itemID: item.itemID,
              noOfDays: item.noOfDays,
              noOfTimesPerDay: item.noOfTimesPerDay,
              qtyPerTimes: item.qtyPerTimes,
              instruction: item.instruction,
              advice: item.advice,
              diet: item.diet
            };
          }
        });

        // Initialize test object
        const initialTests = {};
        testParameters.forEach((test) => {
          initialTests[test.invName] = {
            selected: false,
            invParameterID: test.invParameterID
          };
        });

        testResponse.data.result?.forEach((item) => {
          const matchingTest = testParameters.find(t => t.invParameterID === item.invParameterID);
          if (matchingTest) {
            initialTests[matchingTest.invName] = {
              selected: true,
              invParameterID: item.invParameterID
            };
          }
        });

        // Update formik values
        const selectedDisease = diseases.find(d => d.diseaseID === diseaseId);
        formik.setValues({
          disease: selectedDisease,
          medicines: initialMedicines,
          tests: initialTests
        });
      } else {
        throw new Error(medResponse.data.msg || testResponse.data.msg || 'Failed to fetch linked data');
      }
    } catch (err) {
      console.error("Error fetching linked data:", err);
      toast.error('Failed to load linked data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };



  // Initialize all data
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchDiseases(),
          fetchTestParameters(),
          fetchMedicines()
        ]);
      } catch (err) {
        console.error("Error initializing data:", err);
        toast.error('Failed to initialize data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Handle disease selection change
  const handleDiseaseChange = (event: any, value: any) => {
    formik.setFieldValue('disease', value);
    if (value) {
      fetchLinkedData(value.diseaseID);
    } else {
      // Reset form values when no disease is selected
      formik.setValues(initialFormValues);
    }
  };

  // Handle medicine checkbox change
  const handleMedicineCheckboxChange = (medicineName: string) => {
    formik.setFieldValue(`medicines.${medicineName}.selected`,
      !formik.values.medicines[medicineName]?.selected);
  };

  // Handle test parameter checkbox change
  const handleTestCheckboxChange = (testName: string) => {
    formik.setFieldValue(`tests.${testName}.selected`,
      !formik.values.tests[testName]?.selected);
  };

  // Handle medicine data change
  const handleMedicineDataChange = (medicineName: string, field: string, value: string) => {
    formik.setFieldValue(`medicines.${medicineName}.${field}`, value);
  };

  // Group test parameters by their group for better organization
  const groupedTestParameters = testParameters.reduce<Record<string, any[]>>((groups, test) => {
    if (!groups[test.invGroupName]) {
      groups[test.invGroupName] = [];
    }
    groups[test.invGroupName].push(test);
    return groups;
  }, {});

  if (isLoading && !formik.values.disease) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <form onSubmit={formik.handleSubmit}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ mb: 3 }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                Link Disease Test/Medicine
              </h3>
              <Autocomplete
                options={diseases}
                getOptionLabel={(option) => option.diseaseName}
                value={formik.values.disease}
                onChange={handleDiseaseChange}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Disease"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading && <CircularProgress color="inherit" size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.diseaseID === value.diseaseID}
              />
            </Box>

            {formik.values.disease && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Selected disease: <strong>{formik.values.disease.diseaseName}</strong>
              </Alert>
            )}

            <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
              <Grid item xs={12} lg={8}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    height: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Medicine
                    <Chip
                      label={`${Object.values(formik.values.medicines).filter(m => m?.selected).length} selected`}
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>

                  <Box sx={{
                    overflowX: 'auto',
                    flex: 1,
                    maxHeight: 'calc(100vh - 300px)',
                    position: 'relative'
                  }}>
                    <TableContainer sx={{
                      maxHeight: '100%',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px'
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1'
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '4px'
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555'
                      }
                    }}>
                      <Table size={isMobile ? "small" : "medium"} stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox" sx={{ backgroundColor: '#e3f2fd' }}></TableCell>
                            <TableCell sx={{ minWidth: 150, backgroundColor: '#e3f2fd' }}>Medicine</TableCell>
                            <TableCell sx={{ minWidth: 100, backgroundColor: '#e3f2fd' }}>No of Days</TableCell>
                            <TableCell sx={{ minWidth: 100, backgroundColor: '#e3f2fd' }}>No of Times/Day</TableCell>
                            <TableCell sx={{ minWidth: 100, backgroundColor: '#e3f2fd' }}>Qty Per Times</TableCell>
                            <TableCell sx={{ minWidth: 150, backgroundColor: '#e3f2fd' }}>Instruction</TableCell>
                            <TableCell sx={{ minWidth: 150, backgroundColor: '#e3f2fd' }}>Advice</TableCell>
                            <TableCell sx={{ minWidth: 150, backgroundColor: '#e3f2fd' }}>Diet</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {medicines.map((medicine) => {
                            const isSelected = !!formik.values.medicines[medicine.itemName]?.selected;
                            return (
                              <TableRow
                                key={medicine.itemID}
                                sx={{
                                  '&:hover': {
                                    backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                                  },
                                  backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.04)' : 'inherit'
                                }}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={isSelected}
                                    onChange={() => handleMedicineCheckboxChange(medicine.itemName)}
                                    color="primary"
                                  />
                                </TableCell>
                                <TableCell sx={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                                  {medicine.itemName}
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    disabled={!isSelected}
                                    value={formik.values.medicines[medicine.itemName]?.noOfDays || ''}
                                    onChange={(e) => handleMedicineDataChange(medicine.itemName, 'noOfDays', e.target.value)}
                                    type="number"
                                    InputProps={{
                                      inputProps: { min: 1 },
                                      sx: {
                                        backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: isSelected ? theme.palette.primary.main : 'inherit'
                                        }
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    disabled={!isSelected}
                                    value={formik.values.medicines[medicine.itemName]?.noOfTimesPerDay || ''}
                                    onChange={(e) => handleMedicineDataChange(medicine.itemName, 'noOfTimesPerDay', e.target.value)}
                                    type="number"
                                    InputProps={{
                                      inputProps: { min: 1 },
                                      sx: {
                                        backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: isSelected ? theme.palette.primary.main : 'inherit'
                                        }
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    disabled={!isSelected}
                                    value={formik.values.medicines[medicine.itemName]?.qtyPerTimes || ''}
                                    onChange={(e) => handleMedicineDataChange(medicine.itemName, 'qtyPerTimes', e.target.value)}
                                    InputProps={{
                                      sx: {
                                        backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: isSelected ? theme.palette.primary.main : 'inherit'
                                        }
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    disabled={!isSelected}
                                    value={formik.values.medicines[medicine.itemName]?.instruction || ''}
                                    onChange={(e) => handleMedicineDataChange(medicine.itemName, 'instruction', e.target.value)}
                                    InputProps={{
                                      sx: {
                                        backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: isSelected ? theme.palette.primary.main : 'inherit'
                                        }
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    variant="outlined"
                                    disabled={!isSelected}
                                    value={formik.values.medicines[medicine.itemName]?.advice || ''}
                                    onChange={(e) => handleMedicineDataChange(medicine.itemName, 'advice', e.target.value)}
                                    InputProps={{
                                      sx: {
                                        backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: isSelected ? theme.palette.primary.main : 'inherit'
                                        }
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    size="small" 
                                    fullWidth
                                    variant="outlined"
                                    disabled={!isSelected}
                                    value={formik.values.medicines[medicine.itemName]?.diet || ''}
                                    onChange={(e) => handleMedicineDataChange(medicine.itemName, 'diet', e.target.value)}
                                    InputProps={{
                                      sx: {
                                        backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'inherit',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: isSelected ? theme.palette.primary.main : 'inherit'
                                        }
                                      }
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    height: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Test Parameter
                    <Chip
                      label={`${Object.values(formik.values.tests).filter(t => t?.selected).length} selected`}
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>

                  <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    pr: 1,
                    maxHeight: 'calc(100vh - 300px)',
                    '&::-webkit-scrollbar': {
                      width: '6px'
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '3px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#555'
                    }
                  }}>
                    {Object.entries(groupedTestParameters).map(([group, tests]) => (
                      <Box key={group} sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            textTransform: 'uppercase',
                            bgcolor: 'primary.main',
                            color: 'white',
                            p: 0.5,
                            borderRadius: 1,
                            pl: 1,
                            position: 'sticky',
                            top: 0,
                            zIndex: 1
                          }}
                        >
                          {group}
                        </Typography>
                        <Box sx={{
                          ml: 1,
                          mt: 1,
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}>
                          {tests.map((test) => {
                            const isSelected = !!formik.values.tests[test.invName]?.selected;
                            return (
                              <Box
                                key={test.invParameterID}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  backgroundColor: isSelected ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                                  borderRadius: '4px',
                                  p: '2px 8px',
                                  transition: 'background-color 0.2s',
                                  minWidth: 'fit-content'
                                }}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => handleTestCheckboxChange(test.invName)}
                                  color="primary"
                                  size="small"
                                />
                                <Typography sx={{
                                  fontWeight: isSelected ? 'bold' : 'normal',
                                  color: isSelected ? theme.palette.primary.main : 'inherit',
                                  fontSize: '0.875rem'
                                }}>
                                  {test.invName}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{
              mt: 3,
              display: 'flex',
              gap: 2,
              justifyContent: isMobile ? 'center' : 'flex-start',
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'background.paper',
              py: 2,
              zIndex: 2
            }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || !formik.values.disease}
                sx={{
                  px: 4,
                  py: 1,
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(33, 150, 243, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 10px rgba(33, 150, 243, 0.4)',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#a0a0a0'
                  }
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save'}
              </Button>
              <Button
                variant="outlined"
                sx={{
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
                onClick={() => {
                  formik.resetForm();
                  toast.info('Form has been reset');
                }}
              >
                Reset
              </Button>
            </Box>
          </Paper>
        </form>
      </Container>
    </ThemeProvider>
  );
}

export default InfraStructure;


