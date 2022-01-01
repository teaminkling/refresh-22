/**
 * The submission form.
 */
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {createRef, useState} from "react";
import {TextareaInput, TextInput} from "../components/forms";
import InterfaceLink from "../components/interface-link";
import StaticPage, {Header} from "../components/typography";

const SubmissionForm = () => {
  const proseRef = createRef<HTMLTextAreaElement>();

  const [isProseOpen, setIsProseOpen] = useState<boolean>(false);

  // Gather number of weeks by number index. TODO
  // TODO: show limits when typing

  return (
    <StaticPage>
      <Header>Submit</Header>
      <form>
        <TextInput
          id={"weeks"}
          label={"Week(s) (use commas for multiple)"}
          placeholder={"1, 2, 5"}
        />

        <TextInput
          id={"title"}
          label={"Title"}
          placeholder={"Standing"}
        />

        <TextInput
          id={"medium"}
          label={"Medium"}
          placeholder={"Procreate (TM)"}
        />

        <TextareaInput
          id={"description"}
          label={"Description"}
          placeholder={
            "I was inspired to make this piece by a POGGERS art by PAINTSEPSI.\n\n" +
            "Shoutout to his family."
          }
        />

        <InterfaceLink
          location={"#"}
          title={isProseOpen ? "Close Written Input" : "Open Written Input"}
          icon={<FontAwesomeIcon icon={
            isProseOpen ? faAngleUp : faAngleDown
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
          label={"Written Input"}
          rows={24}
          placeholder={
            "[Verse]\n" +
            "\n" +
            "日本のロックを試してみました\n" +
            "それは大きな間違いでした\n" +
            "私は自分自身と他のみんなが嫌いです\n" +
            "嫌いです\n" +
            "\n" +
            "誰もこれらの歌詞を理解していません\n" +
            "日本人も。 グーグル翻訳は最悪だから\n" +
            "死ぬ行く\n" +
            "\n" +
            "[Chorus]\n" +
            "\n" +
            "du du du du du du du du du du です よ\n" +
            "ba ba ba ba ba ba ba ba ba ba ba I'm a sheep\n" +
            "卵たま\n" +
            "ti ti ti ti ti ti ti ti ti ti ha ha ha\n" +
            "lo lo lo lo lo lo hi hi hi hi hi hi hi hi hi\n" +
            "2021 Design Refresh\n" +
            "\n" +
            "[Verse]\n" +
            "\n" +
            "うまくいけば、この曲は上品だと思われます\n" +
            "1ヶ月初音ミクボイスバンクトライアル\n" +
            "卵\n" +
            "\n" +
            "[Chorus]\n" +
            "\n" +
            "du du du du du du du du du du です よ\n" +
            "ba ba ba ba ba ba ba ba ba ba ba I'm a sheep\n" +
            "卵たま\n" +
            "ti ti ti ti ti ti ti ti ti ti ha ha ha\n" +
            "lo lo lo lo lo lo hi hi hi hi hi hi hi hi hi\n" +
            "2021 Design Refresh"
          }
          isInitiallyHidden
        />

        <TextareaInput id={"urls"} label={"Work URLs (1st is the main one)"} />
      </form>
    </StaticPage>
  );
};

export default SubmissionForm;
