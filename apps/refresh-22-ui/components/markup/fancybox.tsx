import "@fancyapps/ui/dist/fancybox.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Fancybox as NativeFancybox } from "@fancyapps/ui/dist/fancybox.umd.js";
import { type ReactElement, useEffect } from "react";

interface FancyboxProps {
  delegate?: string;
  options?: Record<string, unknown>;
  children: ReactElement;
}

export default function Fancybox(props: FancyboxProps) {
  const delegate = props.delegate || "[data-fancybox]";

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    NativeFancybox.bind(delegate, props.options || {});

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      NativeFancybox.destroy();
    };
  }, [delegate, props.options]);

  return <>{props.children}</>;
}
