import { screen, within } from "@testing-library/react";

import { NavBar } from "@/components/shared/nav-bar";

import { renderWithProviders } from "../../render-with-providers";

describe("NavBar", () => {
  it("renders the shared navigation items and primary action", () => {
    // This smoke test stays on a client component so the harness remains a
    // good teaching example even after the /products route became async.
    renderWithProviders(
      <NavBar
        items={[
          { href: "#overview", label: "Overview" },
          { href: "#results", label: "Results" },
          { href: "#categories", label: "Categories" },
        ]}
        cta={{ href: "#results", label: "View results" }}
      />,
    );

    const desktopNav = screen.getByRole("navigation", { name: /^primary$/i });
    const mobileNav = screen.getByRole("navigation", { name: /^mobile primary$/i });

    expect(within(desktopNav).getByRole("link", { name: /^overview$/i })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("link", { name: /^results$/i })).toBeInTheDocument();
    expect(
      within(desktopNav).getByRole("link", { name: /^categories$/i }),
    ).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /^overview$/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /^results$/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /^categories$/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view results/i })).toHaveLength(2);
  });
});
