import { screen } from "@testing-library/react";

import ProductsPage from "@/app/products/page";

import { renderWithProviders } from "../render-with-providers";

describe("ProductsPage", () => {
  it("renders the temporary products shell content", () => {
    // This smoke test proves the Vitest + RTL harness can render our current
    // route shell before we move on to more interactive component tests later.
    renderWithProviders(<ProductsPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /see your product catalog the way an operations team needs it/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /see the product view/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(/filterable catalog/i)).toBeInTheDocument();
  });
});
