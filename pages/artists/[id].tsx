import {useRouter} from "next/router";
import StaticPage, {Header} from "../../components/typography";

const Artist = () => {
  const router = useRouter();
  const {id} = router.query;

  // First, we need to check that the artist actually exists.

  return (
    <StaticPage>
      <Header>
        {id}
      </Header>
    </StaticPage>
  );
};

export default Artist;
