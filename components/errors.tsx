import {faFrownOpen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ValidationError, ValidationErrorItem} from "joi";
import {ListItem, UnorderedList} from "./typography";

/**
 * The props for response messages.
 */
interface ResponseMessagesProps {
  /**
   * The validation errors.
   */
  errors: ValidationError[];

  /**
   * A special message that appears below the error indicator.
   */
  specialMessage?: JSX.Element;

  /**
   * The type of everything that can be invalid, e.g., "URI".
   */
  validityType?: string;
}

/**
 * A custom JSX element on form send that either contains errors or doesn't.
 *
 * Note: don't forget to clear these elements when re-sending.
 *
 * @param {ResponseMessagesProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
export const ResponseMessages = (
  props: ResponseMessagesProps
) => {
  const validityMessage = (
    props.validityType ? `is not a valid ${props.validityType}` : "is invalid"
  );

  const errorElements: JSX.Element[] = [];
  props.errors.forEach(
    (error: ValidationError) => {
      if (error.details) {
        error.details.forEach(
          (detail: ValidationErrorItem) => {
            const attemptedValue: string | undefined = detail.context?.value;

            let message = <p>{detail.message}</p>;
            if (attemptedValue && attemptedValue.length > 0) {
              message = <p>
                <b>{attemptedValue}</b> {validityMessage}!
              </p>;
            }

            errorElements.push(
              <ListItem key={detail.message}>
                {message}
              </ListItem>
            );
          }
        );
      } else {
        errorElements.push(
          <ListItem key={error.message}>
            {error.message}
          </ListItem>
        );
      }
    }
  );

  return <div className={"pt-8"}>
    {errorElements.length > 0 ? (
      <>
        <b className={"text-red-600"}>
          <FontAwesomeIcon icon={faFrownOpen} fixedWidth className={"ml-2"} /> There were errors!
        </b>

        {
          props.specialMessage ? <div className={"pt-3"}>
            {props.specialMessage}
          </div> : <></>
        }

      </>
    ) : <p className={"text-green-800"}>
      Success!
    </p>}
    {errorElements.length > 0 ? <UnorderedList>{errorElements}</UnorderedList> : <></>}
  </div>;
};
