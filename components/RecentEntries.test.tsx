import React from "react";
import { render, wait } from "@testing-library/react-native";
import RecentEntries from "./RecentEntries";
import { MockedProvider } from "@apollo/react-testing";
import { ENTRIES_QUERY } from "../queries/queries";
import { EntryProvider } from "../state/entry-context";

describe("components/EntryPreview", () => {
  it("Matches snapshot", async () => {
    const date = new Date();
    const mocks = {
      request: {
        query: ENTRIES_QUERY,
        variables: {},
      },
      result: {
        data: {
          entries: [
            {
              __typename: "Entry",
              id: 1,
              title: "Buck",
              description: "This is a description",
              body: "this is the body",
              audioPath: "path/to/file",
              imagePath: "",
              updatedAt: date,
              createdAt: date,
              categories: [
                {
                  __typename: "Category",
                  id: 1,
                  name: "thoughts",
                  color: "#333",
                },
              ],
            },
          ],
        },
      },
    };
    const { baseElement } = render(
      <MockedProvider mocks={[mocks]} addTypename={true}>
        <EntryProvider>
          <RecentEntries />
        </EntryProvider>
      </MockedProvider>
    );
    await wait();
    expect(baseElement).toMatchSnapshot();
  });

  it("Should render loading", async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={[]}>
        <EntryProvider>
          <RecentEntries />
        </EntryProvider>
      </MockedProvider>
    );
    const loadingContainer = getByTestId("entries-loading");
    expect(loadingContainer).toBeTruthy();
    await wait();
  });

  it("Should render error ui", async () => {
    const mocks = {
      request: {
        query: ENTRIES_QUERY,
        variables: {},
      },
      error: new Error("Error geting entries"),
    };

    const { getByText } = render(
      <MockedProvider mocks={[mocks]}>
        <EntryProvider>
          <RecentEntries />
        </EntryProvider>
      </MockedProvider>
    );

    await wait();
    const errorMessage = getByText(
      "Error: Network error: Error geting entries"
    );
    expect(errorMessage).toBeTruthy();
  });

  it("Should render no recent entries text", async () => {
    const date = new Date();
    const mocks = {
      request: {
        query: ENTRIES_QUERY,
        variables: {},
      },
      result: {
        data: {
          entries: [],
        },
      },
    };

    const { getByText } = render(
      <MockedProvider mocks={[mocks]} addTypename={true}>
        <EntryProvider>
          <RecentEntries />
        </EntryProvider>
      </MockedProvider>
    );

    await wait();

    const element = getByText("No recent entries.");
    expect(element).toBeDefined();
  });
});
