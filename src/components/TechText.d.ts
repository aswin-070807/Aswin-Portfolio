import type { ComponentType, CSSProperties } from "react";

export interface TechTextProps {
  text?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: number;
  letterSpacing?: number;
  color?: string;
  accentColor?: string;
  align?: "left" | "center" | "right";
  reach?: number;
  softness?: number;
  lineStyle?: "solid" | "dashed" | "dotted";
  dashLength?: number;
  dashGap?: number;
  strokeWidth?: number;
  specks?: number;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  bounce?: number;
  clickKick?: boolean;
  intro?: "assemble" | "type" | "none";
  introDuration?: number;
  guides?: boolean;
  sweep?: boolean;
  speed?: number;
  reveal?: "letter" | "word" | "none";
  className?: string;
  style?: CSSProperties;
}

declare const TechText: ComponentType<TechTextProps>;
export default TechText;
