import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { create } from "zustand";

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

interface NotesStore {
  notes: Note[];
  note: Note | null;
  totalCount: number;
  setNote: (note: Note | null) => void;
  fetchNotes: (limit?: number, offset?: number) => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNote: (id: string) => Promise<void>;
}

export const useNotesStore = create<NotesStore>((set) => ({
  notes: [],
  totalCount: 0,
  note: null,
  setNote: (note) => set({ note }),
  fetchNotes: async (limit = 10, offset = 0) => {
    const response = await axios.get(`/api/notes?limit=${limit}&offset=${offset}`);
    const { notes, totalCount } = response.data;

    set((state) => ({
      notes: offset === 0 ? notes : [...state.notes, ...notes],
      totalCount,
    }));
  },
  addNote: async (note) => {
    const response = await axios.post("/api/notes", note);
    set((state) => ({ notes: [...state.notes, response.data] }));
  },
  updateNote: async (id, title, content) => {
    const response = await axios.put(`/api/notes/${id}`, { title, content });
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, content: response.data.content, title: response.data.title } : note
      ),
    }));
  },
  getNote: async (id) => {
    const response = await axios.get(`/api/notes/${id}`);
    set(() => ({ note: response.data }));
  },
  deleteNote: async (id) => {
    await axios.delete(`/api/notes/${id}`);
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
    enqueueSnackbar({
      message: "Note deleted successfully",
      variant: "success",
    });
  },
}));