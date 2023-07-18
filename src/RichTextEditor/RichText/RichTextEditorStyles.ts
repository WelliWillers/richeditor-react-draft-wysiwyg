import { grey } from "@mui/material/colors";
import { makeStyles } from "tss-react/mui";

const defaultFont = "Arial";

export const getOrMakeStyles = makeStyles()(() => ({
  messageBox: {
    display: "flex",
    flexDirection: "column",
  },
  editorBox: {
    border: "1px solid #C4C4C4",
    borderRadius: 3,
    "&:hover": {
      border: "1px solid #000000",
    },
  },
  editorBoxWithoutError: {
    "&:focus-within": {
      border: "1px solid #1976d2",
      outline: "1px solid #1976d2",

      "& .SyoRichEditor-Label": {
        color: "#1976d2",
      },
    },
  },
  editorBoxWithError: {
    border: "1px solid #F44336",
    "& .rdw-editor-toolbar": {
      borderTop: "1px solid #F44336!important",
    },

    "&:hover": {
      border: "1px solid #F44336",
      "& .rdw-editor-toolbar": {
        borderTop: "1px solid #F44336!important",
      },
    },
    "&:focus-within": {
      border: "1px solid #F44336",
      outline: "1px solid #F44336",
      "& .rdw-editor-toolbar": {
        borderTop: "1px solid #F44336!important",
      },
    },
    "& .SyoRichEditor-Label": {
      color: "#F44336",
      "& .rdw-editor-toolbar": {
        borderTop: "1px solid #F44336!important",
      },
    },
  },
  caption: {
    fontFamily: defaultFont,
    fontWeight: 400,
    fontSize: 12,
    letterSpacing: 0.15,
    color: "rgba(0, 0, 0, 0.54)",
    backgroundColor: "#fff",
    width: "fit-content",
    border: "1px solid transparent",
    whiteSpace: "nowrap",
    paddingLeft: 5,
    paddingRight: 5,
    position: "relative",
    top: -10,
    left: 8,
  },
  editorInput: {
    position: "relative",
    marginTop: -15,
    paddingBottom: 14,
  },
  editorConfiguration: {
    overflow: "scroll",
    maxHeight: 320,
    fontFamily: defaultFont,
    fontWeight: 400,
    fontSize: 14,
    color: grey[700],
    letterSpacing: 0.15,
    lineHeight: 1.5,
    minHeight: 100,
    border: "transparent",
    padding: 10,

    "& .public-DraftStyleDefault-block": {
      margin: "0!important",
    },

    "& .rdw-link-decorator-icon": {
      display: "none",
    },

    "& a": {
      textDecoration: "none",
      color: "#1236ff",
      backgroundColor: "#f0fbff",
      padding: "1px 2px",
      borderRadius: "2px",
    },
  },
  toolbarConfiguration: {
    cursor: "default",
    display: "flex!important",
    justifyContent: "end!important",
    alignItems: "center",
    borderTop: "1px solid #C4C4C4!important",
    borderLeft: "transparent!important",
    borderRight: "transparent!important",
    borderBottom: "transparent!important",
    borderRadius: "0px 0px 3px 3px!important",
    marginBottom: "-12px!important",
  },
  toolbarButtons: {
    border: "transparent!important",
    borderRadius: "50%!important",
    height: "25px !important",
    "&.rdw-option-active": {
      boxShadow: "none!important",
      backgroundColor: `${grey[200]} !important`,
    },
    "&:hover": {
      backgroundColor: `${grey[200]} !important`,
      boxShadow: "none!important",
    },
  },
  emojiPopup: {
    left: "initial!important",
    right: 1,
  },
  errorMessageRelativeToToolbar: {
    position: "absolute",
    bottom: -10,
    left: 10,
    right: 220,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    marginBottom: "-15px!important",
  },
  view: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  adjustErrorMessage: {
    fontFamily: defaultFont,
    paddingRight: 3,
    fontSize: 13,
    fontWeight: 400,
    letterSpacing: 0.15,
    color: "#F44336",
  },
  adjustTag: {
    fontFamily: defaultFont,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.15,
    color: "#2196F3",
    marginLeft: 2,
    cursor: "pointer",
    textOverflow: "ellipsis",
    overflow: "hidden",
    flexShrink: 1,
  },
}));
