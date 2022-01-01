import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {createRef, SyntheticEvent, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {TextareaInput, TextInput} from "../../components/forms";
import InterfaceLink from "../../components/interface-link";
import StaticPage, {Header, SubHeader} from "../../components/typography";
import {ACTIVE_YEAR} from "../../data/constants/setup";
import Week from "../../data/core/Week";
import {RootState, WeeksState} from "../../store/state";
import {getIsEditor} from "../../utils/auth";
import {fetchWeeks, putWeeks} from "../../utils/connectors";
import NotFound from "../404";

interface WeekEditorProps {
  /**
   * The week number
   */
  week: number;

  /**
   * The parent state of the ephemeral frontend.
   */
  parentStateWeeks: Record<number, Week>;

  /**
   * The parent state copy of the backend.
   */
  parentBackendStateWeeks: Record<number, Week>;

  /**
   * A shared passed callback that can set week state in the parent.
   */
  parentSetter: (weeks: Record<number, Week>) => void;
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

  /**
   * Export a week and save it in the parent state.
   */
  const updateParentState = (): void => {
    if (!themeRef.current) {
      throw new Error("Theme ref doesn't point to anything.");
    }

    if (!descriptionRef.current) {
      throw new Error("Description ref doesn't point to anything.");
    }

    if (!isPublishedRef.current) {
      throw new Error("Published ref doesn't point to anything.");
    }

    const week: Week = {
      year: ACTIVE_YEAR,
      week: props.week,
      theme: themeRef.current?.value,
      information: descriptionRef.current?.value,
      isPublished: isPublishedRef.current?.checked,
      discordId: props.parentBackendStateWeeks[props.week]?.discordId || "",
    };

    const newWeeksMap: Record<number, Week> = JSON.parse(
      JSON.stringify(props.parentStateWeeks)
    );

    newWeeksMap[props.week] = week;

    props.parentSetter(newWeeksMap);
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
        blurCallback={updateParentState}
        initialValue={props.parentBackendStateWeeks[props.week]?.theme || ""}
      />

      <TextareaInput
        passedRef={descriptionRef}
        id={`week-${props.week}-description`}
        label={`Week ${props.week} Description`}
        blurCallback={updateParentState}
        initialValue={props.parentBackendStateWeeks[props.week]?.information || ""}
      />

      <div>
        <input
          ref={isPublishedRef}
          id={`week-${props.week}-isPublished`}
          type={"checkbox"}
          className={"mr-1 border-red-900"}
          defaultChecked={props.parentBackendStateWeeks[props.week]?.isPublished}
          onClick={
            (event: SyntheticEvent<HTMLInputElement, MouseEvent>) => {
              highlightPublished(event.currentTarget);

              updateParentState();
            }
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
  const {user, getAccessTokenSilently}: Auth0ContextInterface = useAuth0();
  const [weeks, setWeeks] = useState<Record<number, Week>>({});

  const isEditor = getIsEditor(user);

  // Handle the weeks cache.

  const dispatch = useDispatch();
  const weeksData: WeeksState = useSelector(
    (state: RootState) => state.weeksData,
  );

  // Set up state.

  useEffect(() => {
    // Start by fetching the week. This is mandatory every time for an admin user.

    if (user) {
      getAccessTokenSilently().then(
        (token: string) => fetchWeeks(dispatch, weeksData, token, isEditor)
      );
    } else {
      fetchWeeks(dispatch, weeksData, undefined, isEditor);
    }

    // If things were fetched, set the default state. Otherwise, default to everything empty.

    if (Object.values(weeksData.weeks).length > 0) {
      setWeeks(weeksData.weeks);
    } else {
      const defaultState: Record<number, Week> = {};

      for (let i = 1; i <= 16; i++) {
        defaultState[i] = {
          year: ACTIVE_YEAR,
          week: i,
          theme: "",
          information: "",
          isPublished: false,
          discordId: "",
        };
      }

      setWeeks(defaultState);
    }
  }, []);

  let response = <NotFound />;
  if (isEditor) {
    // Turn the weeks into an ordered list.

    const weeksInOrder: Week[] = Object.values(weeks).sort(
      (weekA: Week, weekB: Week) => {
        if (weekA.week < weekB.week) {
          return -1;
        } else if (weekA.week > weekB.week) {
          return 1;
        }

        return 0;
      }
    );

    response = (
      <StaticPage>
        <Header>Editing Weeks</Header>

        <InterfaceLink location={"/weeks"} title={"View Weeks"} nextLink />

        {
          weeksInOrder.map(
            (week: Week) => {
              return <WeekEditor
                key={`week-${week.week}`}
                week={week.week}
                parentSetter={setWeeks}
                parentStateWeeks={weeks}
                parentBackendStateWeeks={weeksData.weeks}
              />;
            }
          )
        }

        <InterfaceLink
          location={"#"}
          title={"Submit"}
          clickBack={async () => {
            putWeeks(dispatch, weeksData, await getAccessTokenSilently(), weeks).then(
              () => alert("Good to go!"),
            ).catch(
              (error: Error) => {
                alert(
                  `Caught an error:\n\n\`\`\`txt\n${error}\n\`\`\`\n\nPlease report this to ` +
                  "papapastry#888 on Discord!"
                );
              }
            );
          }}
        />
      </StaticPage>
    );
  }

  return response;
};

export default Edit;
