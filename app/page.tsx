import { redirect } from "next/navigation";

// This root route now exists only to send users into the real products entry
// point, keeping the URL structure aligned with the assessment.
export default function Home() {
  redirect("/products");
}
