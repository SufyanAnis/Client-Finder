"use client";

// Shown only in the owner's browser (flag set on login / when /agent opens) —
// visitors never see a link to the private agent.
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OwnerLink({ className = "site" }) {
  const [owner, setOwner] = useState(false);
  useEffect(() => { try { setOwner(localStorage.getItem("fmc_owner") === "1"); } catch {} }, []);
  if (!owner) return null;
  return <Link className={className} href="/agent">🤖 Agent</Link>;
}
