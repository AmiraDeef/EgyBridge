import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../../assets/logo-Photoroom.png";

/**
 * Shared EGI RISES logo image
 *
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Sizing preset
 * @param {'horizontal' | 'vertical' | 'markOnly'} [props.variant='horizontal'] - Layout orientation
 * @param {'default' | 'white' | 'gold'} [props.theme='default'] - Color theme
 * @param {boolean} [props.asLink=true] - Wrap in a React Router Link to "/"
 * @param {string} [props.className=''] - Additional container classes
 */
export default function Logo({
  size = "md",
  variant = "horizontal",
  theme = "default",
  asLink = true,
  className = "",
}) {
  const sizeClass =
    {
      sm: "-my-3 h-14 w-auto",
      md: "-my-6 h-28 w-auto",
      lg: "-my-7 h-32 w-auto",
    }[size] || "-my-6 h-28 w-auto";

  const variantClass = variant === "vertical" ? "flex-col" : "flex-row";
  const themeClass = theme === "white" ? "brightness-0 invert" : "";

  const content = (
    <div className={`flex items-center ${variantClass} ${className}`}>
      <img
        src={logoImage}
        alt="EGI RISES"
        className={`${sizeClass} ${themeClass} object-contain transition-transform duration-300 group-hover:scale-105`}
      />
    </div>
  );

  if (asLink) {
    return (
      <Link
        to="/"
        className="group inline-flex items-center no-underline focus:outline-none"
      >
        {content}
      </Link>
    );
  }

  return content;
}
