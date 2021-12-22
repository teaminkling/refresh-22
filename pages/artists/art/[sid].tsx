import {useRouter} from "next/router";

const Submission = () => {
  const router = useRouter();
  const {pid} = router.query;

  return (
    <p>Submission: {pid}</p>
  );
};

export default Submission;
