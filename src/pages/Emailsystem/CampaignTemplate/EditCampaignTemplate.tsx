import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    Grid,
    Divider, Table,
    MenuItem,
    TextField,
    Typography,
    TextareaAutosize,
    FormGroup,
    FormControlLabel,
    Box,
    Radio,
    Select,
    RadioGroup,
    Checkbox,
    FormControl
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import selecteddata from "../dpdata";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import HOST_URL1 from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import { Language } from "react-transliterate";
import Languages from "../../../Languages";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import DeleteIcon from '@mui/icons-material/Delete';
import { getISTDate, getId } from '../../../utils/Constant'
import api from "../../../utils/Url";
type Props = {};


// const unitOptions = [
//     { value: 'JobCardCreate', label: 'On Job Card Creation' },
//     { value: 'JobCardComplete', label: 'On Job Card Completion' },
//     { value: 'OutsourceServiceDelay', label: 'On Outsource Service Delay Reminder' },

// ];

const EditCampagianTemplate = (props: Props) => {

    const location = useLocation();
    const UserId = getId();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [lang, setLang] = useState<Language>("en");
    const [selectedValue, setSelectedValue] = useState('');
    const { defaultValues } = getISTDate();
    const [toaster, setToaster] = useState(false);
    const [TypeOption, setTypeOption] = useState([{ value: "-1", label: t("text.Type") }]);
    const [editorContent, setEditorContent] = useState<string>("");

    const handleEditorChange = (content: any) => {
        setEditorContent(content);
    };

    useEffect(() => {
        // Set the editor content to the message from location state when the component mounts
        if (location.state.template) {
            setEditorContent(location.state.template);
        }
    }, [location.state.template]);


    const formik = useFormik({
        initialValues: {
            "templateId": location.state.templateId,
            "template": location.state.template,
            "templateType": location.state.templateType,
            "smsTemplateID": location.state.smsTemplateID,
            "createdBy": "",
            "updatedBy": UserId,
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            "srno": 0
        },


        onSubmit: async (values) => {
            values.template = editorContent;
            const response = await api.post(`Comm/UpsertCampaignTemplate`, values);
            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/emailsystem/CampaignTemplate");
            } else {
                setToaster(true);
                toast.error(response.data.message);
            }
        },
    });

    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
    };

    const back = useNavigate();


    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    border: ".5px solid #FF7722",
                    marginTop: "3vh",
                }}
            >
                <CardContent>

                    <Grid item xs={12} container spacing={2} >
                        <Grid item lg={2} md={2} xs={2} marginTop={2}>
                            <Button
                                type="submit"
                                onClick={() => back(-1)}
                                variant="contained"
                                style={{
                                    backgroundColor: "blue",

                                    width: 20,
                                }}
                            >
                                <ArrowBackSharpIcon />
                            </Button>
                        </Grid>
                        <Grid item lg={7} md={7} xs={7} alignItems="center" justifyContent="center">
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ padding: "20px" }}
                                align="center"
                            >
                                {t("text.EditCampaignTemplate")}
                            </Typography>
                        </Grid>



                        <Grid item lg={3} md={3} xs={3} marginTop={3}>
                            <select
                                className="language-dropdown"
                                value={lang}
                                onChange={(e) => setLang(e.target.value as Language)}
                            >
                                {Languages.map((l) => (
                                    <option key={l.value} value={l.value}>
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                        </Grid>
                    </Grid>
                    <Divider />
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        {toaster === false ? "" : <ToastApp />}

                        <Grid container spacing={2}>
                        <Grid item xs={12} container spacing={2}>
                            
                            <Grid item xs={12} lg={8}>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        aria-label="templateType"
                                        name="templateType"
                                        value={formik.values.templateType}
                                        onChange={(event) => formik.setFieldValue("templateType", event.target.value)}
                                    >
                                        <FormControlLabel
                                            value="SMS"
                                            control={<Radio color="primary" />}
                                            label={t("text.SMS")}
                                            sx={{ marginLeft: 2 }}
                                        />
                                        <FormControlLabel
                                            value="EMAIL"
                                            control={<Radio color="primary" />}
                                            label={t("text.EMAIL")}
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        

                           
                            <Grid item lg={3} md={6} xs={12}>
                                <TextField
                                    id="smsTemplateID"
                                    name="smsTemplateID"
                                    label={
                                        <CustomLabel text={t("text.smsTemplateID")} required={false} />
                                    }
                                    value={formik.values.smsTemplateID}
                                    placeholder={t("text.smsTemplateID")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>

                            </Grid>
                           

                            <Grid item lg={12} md={12} xs={12} marginTop={2}>

                                <ReactQuill
                                    id="template"
                                    theme="snow"
                                    value={editorContent}
                                    onChange={handleEditorChange}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Enter your template here"
                                />
                            </Grid>

                            <Grid item lg={6} sm={6} xs={12}>
                                <Grid>
                                    <ButtonWithLoader
                                        buttonText={t("text.update")}
                                        onClickHandler={handleSubmitWrapper}
                                        fullWidth={true}
                                    />
                                </Grid>
                            </Grid>

                            <Grid item lg={6} sm={6} xs={12}>
                                <Button
                                    type="reset"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#F43F5E",
                                        color: "white",
                                        marginTop: "10px",
                                    }}
                                    onClick={(e: any) => formik.resetForm()}
                                >
                                    {t("text.reset")}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </div>
        </div>
    );
};

const modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link", "image", "video", "formula"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
    "formula",
    "code-block",
];

export default EditCampagianTemplate;
