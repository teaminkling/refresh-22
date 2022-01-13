/**
 * The submission form.
 */
import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {faAngleDown, faAngleRight, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Joi, {ValidationError, ValidationResult} from "joi";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {ChangeEvent, createRef, SyntheticEvent, useEffect, useState} from "react";
import {DragDropContext, Droppable, DroppableProvided, DropResult} from "react-beautiful-dnd";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import {ResponseMessages} from "../../components/errors";
import FileItem, {FrontendFileItem} from "../../components/file-item";
import {TextareaInput, TextInput} from "../../components/forms";
import InterfaceLink from "../../components/interface-link";
import StaticPage, {Header, SubHeader} from "../../components/typography";
import {ACTIVE_YEAR} from "../../data/constants/setup";
import Week from "../../data/core/Week";
import Work, {UrlItem, WORK_SCHEMA} from "../../data/core/Work";
import {ArtistsState, RootState, WeeksState, WorksState} from "../../store/state";
import {getIsEditor, getUserId} from "../../utils/auth";
import {fetchArtists, fetchWeeks, putWork, uploadFile} from "../../utils/connectors";
import NotFound from "../404";

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

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const SubmissionForm = () => {
  // Only authenticated users are allowed to submit.

  const {
    user,
    isLoading,
    isAuthenticated,
    getAccessTokenSilently
  }: Auth0ContextInterface = useAuth0();

  const userId: string | undefined = getUserId(user);
  const isEditor = getIsEditor(user);

  // Fetch the latest weeks and artists.

  const dispatch: Dispatch = useDispatch();

  const artistsData: ArtistsState = useSelector(
    (state: RootState) => state.artistsData,
  );

  const weeksData: WeeksState = useSelector(
    (state: RootState) => state.weeksData,
  );

  const worksData: WorksState = useSelector(
    (state: RootState) => state.worksData,
  );

  // Uploading a thumbnail is unnecessary unless the user deliberately wants to use one.

  const thumbnailRef = createRef<HTMLInputElement>();

  const [isThumbnailOpen, setIsThumbnailOpen] = useState<boolean>(false);

  // The items on the form have a complex drag-and-drop state.

  const [items, setItems] = useState<FrontendFileItem[]>([{id: 0}]);

  // And then there are just regular state variables used to build the Week object.

  const [weekNumbers, setWeekNumbers] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [medium, setMedium] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnailPointer, setThumbnailPointer] = useState<File | undefined>(undefined);

  // After we submit, there are messages we need to retrieve:

  const [messagesView, setMessagesView] = useState<JSX.Element>(<></>);

  // A submit form turns into an edit form if the ID is present in the URL query.

  const router = useRouter();
  const query: ParsedUrlQuery = router.query;

  const _rawEdit: string | string[] | undefined = query.edit;
  const edit: string | undefined = typeof _rawEdit === "object" ? _rawEdit[0] : _rawEdit;

  let editWork: Work | undefined = undefined;
  if (edit) {
    editWork = worksData.works[edit];
  }

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

    // Fill in with the edited work if present.

    if (editWork) {
      setWeekNumbers(editWork.weekNumbers);
      setTitle(editWork.title);
      setArtist(editWork.artistId);
      setMedium(editWork.medium || "");
      setDescription(editWork.description);

      setItems(
        editWork.items.map(
          (item: UrlItem, index: number) => {
            return {
              id: index, url: item.url, file: undefined,
            };
          }
        )
      );
    }

    // If we know the weeks, we can fill in the default for the weeks input.

    if (!weekNumbers.toString()) {
      const defaultWeek: number = Math.max(
        ...Object.values(weeksData.weeks).filter((week: Week) => week.isPublished).map(
          (week: Week) => week.week
        )
      );

      setWeekNumbers([defaultWeek]);
    }
  }, [edit]);

  // Finally, define the complex form.

  let response = <NotFound />;
  if (isAuthenticated) {
    response = (
      <StaticPage>
        <Head>
          <title>Submit - Design Refresh</title>
        </Head>

        <Header>
          {edit ? "Edit Work" : "Submit Work"}
        </Header>

        <form>
          {
            editWork ? (
              <>
                <TextInput
                  id={"edit-id"}
                  label={"Editing ID:"}
                  initialValue={editWork.id}
                  isDisabled
                />
              </>
            ) : <></>
          }

          {
            isEditor ? (
              <>
                <TextInput
                  id={"edit-user-id"}
                  label={"(Admin) User ID:"}
                  initialValue={editWork?.artistId || userId || ""}
                  blurCallback={(event: SyntheticEvent<HTMLInputElement, unknown> | undefined) => {
                    const value: string | undefined = event?.currentTarget.value;

                    if (value) {
                      setArtist(value);
                    }
                  }}
                />
              </>
            ) : <></>
          }

          <TextInput
            id={"weeks"}
            label={"Week(s)"}
            initialValue={
              editWork ? editWork.weekNumbers.join(", ") : (
                weekNumbers.length > 0 ? weekNumbers[0].toString() : ""
              )
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
            initialValue={
              editWork ? editWork.title : ""
            }
            blurCallback={(event: SyntheticEvent<HTMLInputElement, unknown> | undefined) => {
              setTitle(event?.currentTarget.value || "");
            }}
            isRequired
          />

          <TextInput
            id={"medium"}
            label={"Medium"}
            initialValue={
              editWork ? editWork.medium : ""
            }
            blurCallback={(event: SyntheticEvent<HTMLInputElement, unknown> | undefined) => {
              setMedium(event?.currentTarget.value || "");
            }}
          />

          <TextareaInput
            id={"description"}
            label={"Description (supports Markdown)"}
            initialValue={
              editWork ? editWork.description : ""
            }
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
            title={isThumbnailOpen ? "Close Custom Thumbnail" : "Open Custom Thumbnail"}
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

          {
            isThumbnailOpen ?
              <div className={"pl-1"}>
                <p className={"text-sm mt-2 mb-1"}>
                  You probably don&apos;t need to set this, especially if your main item is an
                  image. If you do, I <b>strongly</b> recommend using an image as close as possible
                  to 2048 x 1440 as possible.
                </p>

                <p className={"text-sm mt-2 mb-1"}>
                  Note that admins may change your thumbnail at any time while approving your post
                  or edit.
                </p>
              </div> : <></>
          }

          <input
            ref={thumbnailRef}
            type={"file"}
            accept={".png,.jpg,.jpeg"}
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

          <InterfaceLink
            location={"#"}
            title={"Okay, Send It!"}
            clickBack={async () => {
              setMessagesView(<></>);

              const errors: ValidationError[] = [];

              // First, ensure that everything is valid so far. We exclude the pre-uploaded URLs
              // to avoid needing to use the network because we assume the returned URLs will be
              // accurate.

              if (!userId) {
                errors.push(
                  new ValidationError(
                    "User's ID is absent. Please contact papapastry#8888 on Discord.",
                    [],
                    null,
                  )
                );
              } else {
                const postingArtistName = (
                  artistsData.artists[userId]?.name || user?.name || "Unknown"
                );

                const postingArtistThumbnailUrl: string = (
                  user?.picture || `https://placem.at/things?w=512&h=512&random=${userId}`
                );

                // It shouldn't matter here if approved is true or false. The backend will reset
                // it. The backend will also ignore the "socials" array for the artist info
                // because it either is waiting to be set and propagate to the edge or the user
                // hasn't create their profile yet.

                let work: Work = {
                  id: editWork ? editWork.id : "noop",
                  year: ACTIVE_YEAR,
                  weekNumbers: weekNumbers,
                  artistId: isEditor ? (artist || editWork?.artistId || userId) : userId,
                  firstSeenArtistInfo: {
                    discordId: userId,
                    name: postingArtistName,
                    thumbnailUrl: postingArtistThumbnailUrl,
                    socials: [],
                  },
                  title: title,
                  medium: medium,
                  description: description,
                  items: [
                    ...items.map(
                      (item: FrontendFileItem): UrlItem => {
                        const url = item.url || (item.file && "https://placeholder.com") || "";

                        return {url: url};
                      }
                    ).filter((item: UrlItem) => item.url !== ""),
                  ],
                  isApproved: false,
                  submittedTimestamp: new Date().toISOString(),
                };

                const validation: ValidationResult = WORK_SCHEMA.validate(work);
                if (validation.error) {
                  errors.push(validation.error);
                } else {
                  // Now that we know the inputs are generally OK, we can perform file uploads.
                  // Again, we assume that these will be valid URLs. The backend will verify
                  // them otherwise.

                  const accessToken: string = await getAccessTokenSilently();

                  const urlWrappers: UrlItem[] = [];
                  for (const item of items) {
                    if (item.url) {
                      urlWrappers.push({url: item.url});
                    } else if (item.file) {
                      const urlValidation = Joi.string().regex(
                        /.*\.(png)|(jpg)|(jpeg)|(mp3)/
                      ).validate(
                        item.file.name.toLowerCase()
                      );

                      if (urlValidation.error) {
                        errors.push(urlValidation.error);
                      }

                      // Don't upload the file if there will be errors.

                      if (errors.length === 0) {
                        urlWrappers.push({url: await uploadFile(accessToken, item.file)});
                      }
                    }
                  }

                  // Next, we associate the URLs with the work then send it off to the backend.
                  // If the thumbnail was explicitly provided, we give that in too.

                  if (errors.length === 0) {
                    if (thumbnailPointer) {
                      work.thumbnailUrl = await uploadFile(accessToken, thumbnailPointer);
                      work.smallThumbnailUrl = await uploadFile(accessToken, thumbnailPointer);
                    }

                    work.items = urlWrappers;

                    // Replace the work in memory with what was actually placed in the backend.

                    work = await putWork(dispatch, worksData, accessToken, work);
                  }
                }

                setMessagesView(<ResponseMessages errors={errors} successElement={
                  <>
                    Nice! Check out your work&nbsp;
                    <Link href={`/works/${work.id}`}>
                      <a className={"underline"} style={{color: "#7C7CE0"}}>
                        here
                      </a>
                    </Link> and on Discord!
                  </>
                } />);
              }
            }}
          />
        </form>

        {messagesView}
      </StaticPage>
    );
  } else if (isLoading) {
    response = <StaticPage><Header>Loading...</Header></StaticPage>;
  }

  return response;
};

export default SubmissionForm;
