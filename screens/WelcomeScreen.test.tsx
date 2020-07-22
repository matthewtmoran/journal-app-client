import React from "react";
import WelcomeScreen from "./WelcomeScreen";
import { renderWithNavigation } from "../utils/testUtils";
import { fireEvent, render, act } from "@testing-library/react-native";

describe("WelcomeScreen", () => {
  const props = {
    navigation: {
      navigate: jest.fn(),
    },
  };
  it("Should match snapshot", async () => {
    const { baseElement } = render(<WelcomeScreen {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
