import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { type ReactElement, useEffect, useRef } from "react";

interface FancyboxProps {
  delegate?: string;
  options?: Record<string, unknown>;
  children: ReactElement;
}

export default function Fancybox(props: FancyboxProps) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const delegate = props.delegate || "[data-fancybox]";
    const options = props.options || {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    NativeFancybox.bind(container, delegate, options);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      NativeFancybox.unbind(container);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      NativeFancybox.close();
    };
  });

  return <div ref={containerRef}>{props.children}</div>;
}
