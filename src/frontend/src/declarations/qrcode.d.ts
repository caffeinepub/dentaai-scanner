declare module "qrcode.react" {
  import type { RefObject } from "react";
  interface QRCodeCanvasProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: "L" | "M" | "Q" | "H";
    marginSize?: number;
    ref?: RefObject<HTMLCanvasElement | null>;
    [key: string]: unknown;
  }
  export const QRCodeCanvas: React.ForwardRefExoticComponent<
    QRCodeCanvasProps & React.RefAttributes<HTMLCanvasElement>
  >;
}
