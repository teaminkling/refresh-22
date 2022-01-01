import {createRef, SyntheticEvent, useEffect} from "react";
import {TextareaInput, TextInput} from "../../components/forms";
import InterfaceLink from "../../components/interface-link";
import StaticPage, {Header, SubHeader} from "../../components/typography";
import {ACTIVE_YEAR} from "../../data/constants/setup";
import Week from "../../data/core/Week";

interface WeekEditorProps {
  /**
   * The week number
   */
  week: number;

  /**
   * A passed callback that can set week state in the parent.
   */
  valueCallback?: (week: Week) => void;
}

/**
 * An editor group for an entire week.
 *
 * @param {WeekEditorProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
const WeekEditor = (props: WeekEditorProps) => {
  const themeRef = createRef<HTMLInputElement>();
  const descriptionRef = createRef<HTMLTextAreaElement>();
  const isPublishedRef = createRef<HTMLInputElement>();

  // TODO: Write so it accepts default values

  /**
   * Export a week.
   *
   * @returns {Week} a week
   */
  const exportWeek = (): Week => {
    if (!themeRef.current) {
      throw new Error("Theme ref doesn't point to anything.");
    }

    if (!descriptionRef.current) {
      throw new Error("Description ref doesn't point to anything.");
    }

    if (!isPublishedRef.current) {
      throw new Error("Published ref doesn't point to anything.");
    }

    return {
      year: ACTIVE_YEAR,
      week: props.week,
      timestamp: new Date().toISOString(),
      theme: themeRef.current?.value,
      information: descriptionRef.current?.value,
      isPublished: isPublishedRef.current?.checked,
    };
  };

  /**
   * Add a green highlight to the target if the published input is checked.
   *
   * @param {HTMLInputElement} target the HTML input target with a parent
   */
  const highlightPublished = (target: HTMLInputElement): void => {
    if (target.checked) {
      const parent: HTMLElement | null = target.parentElement;
      if (parent) {
        parent.className = "pl-4 p-2 rounded-2xl bg-green-100";
      }
    } else {
      const parent: HTMLElement | null = target.parentElement;
      if (parent) {
        parent.className = "pl-4 p-2";
      }
    }
  };

  useEffect(() => {
    if (isPublishedRef.current) {
      highlightPublished(isPublishedRef.current);
    }
  }, [isPublishedRef.current]);

  return (
    <div className={"py-4"}>
      <SubHeader>Week {props.week}</SubHeader>

      <TextInput
        passedRef={themeRef}
        id={`week-${props.week}-title`}
        label={`Week ${props.week} Theme`}
      />
      <TextareaInput
        passedRef={descriptionRef}
        id={`week-${props.week}-description`}
        label={`Week ${props.week} Description`}
      />

      <div>
        <input
          ref={isPublishedRef}
          id={`week-${props.week}-isPublished`}
          type={"checkbox"}
          className={"mr-1 border-red-900"}
          onClick={
            (event: SyntheticEvent<HTMLInputElement, MouseEvent>) => highlightPublished(
              event.currentTarget,
            )
          }
        /> Is Published
      </div>
    </div>
  );
};

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const Edit = (): JSX.Element => {
  const weeks: number[] = [];

  for (let i = 0; i < 16; i++) {
    weeks.push(i + 1);
  }

  return (
    <StaticPage>
      <Header>Editing Weeks</Header>

      <InterfaceLink location={"/weeks"} title={"View Weeks"} nextLink />

      {
        weeks.map(
          (week: number) => <WeekEditor key={`week-${week}`} week={week} />
        )
      }
    </StaticPage>
  );
};

export default Edit;
