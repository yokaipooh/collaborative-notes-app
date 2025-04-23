import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../src/pages/HomePage";
import { useNotesStore } from "../src/store/useNotesStore";
import React from "react";

// Mock Zustand store
jest.mock("../src/store/useNotesStore", () => ({
  useNotesStore: jest.fn(),
}));

// Mock @tanstack/react-virtual
jest.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: () => ({
    getVirtualItems: () => [
      { index: 0, start: 0 },
      { index: 1, start: 130 },
    ],
    getTotalSize: () => 260,
  }),
}));

const mockNotes = [
  { id: "1", title: "Note 1", content: "Content 1", timestamp: "2023-01-01" },
  { id: "2", title: "Note 2", content: "Content 2", timestamp: "2023-01-02" },
];

describe("HomePage", () => {
  const mockFetchNotes = jest.fn().mockImplementation(() => Promise.resolve());
  const mockDeleteNote = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock the implementation of useNotesStore
    (useNotesStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = {
        notes: mockNotes,
        totalCount: mockNotes.length,
        fetchNotes: mockFetchNotes,
        deleteNote: mockDeleteNote
      };
      return selector ? selector(store) : store;
    });

    // Mock ResizeObserver
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it("renders the Notes heading", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Notes/i)).toBeInTheDocument();
      expect(mockFetchNotes).toHaveBeenCalled();
    });
  });

  it("renders a list of notes", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Note 1")).toBeInTheDocument();
      expect(screen.getByText("Note 2")).toBeInTheDocument();
      expect(mockFetchNotes).toHaveBeenCalled();
    });
  });
});
