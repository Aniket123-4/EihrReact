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
    Checkbox
} from "@mui/material";
import React, { useState } from "react";
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
import TranslateTextField from "../../../TranslateTextField";
type Props = {};


const unitOptions = [
    { value: 'JobCardCreate', label: 'On Job Card Creation' },
    { value: 'JobCardComplete', label: 'On Job Card Completion' },
    { value: 'OutsourceServiceDelay', label: 'On Outsource Service Delay Reminder' },

];

const CreatemaileventForm = (props: Props) => {
   
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
    const Userid = getId();


    const formik = useFormik({
        initialValues: {
            "eventId": 0,
            "eventName": "",
            "eventType": "",
            "sendingType": "",
            "message": "",
            "isActive": true || false,
            "createdBy":Userid,
            "updatedBy": "",
            "createdOn": defaultValues,
            "updatedOn": defaultValues,
            "srn": 0
        },
        validationSchema: Yup.object({
            eventName: Yup.string()
                .required("Event Name is required")
                .min(2, "Event Name must be at least 2 characters")
                .max(50, "Event Name cannot exceed 50 characters"),

        }),

        onSubmit: async (values) => {
            values.message = editorContent;
            const response = await api.post(`/Comm/UpsertEventSetting`, values);
            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/emailsystem/eventmaster");
            } else {
                setToaster(true);
                toast.error(response.data.message);
            }
        },
    });

    const handleSubmitWrapper = async () => {
        // alert('btn call');
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
                                {t("text.AddEmaileventsetting")}
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
                        <Grid item xs={12} container spacing={2}>
                            {/* <Grid item lg={3} md={6} xs={12}>
                                <TextField
                                    id="eventName"
                                    name="eventName"
                                    label={
                                        <CustomLabel text={t("text.Emaileventname")} required={true} />
                                    }
                                    value={formik.values.eventName}
                                    placeholder={t("text.Emaileventname")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid> */}

                            <Grid item xs={12} sm={4} lg={4}>
                                <TranslateTextField
                                    label={t("text.Emaileventname")}
                                    value={formik.values.eventName}
                                    onChangeText={(text: string) => formik.setFieldValue("eventName", text)}
                                    required={true}
                                    lang={lang}
                                />
                                {formik.touched.eventName && formik.errors.eventName ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.eventName}
                                    </div>
                                ) : null}
                            </Grid>

                            {/* <Grid item xs={12} sm={4} lg={4}>
  <TextField
    label={t("text.Emaileventname")}
    value={formik.values.eventName}
    onChange={formik.handleChange}
    required={true}
    fullWidth
    size="small"
  />
  {formik.touched.eventName && formik.errors.eventName ? (
    <div style={{ color: "red", margin: "5px" }}>
      {formik.errors.eventName}
    </div>
  ) : null}
</Grid> */}


                            <Grid item lg={4} xs={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={unitOptions}
                                    fullWidth
                                    size="small"
                                    onChange={(event: any, newValue: any) => {
                                        formik.setFieldValue("eventType", newValue?.value.toString());
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<CustomLabel text={t("text.Emaileventtype")} required={false} />}
                                        />
                                    )}
                                />
                            </Grid>



                            <Grid item lg={3} md={6} xs={12}>
                                <FormControlLabel
                                    id="isActive"
                                    name="isActive"
                                    value={formik.values.isActive}
                                    control={<Checkbox />} label={t("text.isActive")} />
                            </Grid>

                            <Grid item lg={12} md={12} xs={12} marginTop={2}>

                                <ReactQuill
                                    id="message"
                                    theme="snow"
                                    value={editorContent}
                                    onChange={handleEditorChange}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Enter your message here"
                                />
                            </Grid>

                            <Grid item lg={6} sm={6} xs={12}>
                                <Grid>
                                    <ButtonWithLoader
                                        buttonText={t("text.save")}
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

export default CreatemaileventForm;
