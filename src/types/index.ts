import { ReactNode } from "react";
import { EditorState } from "react-draft-wysiwyg";

export type TagProps = {
  field: string;
  name: string;
};

export type StatusProps = {
  text: string;
  tags?: TagProps[];
} | null;

export type RichTextProps = {
  initialConfigs: {
    title: string;
    description: string;
    key: string;
    defaultMessage: string;
    fields: TagProps[];
    message: string;
  };
};

export type RichTextContentProps = {
  children: ReactNode;
  scope: {
    caption: string;
    text: EditorState;
    variables?: TagProps[];
    status: {
      text: string;
      tags?: TagProps[];
    } | null;
    focus: boolean;
    onChanged: (p0: EditorState) => void;
  };
};
