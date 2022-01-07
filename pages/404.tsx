import {Header, Paragraph, SubHeader} from "../components/typography";

/**
 * A 404 page that shows after 2 seconds.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const NotFound = (): JSX.Element => {
  const response = (
    <>
      <img
        src={"/art/404.png"}
        alt={"."}
        className={"w-96 pt-16 m-auto"}
      />
      <Header>
        404
      </Header>
      <SubHeader>
        Not Found
      </SubHeader>
      <Paragraph>
        Are you lost?
      </Paragraph>
    </>
  );

  return <div className={"flex items-center justify-center h-full"}>
    <div className={"text-center pb-16"}>
      {response}
    </div>
  </div>;
};

export default NotFound;
