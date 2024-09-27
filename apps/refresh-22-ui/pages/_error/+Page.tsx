import { Header, Paragraph, SubHeader } from "../../components/markup/typography.tsx";

export default function Error() {
  return (
    <div className={"flex items-center justify-center h-full"}>
      <div className={"text-center pb-16"}>
        <img src="/img/art/404.png" alt="a confused face" className="w-96 pt-16 m-auto" />
        <Header>404</Header>
        <SubHeader>Not Found</SubHeader>
        <Paragraph>Are you lost?</Paragraph>
      </div>
    </div>
  );
}
