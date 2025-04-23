import { zodResolver } from "@hookform/resolvers/zod";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
} from "mui-tiptap";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useNoteUpdate } from "../hooks/useNoteUpdate";
import { useNotesStore } from "../store/useNotesStore";

const noteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z.string().min(1, "Content is required"),
});

type NoteFormValues = z.infer<typeof noteSchema>;

const EditNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { note, addNote, updateNote, getNote } = useNotesStore();
  const { socket, latestContent } = useNoteUpdate(id);
  const { enqueueSnackbar } = useSnackbar();

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue("content", html);
    },
    editorProps: {
      handleDOMEvents: {
        paste: (view, event) => {
          const clipboardData = event.clipboardData as DataTransfer;
          const pastedContent = clipboardData?.getData("text/html");

          if (pastedContent) {
            if (editor) {
              editor.commands.insertContent(pastedContent); // Insert HTML directly
            }
          } else {
            if (editor) {
              editor.commands.insertContent(
                clipboardData.getData("text/plain")
              );
            }
          }

          event.preventDefault();
        },
      },
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (!id) return;
    getNote(id);
  }, [id, getNote]);

  useEffect(() => {
    if (!note) return;
    setValue("title", note.title);
    setValue("content", note.content);
    editor?.commands.setContent(note.content);
  }, [editor, setValue, note]);

  const onSubmit = (data: NoteFormValues) => {
    if (!id) {
      addNote({
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        timestamp: new Date().toISOString(),
      });
      enqueueSnackbar({
        message: "Note created successfully",
        variant: "success",
      });
    } else {
      updateNote(id!, data.title, data.content);
      socket?.emit("update-note", {
        noteId: id,
        content: data.content,
      });
      enqueueSnackbar({
        variant: "success",
        message: "Note updated successfully",
      });
    }
    navigate("/");
  };

  return (
    <Box p={0.5}>
      <Box mb={2} display="flex" gap={1} alignItems={"center"}>
        <IconButton onClick={() => navigate("/")} size="small">
          <KeyboardArrowLeftIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" component="h1">
          {id ? "Edit Note" : "Create New Note"}
        </Typography>
      </Box>
      <Box sx={{ pt: 2 }} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        <Controller
          name="content"
          control={control}
          render={() => (
            <RichTextEditorProvider editor={editor}>
              <RichTextField
                controls={
                  <MenuControlsContainer>
                    <MenuSelectHeading />
                    <MenuDivider />
                    <MenuButtonBold />
                    <MenuButtonItalic />
                    <MenuButtonUnderline />
                    <MenuButtonBulletedList />
                  </MenuControlsContainer>
                }
              />
              {errors.content && (
                <Box sx={{ color: "red", mt: 1 }}>{errors.content.message}</Box>
              )}
            </RichTextEditorProvider>
          )}
        />

        {latestContent && (
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: 2,
              backgroundColor: "#f9f9f9",
              marginTop: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="h6" gutterBottom>
                Latest Content:
              </Typography>
              <IconButton
                onClick={() => navigator.clipboard.writeText(latestContent)}
              >
                <ContentCopyIcon />
              </IconButton>
            </Box>
            <Typography dangerouslySetInnerHTML={{ __html: latestContent }} />
          </Box>
        )}

        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          {!id ? "Save" : "Update"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditNote;
