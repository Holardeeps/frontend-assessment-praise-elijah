import { useQueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { QueryProvider } from "@/components/providers/query-provider";

function QueryProviderProbe() {
  const queryClient = useQueryClient();

  return <p>{queryClient ? "query provider ready" : "query provider missing"}</p>;
}

describe("QueryProvider", () => {
  it("provides a query client to app children", () => {
    render(
      <QueryProvider>
        <QueryProviderProbe />
      </QueryProvider>,
    );

    expect(screen.getByText(/query provider ready/i)).toBeInTheDocument();
  });
});
