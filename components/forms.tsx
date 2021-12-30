/**
 * Reusable form components.
 */

import {RefObject} from "react";

/**
 * Props for a styled text input box.
 */
interface TextInputProps {
  /**
   * The passed reference to the child input.
   */
  passedRef: RefObject<HTMLInputElement>;

  /**
   * The ID and name of a text input.
   */
  id: string;

  /**
   * The ID and name of a text input.
   */
  placeholder?: string;

  /**
   * The initial value.
   */
  initialValue?: string;

  /**
   * The text of the label.
   */
  label?: string;
}

/**
 * A styled text input box.
 *
 * @param {TextInputProps} props the props
 * @returns {JSX.Element} the elements
 * @constructor
 */
export const TextInput = (props: TextInputProps): JSX.Element => {
  return (
    <>
      {
        props.label ?
          <label className={"block text-gray-700 text-sm font-bold mb-2"} htmlFor={props.id}>
            {props.label}
          </label> : <></>
      }

      <input
        ref={props.passedRef}
        id={props.id}
        name={props.id}
        placeholder={props.placeholder}
        type={"text"}
        className={
          "shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight"
        }
        defaultValue={props.initialValue}
      />
    </>
  );
};

/**
 * Props for a styled text input box.
 */
interface TextAreaProps {
  /**
   * The passed reference to the child input.
   */
  passedRef: RefObject<HTMLTextAreaElement>;

  /**
   * The ID and name of a text input.
   */
  id: string;

  /**
   * The ID and name of a text input.
   */
  placeholder?: string;

  /**
   * The initial value.
   */
  initialValue?: string;

  /**
   * The text of the label.
   */
  label?: string;
}

/**
 * A styled textarea box.
 *
 * @param {TextAreaProps} props the props
 * @returns {JSX.Element} the elements
 * @constructor
 */
export const TextareaInput = (props: TextAreaProps): JSX.Element => {
  return (
    <>
      {
        props.label ?
          <label className={"block text-gray-700 text-sm font-bold mb-2"} htmlFor={props.id}>
            {props.label}
          </label> : <></>
      }

      <textarea
        ref={props.passedRef}
        id={props.id}
        name={props.id}
        placeholder={props.placeholder}
        rows={6}
        className={
          "shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight"
        }
        defaultValue={props.initialValue}
      />
    </>
  );
};
