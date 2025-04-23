import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EditNote from "../src/pages/EditNotePage";
import { useNotesStore } from "../src/store/useNotesStore";
import React from "react";

// Mock Zustand store
jest.mock("../src/store/useNotesStore", () => ({
  useNotesStore: jest.fn(),
}));

// Mock TipTap editor with all required methods
jest.mock("@tiptap/react", () => ({
  useEditor: () => ({
    commands: {
      setContent: jest.fn(),
      insertContent: jest.fn(),
    },
    isActive: jest.fn().mockReturnValue(false),
    getHTML: jest.fn().mockReturnValue(""),
    chain: () => ({
      focus: () => ({
        run: jest.fn(),
      }),
    }),
    can: () => ({
      chain: () => ({
        focus: () => ({
          run: jest.fn(),
        }),
      }),
    }),
  }),
}));

// Mock mui-tiptap to avoid rendering actual editor components
jest.mock("mui-tiptap", () => ({
  RichTextEditorProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  RichTextField: () => <div data-testid="rich-text-editor">Rich Text Editor</div>,
  MenuControlsContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  MenuSelectHeading: () => <div>Heading Select</div>,
  MenuDivider: () => <div>Divider</div>,
  MenuButtonBold: () => <div>Bold</div>,
  MenuButtonItalic: () => <div>Italic</div>,
  MenuButtonUnderline: () => <div>Underline</div>,
  MenuButtonBulletedList: () => <div>Bulleted List</div>,
}));

describe("EditNotePage", () => {
  const mockUpdateNote = jest.fn();
  const mockAddNote = jest.fn();
  const mockGetNote = jest.fn();

  beforeEach(() => {
    (useNotesStore as unknown as jest.Mock).mockReturnValue({
      note: { id: "1", title: "Note 1", content: "Content 1" },
      getNote: mockGetNote,
      addNote: mockAddNote,
      updateNote: mockUpdateNote,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Edit Note heading when editing", () => {
    render(
      <MemoryRouter initialEntries={['/edit/1']}>
        <Routes>
          <Route path="/edit/:id" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Edit Note/i)).toBeInTheDocument();
  });

  it("renders the Create New Note heading when creating", () => {
    render(
      <MemoryRouter initialEntries={['/new']}>
        <Routes>
          <Route path="/new" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Create New Note/i)).toBeInTheDocument();
  });

  it("renders the note title and content", () => {
    render(
      <MemoryRouter initialEntries={['/edit/1']}>
        <Routes>
          <Route path="/edit/:id" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue("Note 1")).toBeInTheDocument();
    expect(screen.getByTestId("rich-text-editor")).toBeInTheDocument();
  });
});
