/**
 * The submission form.
 */
import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {faAngleDown, faAngleRight, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ValidationError, ValidationResult} from "joi";
import {ChangeEvent, createRef, SyntheticEvent, useEffect, useState} from "react";
import {DragDropContext, Droppable, DroppableProvided, DropResult} from "react-beautiful-dnd";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import {ResponseMessages} from "../components/errors";
import FileItem, {FrontendFileItem} from "../components/file-item";
import {TextareaInput, TextInput} from "../components/forms";
import InterfaceLink from "../components/interface-link";
import StaticPage, {Header, Paragraph, SubHeader} from "../components/typography";
import {ACTIVE_YEAR} from "../data/constants/setup";
import Week from "../data/core/Week";
import Work, {WORK_SCHEMA} from "../data/core/Work";
import {ArtistsState, RootState, WeeksState} from "../store/state";
import {fetchArtists, fetchWeeks} from "../utils/connectors";
import NotFound from "./404";

/**
 * Re-order an item after dragging it.
 *
 * @param {FrontendFileItem[]} list the initial list
 * @param {number} startIndex the source index
 * @param {number} endIndex the destination index
 * @returns {FrontendFileItem[]} the result
 */
const reorder = (
  list: FrontendFileItem[], startIndex: number, endIndex: number
): FrontendFileItem[] => {
  const result: FrontendFileItem[] = list.slice();

  const [removed]: FrontendFileItem[] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

const dropHandler = (
  setState: (state: FrontendFileItem[]) => (void),
  state: FrontendFileItem[],
  result: DropResult
) => {
  const {source, destination} = result;

  if (!destination) {
    return;
  }

  setState(reorder(state, source.index, destination.index));
};

const SubmissionForm = () => {
  // Only authenticated users are allowed to submit.

  const {user, isAuthenticated, getAccessTokenSilently}: Auth0ContextInterface = useAuth0();

  // Fetch the latest weeks and artists.

  const dispatch: Dispatch = useDispatch();

  const artistsData: ArtistsState = useSelector(
    (state: RootState) => state.artistsData,
  );

  const weeksData: WeeksState = useSelector(
    (state: RootState) => state.weeksData,
  );

  useEffect(() => {
    fetchArtists(dispatch, artistsData);

    if (user) {
      // Even the editors can only post to existing weeks. Still, if the user is staff, we might
      // be able to update the weeks for other purposes.

      getAccessTokenSilently().then(
        (token: string) => fetchWeeks(dispatch, weeksData, token, false)
      );
    } else {
      fetchWeeks(dispatch, weeksData, undefined, false);
    }
  }, []);

  // Some posts might just be prose. Very few of them, though, so this is collapsed by default.

  const proseRef = createRef<HTMLTextAreaElement>();

  const [isProseOpen, setIsProseOpen] = useState<boolean>(false);

  // Uploading a thumbnail is unnecessary unless the user deliberately wants to use one.

  const thumbnailRef = createRef<HTMLInputElement>();

  const [isThumbnailOpen, setIsThumbnailOpen] = useState<boolean>(false);

  // The items on the form have a complex drag-and-drop state.

  const [items, setItems] = useState<FrontendFileItem[]>([{id: 0}]);

  // And then there are just regular state variables used to build the Week object.

  const [weekNumbers, setWeekNumbers] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("");
  const [medium, setMedium] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [prose, setProse] = useState<string>("");
  const [thumbnailPointer, setThumbnailPointer] = useState<File | undefined>(undefined);

  // After we submit, there are messages we need to retrieve:

  const [messagesView, setMessagesView] = useState<JSX.Element>(<></>);

  // Finally, define the complex form.

  let response;

  if (!isAuthenticated) {
    response = <NotFound />;
  } else {
    response = (
      <>
        <Header>Submit</Header>

        <form>
          <TextInput
            id={"weeks"}
            label={"Week(s)"}
            initialValue={
              Math.max(
                ...Object.values(weeksData.weeks).filter((week: Week) => week.isPublished).map(
                  (week: Week) => week.week
                ).sort()
              ).toString()
            }
            blurCallback={(event: SyntheticEvent<HTMLInputElement, unknown> | undefined) => {
              setWeekNumbers(
                event?.currentTarget.value.split(",").map(
                  item => parseInt(item.trim())
                ).filter(item => item) || []
              );
            }}
          />

          <TextInput
            id={"title"}
            label={"Title"}
            blurCallback={(event: SyntheticEvent<HTMLInputElement, unknown> | undefined) => {
              setTitle(event?.currentTarget.value || "");
            }}
            isRequired
          />

          <TextInput
            id={"medium"}
            label={"Medium"}
            blurCallback={(event: SyntheticEvent<HTMLInputElement, unknown> | undefined) => {
              setMedium(event?.currentTarget.value || "");
            }}
          />

          <TextareaInput
            id={"description"}
            label={"Description (supports Markdown)"}
            blurCallback={(event: SyntheticEvent<HTMLTextAreaElement, unknown> | undefined) => {
              setDescription(event?.currentTarget.value || "");
            }}
            isRequired
          />

          <label className={"block text-gray-700 text-sm font-bold my-2"}>
            Submission Items <span className={"text-red-500"}>*</span>
          </label>

          <div className={"m-2 py-3 px-4 bg-gray-50 border"}>
            <DragDropContext
              onDragEnd={(result: DropResult) => dropHandler(setItems, items, result)}
            >
              <Droppable key={"item-drop-zone"} droppableId={"item-drop-zone"}>
                {
                  (provided: DroppableProvided) => {
                    return (
                      <>
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {
                            items.map((item: FrontendFileItem, index: number) => {
                              return <FileItem
                                key={item.id}
                                id={item.id}
                                index={index}
                                parentState={items}
                                setParentState={setItems}
                              />;
                            })
                          }
                        </div>

                        {provided.placeholder}
                      </>
                    );
                  }
                }
              </Droppable>
            </DragDropContext>

            <button
              type={"button"}
              className={
                "my-3 w-full text-left border bg-green-50 py-2 px-4 shadow hover:bg-green-100 " +
                "text-green-700"
              }
              onClick={
                () => {
                  const lastId: number = items.length ? items[items.length - 1].id : 1;

                  setItems([...items.slice(), {id: lastId + 1}]);
                }
              }
            >
              <FontAwesomeIcon icon={faPlus} fixedWidth /> Add Item
            </button>
          </div>

          <InterfaceLink
            location={"#"}
            title={isProseOpen ? "Close Written Input" : "Open Written Input"}
            icon={<FontAwesomeIcon icon={
              isProseOpen ? faAngleDown : faAngleRight
            } />}
            clickBack={async () => {
              setIsProseOpen(!isProseOpen);

              // Toggle the actual parent.

              const parent: HTMLElement | undefined = proseRef.current?.parentElement || undefined;

              if (parent) {
                const oldClassName: string = parent.className;

                if (oldClassName === "hidden") {
                  parent.className = "";
                } else {
                  parent.className = "hidden";
                }
              }
            }}
          />

          <TextareaInput
            passedRef={proseRef}
            id={"prose"}
            label={"Written Input (poetry, prose, lyrics, etc.)"}
            rows={24}
            blurCallback={(event: SyntheticEvent<HTMLTextAreaElement, unknown> | undefined) => {
              setProse(event?.currentTarget.value || "");
            }}
            isInitiallyHidden
          />

          <InterfaceLink
            location={"#"}
            title={isThumbnailOpen ? "Close Manual Thumbnail" : "Open Manual Thumbnail"}
            icon={<FontAwesomeIcon icon={
              isThumbnailOpen ? faAngleDown : faAngleRight
            } />}
            clickBack={async () => {
              setIsThumbnailOpen(!isThumbnailOpen);
              if (thumbnailRef.current) {
                const oldClassNames: string[] = thumbnailRef.current.className.split(" ");

                if (oldClassNames.includes("hidden")) {
                  thumbnailRef.current.className = oldClassNames.filter(
                    name => name !== "hidden"
                  ).join(" ");
                } else {
                  thumbnailRef.current.className = oldClassNames.join(" ") + " hidden";
                }
              }
            }}
          />

          <input
            ref={thumbnailRef}
            type={"file"}
            className={
              "shadow border mx-2 py-2 px-3 leading-tight my-2 inline-block hidden"
            }
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const files: FileList | null = event.currentTarget.files;

              if (files && files.length > 0) {
                setThumbnailPointer(files[0]);
              }
            }}
          />

          <SubHeader>
            Ready?
          </SubHeader>

          <Paragraph>
            Your work will not appear in the gallery/list until it has been approved.
          </Paragraph>

          <Paragraph>
            Still, if the upload is successful, you will receive a direct link to your work,
            noting it might take up to a minute for it to work for everyone else.
          </Paragraph>

          <InterfaceLink
            location={"#"}
            title={"Okay, Send It!"}
            clickBack={async () => {
              setMessagesView(<></>);

              const errors: ValidationError[] = [];

              // First, ensure that everything is valid so far. We exclude the pre-uploaded URLs
              // to avoid needing to use the network because we assume the returned URLs will be
              // accurate.

              const _idParts: string[] = user?.sub?.split("|") || [];
              const id: string | undefined = _idParts ? _idParts[_idParts.length - 1] : undefined;

              if (!id) {
                errors.push(
                  new ValidationError(
                    "User's ID is absent. Please contact papapastry#8888 on Discord.",
                    [],
                    null,
                  )
                );
              } else {
                const postingArtistName = artistsData.artists[id]?.name || user?.name || "Unknown";
                const postingArtistThumbnailUrl: string = (
                  user?.picture || `https://placem.at/things?w=512&h=512&random=${id}`
                );

                // It shouldn't matter here if approved is true or false. The backend will reset
                // it. The backend will also ignore the "socials" array for the artist info
                // because it either is waiting to be set and propagate to the edge or the user
                // hasn't create their profile yet.

                const work: Work = {
                  id: "noop",
                  year: ACTIVE_YEAR,
                  weekNumbers: weekNumbers,
                  artistId: id,
                  firstSeenArtistInfo: {
                    discordId: id,
                    name: postingArtistName,
                    thumbnailUrl: postingArtistThumbnailUrl,
                    socials: [],
                  },
                  title: title,
                  medium: medium,
                  description: description,
                  prose: prose,
                  urls: [
                    ...items.map(
                      (item: FrontendFileItem) => {
                        return item.url || (item.file && "https://placeholder.com") || "";
                      }
                    ).filter(text => text !== ""),
                  ],
                  isApproved: false,
                };

                const validation: ValidationResult = WORK_SCHEMA.validate(work);
                if (validation.error) {
                  errors.push(validation.error);
                } else {
                  // Now that we know the inputs are generally OK, we can perform file uploads.
                  // Again, we assume that these will be valid URLs. The backend will verify
                  // them otherwise.

                  const urls = [];
                  items.forEach((item: FrontendFileItem) => {
                    if (item.url) {
                      urls.push(item.url);
                    } else {
                      // Obtain an S3 URL for uploading.

                      // Use that URL to upload and return the final URL of the uploaded file.

                      
                    }
                  });
                }

                setMessagesView(<ResponseMessages errors={errors} />);
              }
            }}
          />
        </form>
      </>
    );
  }

  return (
    <StaticPage>
      {response} {messagesView}
    </StaticPage>
  );
};

export default SubmissionForm;
