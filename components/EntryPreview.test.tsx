import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import EntryPreview from "./EntryPreview";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => {
    return {
      navigate: mockNavigate,
    };
  },
}));

describe("components/EntryPreview", () => {
  const props = {
    entry: {
      id: "1234",
      title: "My-Title",
      updatedAt: "2020-06-17T21:25:04.436Z",
      createdAt: "2020-06-17T21:25:04.436Z",
      description: "This is a description",
      body: "This is the body",
      categories: [
        { id: "1", name: "thoughts", color: "#c1c1c1" },
        { id: "2", name: "feelings", color: "#333333" },
      ],
      imagePath: "",
      audioPath: "some/local/path/to/audio/file",
    },
    index: 1,
  };

  it("Should match snapshot", () => {
    const { baseElement } = render(<EntryPreview {...props}></EntryPreview>);
    expect(baseElement).toMatchSnapshot();
  });

  it("Should render title", async () => {
    const { findByText } = render(<EntryPreview {...props}></EntryPreview>);
    const titleText = await findByText("My-Title");
    expect(titleText).toBeTruthy();
  });

  it("Should render formatted date", async () => {
    const { findByText } = render(<EntryPreview {...props}></EntryPreview>);
    const text = await findByText("Jun 17th, 2020");
    expect(text).toBeTruthy();
  });

  it("Should render description", async () => {
    const { findByText } = render(<EntryPreview {...props}></EntryPreview>);
    const text = await findByText("This is a description");
    expect(text).toBeTruthy();
  });

  it("Should render categories", async () => {
    const { findAllByTestId } = render(
      <EntryPreview {...props}></EntryPreview>
    );
    const categories = await findAllByTestId("category");
    expect(categories).toHaveLength(2);
  });

  // it("Should call navigate with proper route", async () => {
  //   const { baseElement, getByTestId } = render(
  //     <EntryPreview {...props}></EntryPreview>
  //   );
  //   await fireEvent.press(getByTestId("preview-button"));
  //   expect(mockNavigate).toHaveBeenCalledWith("EntryDetails", {
  //     entry: props.entry,
  //   });
  // });
});
