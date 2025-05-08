import React from "react";
import { TextField } from "@mui/material";
import { ReactTransliterate } from "react-transliterate";

import { useTranslation } from "react-i18next";
import CustomLabel from "../CustomLable";

interface ReusableTextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  lang: string;
}

const TranslateTextField: React.FC<ReusableTextFieldProps> = ({
  label,
  value,
  onChangeText,
  required = false,
  lang,
}) => {
  const { t } = useTranslation();

  return (
    <TextField
      label={<CustomLabel text={label} required={required} />}
      variant="outlined"
      fullWidth
      size="small"
      InputProps={{
        inputComponent: ReactTransliterate as any,
        inputProps: {
          value: value,
          onChangeText: onChangeText,
          lang,
          placeholder: label,
          id: "react-transliterate-input",
        },
      }}
      sx={{
        "& .MuiInputBase-root": {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 400,
          fontSize: "1rem",
          lineHeight: "1.5em",
          letterSpacing: "0.00938em",
          color: "rgba(0, 0, 0, 0.87)",
          boxSizing: "border-box",
          cursor: "text",
          display: "block",
          width: "100%",
          borderRadius: "4px",
        },
        "& .MuiInputBase-input": {
          font: "inherit",
          letterSpacing: "inherit",
          color: "currentColor",
          padding: "8.5px 14px",
          border: 0,
          boxSizing: "content-box",
          //height: "1.5em",
          margin: 0,
          width: "93%",
          minWidth: 0,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          
          border: "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: "inherit",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#1976d2",
          },
        "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: "red",
        },
      }}
    />
  );
};

export default TranslateTextField;
