import React from "react";
import UnAuthentitcatedApp from "./UnAuthenticatedApp";
import { renderWithNavigation } from "../utils/testUtils";

describe("UnAuthentitcatedApp", () => {
  it("Should render welcome screen by default", async () => {
    const { findByText, baseElement } = renderWithNavigation(
      <UnAuthentitcatedApp />
    );
    const welcomeText = await findByText("Welcome To Journal App β");
    expect(welcomeText).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
