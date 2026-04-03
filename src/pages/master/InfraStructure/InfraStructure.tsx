import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Button, Container, Grid, Paper, Typography,
  CircularProgress, Autocomplete, TextField, ThemeProvider, createTheme,
  Checkbox, Divider, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../utils/Url';

const theme = createTheme({
  palette: { primary: { main: '#2196f3' }, background: { default: '#f5f5f5' } }
});

const InfraStructure = () => {
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [testParameters, setTestParameters] = useState<any[]>([]);
  const [diseases, setDiseases] = useState<any[]>([]);
  
  // State Management
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [medStore, setMedStore] = useState<Record<string, any>>({});
  const [testStore, setTestStore] = useState<Record<string, boolean>>({});

  // 1. Initial Load
  useEffect(() => {
    const init = async () => {
      try {
        const [d, t, m] = await Promise.all([
          api.post(`MasterForm/api/GetDisease`, { diseaseID: "-1", diseaseTypeID: "-1", specialTypeID: "-1", isActive: "-1", type: 1 }),
          api.post(`MasterForm/api/GetInvParameterMasterList`, { invParameterID: -1, invGroupID: -1, isActive: -1, formID: -1, type: 1 }),
          api.post(`InventoryForm/GetItem`, { itemID: -1, itemCatID: -1, itemSearch: "", userID: -1, formID: -1, type: 1 })
        ]);
        setDiseases(d.data.result || []);
        setTestParameters(t.data.result || []);
        setMedicines(m.data.result || []);
      } finally { setLoading(false); }
    };
    init();
  }, []);

  // 2. Load Link Data
  const handleDiseaseChange = async (val: any) => {
    setSelectedDisease(val);
    if (!val) { setMedStore({}); setTestStore({}); return; }
    setLoading(true);
    try {
      const [mRes, tRes] = await Promise.all([
        api.post(`MasterForm/GetDiseaseLink`, { diseaseID: val.diseaseID, type: 2, userID: -1, formID: -1 }),
        api.post(`MasterForm/GetDiseaseLink`, { diseaseID: val.diseaseID, type: 1, userID: -1, formID: -1 })
      ]);
      const mObj: any = {}; mRes.data.result?.forEach((x: any) => mObj[x.itemID] = { ...x, selected: true });
      const tObj: any = {}; tRes.data.result?.forEach((x: any) => tObj[x.invParameterID] = true);
      setMedStore(mObj); setTestStore(tObj);
    } finally { setLoading(false); }
  };

  // 3. Select All Logic (Medicines)
  const handleSelectAllMeds = (checked: boolean) => {
    const newMeds = { ...medStore };
    filteredMeds.forEach(m => {
      if (checked) {
        if (!newMeds[m.itemID]) {
          newMeds[m.itemID] = { selected: true, noOfDays: '', noOfTimesPerDay: '', qtyPerTimes: '', instruction: '', advice: '', diet: '' };
        }
      } else {
        delete newMeds[m.itemID];
      }
    });
    setMedStore(newMeds);
  };

  // 4. Grouping Logic for Tests
  const groupedTests = useMemo(() => {
    return testParameters.reduce((acc: any, t) => {
      const group = t.invGroupName || 'Other Tests';
      if (!acc[group]) acc[group] = [];
      acc[group].push(t);
      return acc;
    }, {});
  }, [testParameters]);

  const filteredMeds = useMemo(() => {
    return medicines.filter(m => m.itemName?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [medicines, searchTerm]);

  // Handlers
  const updateMedField = (id: string, field: string, val: string) => {
    setMedStore(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  };

  const toggleMed = (id: string) => {
    setMedStore(prev => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = { selected: true, noOfDays: '', noOfTimesPerDay: '', qtyPerTimes: '', instruction: '', advice: '', diet: '' };
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedDisease) return toast.error("Select Disease First");
    setLoading(true);
    try {
      const mPayload = { diseasesID: selectedDisease.diseaseID, lstTypeInv: Object.entries(medStore).map(([id, v]: any) => ({ col1: id, col2: v.noOfDays, col3: v.noOfTimesPerDay, col4: v.qtyPerTimes, col5: v.instruction, col6: v.advice, col7: v.diet })), type: 2, userID: -1, formID: -1 };
      const tPayload = { diseasesID: selectedDisease.diseaseID, lstTypeInv: Object.entries(testStore).filter(([_, v]) => v).map(([id]) => ({ col1: id })), type: 1, userID: -1, formID: -1 };
      await Promise.all([api.post(`MasterForm/AddUpdateDiseaseLink`, tPayload), api.post(`MasterForm/AddUpdateDiseaseLink`, mPayload)]);
      toast.success("Data saved!");
    } finally { setLoading(false); }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <ToastContainer autoClose={1000} />
        <Paper elevation={3} sx={{ p: 2, borderRadius: '12px' }}>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
            <Autocomplete
              options={diseases}
              getOptionLabel={(o) => o.diseaseName || ''}
              onChange={(_, v) => handleDiseaseChange(v)}
              renderInput={(p) => <TextField {...p} label="Select Disease" size="small" />}
              sx={{ width: 350 }}
            />
            <TextField 
              size="small" 
              placeholder="Search medicine..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 250 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} /></InputAdornment> }}
            />
            <Button variant="contained" onClick={handleSave} disabled={loading} sx={{ ml: 'auto', borderRadius: '8px', px: 4 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
            </Button>
          </Box>

          <Grid container spacing={2}>
            {/* Medicine Table */}
            <Grid item xs={12} lg={9}>
              <Paper variant="outlined" sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 1, bgcolor: '#f8f9fa', display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
                  <Checkbox size="small" onChange={(e) => handleSelectAllMeds(e.target.checked)} />
                  <Typography variant="caption" fontWeight="bold">Select All Medicines</Typography>
                </Box>
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#eee', zIndex: 1 }}>
                      <tr style={{ fontSize: '12px' }}>
                        <th style={{ width: '45px', padding: '10px' }}></th>
                        <th style={{ textAlign: 'left', padding: '10px', width: '220px' }}>Medicine Name</th>
                        {/* Width Increased here */}
                        <th style={{ width: '100px' }}>Days</th>
                        <th style={{ width: '100px' }}>T/Day</th>
                        <th style={{ width: '100px' }}>Qty</th>
                        <th>Instructions / Advice / Diet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMeds.map((m) => {
                        const row = medStore[m.itemID] || {};
                        return (
                          <tr key={m.itemID} style={{ borderBottom: '1px solid #eee', backgroundColor: row.selected ? '#f0f7ff' : 'white' }}>
                            <td style={{ textAlign: 'center' }}><Checkbox size="small" checked={!!row.selected} onChange={() => toggleMed(m.itemID)} /></td>
                            <td style={{ padding: '8px', fontSize: '13px', fontWeight: row.selected ? 'bold' : 'normal' }}>{m.itemName}</td>
                            
                            {/* Days Input */}
                            <td style={{ padding: '4px' }}>
                              <input 
                                value={row.noOfDays || ''} disabled={!row.selected}
                                onChange={(e) => updateMedField(m.itemID, 'noOfDays', e.target.value)}
                                style={{ width: '90%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
                              />
                            </td>
                            {/* T/Day Input */}
                            <td style={{ padding: '4px' }}>
                              <input 
                                value={row.noOfTimesPerDay || ''} disabled={!row.selected}
                                onChange={(e) => updateMedField(m.itemID, 'noOfTimesPerDay', e.target.value)}
                                style={{ width: '90%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
                              />
                            </td>
                            {/* Qty Input */}
                            <td style={{ padding: '4px' }}>
                              <input 
                                value={row.qtyPerTimes || ''} disabled={!row.selected}
                                onChange={(e) => updateMedField(m.itemID, 'qtyPerTimes', e.target.value)}
                                style={{ width: '90%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center' }}
                              />
                            </td>

                            <td style={{ padding: '4px' }}>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <input placeholder="Inst." value={row.instruction || ''} disabled={!row.selected} onChange={(e) => updateMedField(m.itemID, 'instruction', e.target.value)} style={{ flex: 1, padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '11px' }} />
                                <input placeholder="Advice" value={row.advice || ''} disabled={!row.selected} onChange={(e) => updateMedField(m.itemID, 'advice', e.target.value)} style={{ flex: 1, padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '11px' }} />
                                <input placeholder="Diet" value={row.diet || ''} disabled={!row.selected} onChange={(e) => updateMedField(m.itemID, 'diet', e.target.value)} style={{ flex: 1, padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '11px' }} />
                              </Box>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </Grid>

            {/* Categorized Investigations */}
            <Grid item xs={12} lg={3}>
              <Paper variant="outlined" sx={{ height: '70vh', overflowY: 'auto', p: 1, borderRadius: '8px' }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#1976d2', fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 1 }}>
                  Investigations
                </Typography>
                {Object.entries(groupedTests).map(([group, tests]: any) => (
                  <Box key={group} sx={{ mb: 2.5 }}>
                    <Typography variant="caption" sx={{ bgcolor: '#e3f2fd', display: 'block', p: 0.8, fontWeight: 'bold', borderRadius: '4px', mb: 1, color: '#1565c0', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>
                      {group}
                    </Typography>
                    {tests.map((t: any) => (
                      <Box 
                        key={t.invParameterID} 
                        onClick={() => setTestStore(prev => ({ ...prev, [t.invParameterID]: !prev[t.invParameterID] }))}
                        sx={{ 
                          display: 'flex', alignItems: 'center', mb: 0.5, p: 0.5, 
                          borderRadius: '4px', cursor: 'pointer',
                          '&:hover': { bgcolor: '#f5f5f5' },
                          bgcolor: testStore[t.invParameterID] ? '#f0f7ff' : 'transparent'
                        }}
                      >
                        <Checkbox 
                          size="small" 
                          checked={!!testStore[t.invParameterID]} 
                          sx={{ p: 0.5 }}
                        />
                        <Typography sx={{ fontSize: '11.5px', color: testStore[t.invParameterID] ? '#1976d2' : '#333' }}>
                          {t.invName}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default InfraStructure;
