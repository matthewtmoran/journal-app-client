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

  it("Log In Button should navigate to Sign In page", async () => {
    const { getByText } = renderWithNavigation(<WelcomeScreen {...props} />);
    const button = getByText("Log In");
    await act(async () => {
      fireEvent.press(button);
    });
    expect(props.navigation.navigate).toBeCalledWith("Sign In");
  });

  it("Register button should navigate to Sign Up page", async () => {
    const { getByText } = renderWithNavigation(<WelcomeScreen {...props} />);
    const button = getByText("Register");
    await act(async () => {
      fireEvent.press(button);
    });
    expect(props.navigation.navigate).toBeCalledWith("Sign Up");
  });
});
