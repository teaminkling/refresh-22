import {useRouter} from "next/router";

const Theme = () => {
  const router = useRouter();
  const {pid} = router.query;

  return (
    <p>Week: {pid}</p>
  );
};

export default Theme;
