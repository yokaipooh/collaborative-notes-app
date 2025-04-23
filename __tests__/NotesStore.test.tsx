import axios from "axios";
import { act } from "react";
import { useNotesStore } from "../src/store/useNotesStore";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useNotesStore", () => {
  const mockNotes = [
    { id: "1", title: "Note 1", content: "Content 1", timestamp: "2023-01-01" },
  ];

  beforeEach(() => {
    // Reset the store state before each test
    useNotesStore.setState({ notes: [], totalCount: 0, note: null });
    
    mockedAxios.get.mockResolvedValue({
      data: {
        notes: mockNotes,
        totalCount: 1,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches notes and updates the store", async () => {
    await act(async () => {
      await useNotesStore.getState().fetchNotes();
    });

    // Get the latest state after the async operation
    const updatedState = useNotesStore.getState();
    expect(updatedState.notes).toEqual(mockNotes);
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/notes?limit=10&offset=0");
  });
});
