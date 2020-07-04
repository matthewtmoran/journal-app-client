import React from "react";
import { render } from "@testing-library/react-native";
import DropDownMenu from "./DropDownMenu";

describe("components/DropDownMenu", () => {
  const props = {
    isVisible: false,
    hide: jest.fn(),
    items: [
      { label: "Edit", action: jest.fn() },
      {
        label: "Remove",
        action: jest.fn(),
      },
    ],
  };

  it("Should match snapshot", () => {
    const { baseElement } = render(<DropDownMenu {...props}></DropDownMenu>);
    expect(baseElement).toMatchSnapshot();
  });

  it("Should render items", async () => {
    const { findByText } = render(<DropDownMenu {...props}></DropDownMenu>);
    expect(findByText("Edit")).toBeTruthy();
    expect(findByText("Remove")).toBeTruthy();
  });
});
