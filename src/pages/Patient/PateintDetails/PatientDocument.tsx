import React, { useEffect, useState } from 'react';
import {
   Box, Grid, Typography, Paper, Button, IconButton, 
   Card, CardContent, CardActions, Divider, 
   CircularProgress, Dialog, DialogContent, DialogTitle,
   Tooltip, Avatar, useTheme
} from '@mui/material';
import { 
   CloudDownload as DownloadIcon, 
   Visibility as PreviewIcon,
   PictureAsPdf as PdfIcon,
   Image as ImageIcon, // <--- 'Image' ko 'ImageIcon' ke naam se import karein
   Description as FileIcon,
   Close as CloseIcon
} from '@mui/icons-material';
import api from '../../../utils/Url';
import { toast } from 'react-toastify';

const PatientDocument = ({ patientDetails = {} }: any) => {
   const theme = useTheme();
   const [docList, setDocList] = useState<any[]>([]);
   const [loading, setLoading] = useState(false);
   
   // Preview States
   const [previewOpen, setPreviewOpen] = useState(false);
   const [previewUrl, setPreviewUrl] = useState('');
   const [previewTitle, setPreviewTitle] = useState('');

   useEffect(() => {
      getPatientDoc();
   }, []);

   const getPatientDoc = async () => {
      try {
         const mainInfo = patientDetails?.result1?.[0];
         if (!mainInfo) return;

         const params = {
            "patientID": mainInfo.patientID,
            "patientCaseID": mainInfo.patientCaseID,
            "userID": -1,
            "formID": -1,
            "type": 1
         };
         setLoading(true);
         const res = await api.post('GetPatientDoc', params);
         if (res.data.isSuccess) {
            setDocList(res.data.result);
         }
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   };

   const handleAction = async (item: any, mode: 'preview' | 'download') => {
      try {
         const params = { fileName: item.phyName, filePath: "" };
         const res = await api.post('MasterForm/DownloadFile', params);

         if (res.data.isSuccess) {
            const base64Data = res.data.result;
            const fileExt = item.docExt.toLowerCase();

            if (mode === 'preview') {
               if (fileExt === 'pdf' || base64Data.startsWith("JVB")) {
                  // Open PDF in new tab
                  const pdfWindow = window.open("");
                  pdfWindow?.document.write(
                     `<iframe width='100%' height='100%' src='data:application/pdf;base64,${base64Data}'></iframe>`
                  );
               } else {
                  // Show Image in Dialog
                  setPreviewUrl(`data:image/${fileExt};base64,${base64Data}`);
                  setPreviewTitle(item.docName);
                  setPreviewOpen(true);
               }
            } else {
               // Download Logic
               const link = document.createElement('a');
               link.href = `data:application/octet-stream;base64,${base64Data}`;
               link.download = item.docName || `document.${fileExt}`;
               document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               toast.success("Download started...");
            }
         } else {
            toast.error("File not found on server");
         }
      } catch (e) {
         toast.error("Error processing file");
      }
   };

   const getFileIcon = (ext: string) => {
      const e = ext.toLowerCase();
      if (e === 'pdf') return <PdfIcon sx={{ fontSize: 40, color: '#f44336' }} />;
      if (['jpg', 'jpeg', 'png', 'gif'].includes(e)) return <ImageIcon sx={{ fontSize: 40, color: '#2196f3' }} />;
      return <FileIcon sx={{ fontSize: 40, color: '#757575' }} />;
   };

   return (
      <Box sx={{ p: 1 }}>
         <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileIcon color="primary" /> Patient Uploaded Documents
         </Typography>
         <Divider sx={{ mb: 3 }} />

         {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
         ) : (
            <Grid container spacing={3}>
               {docList.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.docID}>
                     <Card sx={{ 
                        borderRadius: 3, 
                        transition: '0.3s', 
                        '&:hover': { boxShadow: theme.shadows[10], transform: 'translateY(-5px)' },
                        border: '1px solid #eee'
                     }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
                           <Avatar variant="rounded" sx={{ width: 60, height: 60, bgcolor: '#f0f4ff' }}>
                              {getFileIcon(item.docExt)}
                           </Avatar>
                           <Box sx={{ overflow: 'hidden' }}>
                              <Typography variant="subtitle2" noWrap fontWeight="bold">
                                 {item.docName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" display="block">
                                 Type: {item.docTypeName}
                              </Typography>
                              <Chip label={item.docExt.toUpperCase()} size="small" sx={{ height: 16, fontSize: '10px', mt: 0.5 }} />
                           </Box>
                        </CardContent>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                           <Button 
                              size="small" 
                              startIcon={<PreviewIcon />} 
                              onClick={() => handleAction(item, 'preview')}
                           >
                              Preview
                           </Button>
                           <Tooltip title="Download File">
                              <IconButton color="primary" size="small" onClick={() => handleAction(item, 'download')}>
                                 <DownloadIcon fontSize="small" />
                              </IconButton>
                           </Tooltip>
                        </CardActions>
                     </Card>
                  </Grid>
               ))}
               {docList.length === 0 && (
                  <Grid item xs={12}>
                     <Paper sx={{ p: 5, textAlign: 'center', bgcolor: '#fafafa' }}>
                        <Typography color="textSecondary">No documents found for this patient.</Typography>
                     </Paper>
                  </Grid>
               )}
            </Grid>
         )}

         {/* IMAGE PREVIEW DIALOG */}
         <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               {previewTitle}
               <IconButton onClick={() => setPreviewOpen(false)}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ textAlign: 'center', bgcolor: '#333' }}>
               <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} 
               />
            </DialogContent>
         </Dialog>
      </Box>
   );
};

export default PatientDocument;
