import React from "react";
import LogoComponent from "../common/Logo";

/**
 * Auth Card Brand Header
 * Reuses the official high-resolution vector emblem in a centered vertical format.
 */
export default function Logo({ className = "" }) {
  return (
    <div className={`flex flex-col items-center lg:items-start ${className}`}>
      <LogoComponent size="lg" variant="horizontal" asLink={false} />
    </div>
  );
}
