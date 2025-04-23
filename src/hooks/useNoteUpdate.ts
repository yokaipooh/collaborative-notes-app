import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

interface NoteUpdate {
  noteId: string;
  content: string;
}

export const useNoteUpdate = (noteId: string | undefined) => {
  const socket = useSocket(); // Use the reusable socket connection
  const [isBeingUpdated, setIsBeingUpdated] = useState(false);
  const [latestContent, setLatestContent] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !noteId) return;

    socket.emit("join-note", noteId);

    const handleNoteUpdate = (update: NoteUpdate) => {
      if (update.noteId === noteId) {
        setIsBeingUpdated(true);
        setLatestContent(update.content);
        enqueueSnackbar({
          message: "Note is being updated by another user",
          variant: "info",
        });
      }
    };

    socket.on("receive-update", handleNoteUpdate);

    return () => {
      socket.off("receive-update", handleNoteUpdate);
    };
  }, [socket, noteId]);

  return { socket, isBeingUpdated, latestContent };
};