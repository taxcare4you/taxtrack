// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login"); // or "/dashboard" if you prefer
}