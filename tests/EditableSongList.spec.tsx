import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditableSongList } from "../src/components/EditableSongList";

describe("EditableSongList Component", () => {
    const mockSetSongs = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders Add Song button", () => {
        render(<EditableSongList songs={[]} setSongs={mockSetSongs} />);

        expect(
            screen.getByRole("button", { name: /add song/i }),
        ).toBeInTheDocument();
    });

    test("clicking Add Song calls setSongs with a new empty song", () => {
        render(<EditableSongList songs={["first"]} setSongs={mockSetSongs} />);

        userEvent.click(screen.getByRole("button", { name: /add song/i }));

        expect(mockSetSongs).toHaveBeenCalledWith(["first", ""]);
    });

    test("renders each song as an editable input", () => {
        render(<EditableSongList songs={["A", "B"]} setSongs={mockSetSongs} />);

        const inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBe(2);
        expect(inputs[0]).toHaveValue("A");
        expect(inputs[1]).toHaveValue("B");
    });

    test("typing in a song input updates that song index", () => {
        render(<EditableSongList songs={["A"]} setSongs={mockSetSongs} />);

        const input = screen.getByRole("textbox");

        userEvent.clear(input);
        userEvent.type(input, "Updated!");

        expect(mockSetSongs).toHaveBeenCalledWith(["Updated!"]);
    });

    test("delete button removes the correct song", () => {
        render(
            <EditableSongList
                songs={["A", "B", "C"]}
                setSongs={mockSetSongs}
            />,
        );

        const deleteButtons = screen.getAllByRole("button", { name: "❌" });

        userEvent.click(deleteButtons[1]);

        expect(mockSetSongs).toHaveBeenCalledWith(["A", "C"]);
    });

    test("add → edit → delete flow works in order", () => {
        render(<EditableSongList songs={["start"]} setSongs={mockSetSongs} />);

        userEvent.click(screen.getByRole("button", { name: /add song/i }));
        expect(mockSetSongs).toHaveBeenCalledWith(["start", ""]);

        mockSetSongs.mockClear();
        render(
            <EditableSongList songs={["start", ""]} setSongs={mockSetSongs} />,
        );

        const secondInput = screen.getAllByRole("textbox")[1];
        userEvent.type(secondInput, "New Song");

        expect(mockSetSongs).toHaveBeenCalledWith(["start", "New Song"]);

        mockSetSongs.mockClear();
        const deleteButtons = screen.getAllByRole("button", { name: "❌" });
        userEvent.click(deleteButtons[0]);

        expect(mockSetSongs).toHaveBeenCalledWith(["New Song"]);
    });
});
