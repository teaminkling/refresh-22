import {useRouter} from "next/router";

const Artist = () => {
  const router = useRouter();
  const {pid} = router.query;

  return (
    <p>Artist: {pid}</p>
  );
};

export default Artist;
