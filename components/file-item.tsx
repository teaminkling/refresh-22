import {
  faBackspace,
  faCompactDisc,
  faCrown,
  faGripLines,
  faLink,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";
import {Draggable, DraggableProvided} from "react-beautiful-dnd";

enum FileItemMode {
  DEFAULT_MODE,
  IMAGE_MODE,
  URL_MODE,
}

/**
 * On the frontend, a representation of an item to be uploaded.
 */
export interface FrontendFileItem {
  /**
   * A unique identifier for a list item.
   */
  id: number;

  /**
   * If applicable, the URL.
   *
   * Not applicable if there's a file instead.
   */
  url?: string;

  /**
   * If applicable, the file path when uploading.
   *
   * Not applicable if there's a URL instead.
   */
  file?: File;
}

/**
 * Props for a file item.
 */
interface FileItemProps {
  /**
   * A unique identifier for a list item.
   */
  id: number;

  /**
   * The initial index of the item.
   */
  index: number;

  /**
   * The parent state (getter) for frontend items.
   */
  parentState: FrontendFileItem[];

  /**
   * The parent state setter for frontend items.
   *
   * Each file item will only set one item.
   */
  setParentState: (state: FrontendFileItem[]) => void;

  /**
   * An optional setter for the mode of the parent object.
   *
   * @param {FileItemMode} mode the mode
   */
  setMode?: (mode: FileItemMode) => void;
}

const BUTTON_CLASSES = (
  "rounded-2xl ml-3 my-2 px-2 py-1 border bg-gray-50 hover:bg-gray-100"
);

/**
 * The initial buttons that appears by default before inputting anything.
 *
 * @param {FileItemProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
const InitialButtons = (props: FileItemProps) => {
  return <>
    <button
      className={BUTTON_CLASSES}
      type={"button"}
      onClick={() => {
        props.setMode ? props.setMode(FileItemMode.IMAGE_MODE) : null;
      }}
    >
      <FontAwesomeIcon icon={faCompactDisc} fixedWidth /> Image or Audio
    </button>

    <button
      className={BUTTON_CLASSES}
      type={"button"}
      onClick={() => {
        props.setMode ? props.setMode(FileItemMode.URL_MODE) : null;
      }}
    >
      <FontAwesomeIcon icon={faLink} fixedWidth /> Video, Prose, & URL
    </button>

    {
      props.parentState.length > 1 ? (
        <button
          className={
            BUTTON_CLASSES + " bg-red-50 text-red-700 hover:bg-red-100"
          }
          type={"button"}
          onClick={() => {
            let newState: FrontendFileItem[];

            // Delete the one that was just created.

            if (props.parentState.length > 1) {
              newState = props.parentState.slice().filter(
                (item: FrontendFileItem) => item.id !== props.id
              );
            } else {
              newState = [{id: props.id + 1}];
            }

            props.setParentState(newState);
          }}
        >
          <FontAwesomeIcon icon={faTimes} fixedWidth /> Delete
        </button>
      ) : <></>
    }
  </>;
};

const ImageAndAudioModeView = (props: FileItemProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return <>
    <button
      className={BUTTON_CLASSES}
      type={"button"}
      onClick={() => {
        const newState: FrontendFileItem[] = props.parentState.slice();

        newState[props.index].url = undefined;
        newState[props.index].file = undefined;

        props.setMode ? props.setMode(FileItemMode.DEFAULT_MODE) : null;
      }}
    >
      <FontAwesomeIcon icon={faBackspace} fixedWidth /> Back
    </button>
    <span className={"inline-block pl-4 leading-8"}>
      <div className={"relative inline-block"}>
        <a
          href={"#action"}
          className={"border-b border-dashed border-black hidden md:block"}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          Read Me
        </a>
        {
          showTooltip ?
            <span
              className={
                "absolute text-center p-2 bg-gray-50 border shadow hidden md:block text-sm"
              }
              style={{
                bottom: "120%",
                width: "16em",
                left: "50%",
                marginLeft: "-8em"
              }}
            >
              <p className={"mb-4"}>
                PNG, JPG, and MP3 files are supported. The maximum file size is 32 MiB.
              </p>
              <p className={"mb-4"}>
                If you are uploading an image, please upload one that is at least 720 pixels
                tall <b>and</b> 1024 pixels wide.
              </p>
              <p>
                If what you are uploading is much smaller, please consider uploading a larger
                manual thumbnail, e.g., of your Photoshop window.
              </p>
            </span> : <></>
        }
      </div>
    </span>
    <input
      type={"file"}
      className={
        "shadow border mx-2 py-2 px-3 leading-tight my-2 inline-block"
      }
      style={{
        width: "95%",
        marginLeft: "1vw"
      }}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const newState: FrontendFileItem[] = props.parentState.slice();

        newState[props.index].url = undefined;
        newState[props.index].file = (
          event.currentTarget.files && event.currentTarget.files.length > 0 ?
            event.currentTarget.files[0] : undefined
        );

        props.setParentState(newState);
      }}
      accept={".mp3,.png,.jpg,.jpeg"}
    />
  </>;
};

const UrlModeView = (props: FileItemProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const currentItem: FrontendFileItem | undefined = props.parentState[props.index];

  return <>
    <>
      <button
        className={BUTTON_CLASSES}
        type={"button"}
        onClick={() => {
          props.setMode ? props.setMode(FileItemMode.DEFAULT_MODE) : null;
        }}
      >
        <FontAwesomeIcon icon={faBackspace} fixedWidth /> Back
      </button>
      <span className={"inline-block pl-4 leading-8"}>
        <div className={"relative inline-block"}>
          <a
            href={"#action"}
            className={"border-b border-dashed border-black hidden md:block"}
            onClick={() => setShowTooltip(!showTooltip)}
          >
            Need help?
          </a>
          {
            showTooltip ?
              <span
                className={
                  "absolute text-center p-2 bg-gray-50 border shadow hidden md:block text-sm"
                }
                style={{
                  bottom: "120%",
                  width: "16em",
                  left: "50%",
                  marginLeft: "-8em"
                }}>
                <p className={"mb-4"}>
                  We support the following third party sites without needing to leave the site:
                  YouTube and Vimeo.
                </p>

                <p>
                  Otherwise, we recommend Webtoon for comics, itch.io for games, and whatever you
                  like for PDF and prose (as long as you don&apos;t mind providing your own
                  thumbnail).
                </p>
              </span> : <></>
          }
        </div>
      </span>
      <input
        type={"url"}
        className={
          "shadow border mx-2 py-2 px-3 leading-tight my-2 inline-block"
        }
        style={{
          width: "95%",
          marginLeft: "1vw"
        }}
        defaultValue={currentItem ? currentItem.url : ""}
        placeholder={"E.g., https://example.com/your-work"}
        onBlur={(event: SyntheticEvent<HTMLInputElement, FocusEvent>) => {
          const newState: FrontendFileItem[] = props.parentState.slice();

          newState[props.index].url = event.currentTarget.value;
          newState[props.index].file = undefined;

          props.setParentState(newState);
        }}
      />
    </>
  </>;
};

const FileItem = (props: FileItemProps) => {
  const [mode, setMode] = useState<FileItemMode>(FileItemMode.DEFAULT_MODE);

  const currentItem: FrontendFileItem | undefined = props.parentState[props.index];

  useEffect(() => {
    if (currentItem.url) {
      setMode(FileItemMode.URL_MODE);
    }
  }, [currentItem]);

  let itemElement = <InitialButtons {...props} setMode={setMode} />;
  switch (mode) {
    case (FileItemMode.DEFAULT_MODE):
      // The default is fine.

      break;
    case (FileItemMode.IMAGE_MODE):
      itemElement = <ImageAndAudioModeView {...props} setMode={setMode} />;

      break;
    case (FileItemMode.URL_MODE):
      itemElement = <UrlModeView {...props} setMode={setMode} />;

      break;
    default:
      // No need to explode if the type is not known, just show nothing.

      break;
  }

  return (
    <Draggable draggableId={props.id.toString()} index={props.index}>
      {
        (provided: DraggableProvided) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={
                "w-full my-2 py-3 px-4 text-gray-700 leading-tight shadow border bg-white"
              }
            >
              <div>
                <code className={"border p-1"}>
                  {props.index === 0 ?
                    <FontAwesomeIcon icon={faCrown} fixedWidth />
                    : <FontAwesomeIcon
                      icon={faGripLines}
                      fixedWidth
                      className={"text-black"}
                    />}
                </code>

                {itemElement}
              </div>
            </div>
          );
        }
      }
    </Draggable>
  );
};

export default FileItem;
