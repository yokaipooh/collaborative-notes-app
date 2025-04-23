import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/Card";
import { useNotesStore } from "../store/useNotesStore";

const Home: React.FC = () => {
  const notes = useNotesStore((state) => state.notes);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const totalCount = useNotesStore((state) => state.totalCount);
  const navigate = useNavigate();
  const parentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback(
    (id: string) => {
      deleteNote(id);
    },
    [deleteNote]
  );

  useEffect(() => {
    setLoading(true);
    fetchNotes().finally(() => setLoading(false));
  }, [fetchNotes]);

  const rowVirtualizer = useVirtualizer({
    count: notes ? notes.length : 0, // Check if notes is defined and has length
    getScrollElement: () => parentRef.current,
    estimateSize: () => 130,
    overscan: 10,
  });

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight ===
      e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom && notes.length < totalCount) {
      const nextPage = Math.floor(notes.length / 10);
      fetchNotes(10, nextPage * 10);
    }
  };

  return (
    <Box p={2}>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Notes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/new")}
        >
          Create New Note
        </Button>
      </Box>

      <Box
        ref={parentRef}
        onScroll={onScroll}
        sx={{
          height: "90vh",
          overflowY: "auto",
          paddingBottom: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: "relative",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          {rowVirtualizer.getVirtualItems().map(({ index, start }) => {
            const note = notes[index];
            return (
              <Box
                key={note.id}
                px={2}
                sx={{
                  position: "absolute",
                  top: start,
                  width: "100%",
                  boxSizing: "border-box",
                  "&:last-child": {
                    pb: "20px",
                  },
                }}
              >
                <NoteCard
                  id={note.id}
                  title={note.title}
                  content={note.content}
                  onDelete={handleDelete}
                />
              </Box>
            );
          })}
        </div>
      </Box>
    </Box>
  );
};

export default Home;
