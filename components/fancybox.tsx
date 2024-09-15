import "@fancyapps/ui/dist/fancybox.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {Fancybox as NativeFancybox} from "@fancyapps/ui/dist/fancybox.umd.js";
import {useEffect} from "react";

interface FancyboxProps {
  delegate?: string;
  options?: Record<string, unknown>;
  children: JSX.Element;
}

const Fancybox = (props: FancyboxProps) => {
  const delegate = props.delegate || "[data-fancybox]";

  useEffect(() => {
    NativeFancybox.bind(delegate, props.options || {});

    return () => {
      NativeFancybox.destroy();
    };
  }, []);

  return <>
    {props.children}
  </>;
};

export default Fancybox;
