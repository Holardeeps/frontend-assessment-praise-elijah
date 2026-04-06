import { screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NavBar } from "@/components/shared/nav-bar";

import { renderWithProviders } from "../../render-with-providers";

describe("NavBar", () => {
  it("renders the shared navigation items and primary action", async () => {
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

    const user = userEvent.setup();
    const desktopNav = screen.getByRole("navigation", { name: /^primary$/i });

    expect(within(desktopNav).getByRole("link", { name: /^overview$/i })).toBeInTheDocument();
    expect(within(desktopNav).getByRole("link", { name: /^results$/i })).toBeInTheDocument();
    expect(
      within(desktopNav).getByRole("link", { name: /^categories$/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: /^mobile primary$/i }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /open navigation menu/i }));

    const mobileNav = screen.getByRole("navigation", { name: /^mobile primary$/i });

    expect(within(mobileNav).getByRole("link", { name: /^overview$/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /^results$/i })).toBeInTheDocument();
    expect(within(mobileNav).getByRole("link", { name: /^categories$/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view results/i })).toHaveLength(2);

    const closingMenu = screen.getByRole("navigation", { name: /^mobile primary$/i });
    await user.click(screen.getByRole("button", { name: /close navigation menu/i }));
    await waitForElementToBeRemoved(closingMenu);
  });

  it("returns focus to the hamburger button when the mobile nav closes with escape", async () => {
    const user = userEvent.setup();

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

    const toggleButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });

    await user.click(toggleButton);

    expect(
      within(screen.getByRole("navigation", { name: /^mobile primary$/i })).getByRole(
        "link",
        { name: /^overview$/i },
      ),
    ).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(toggleButton).toHaveFocus();
  });
});
