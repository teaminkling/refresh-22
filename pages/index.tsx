import {faAngleDoubleLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {NextPage} from "next";
import Head from "next/head";
import NavItem from "../components/navitem";

const Item = () => {
  // TODO: Limit props length.

  return (
    <div className={"flex"}>
      <div className={"px-4 py-4"}>
        <img
          src={"https://via.placeholder.com/960x640"}
          className={"align-bottom"}
          style={{width: 1024}}
          alt={"A placeholder image."}
        />
      </div>
      <div className={"py-4 w-96 hidden xl:flex"}>
        <span className={"self-end"}>
          <p className={"px-4"}>
            <b>Some Work Here</b>
          </p>
          <p className={"hidden 2xl:block px-4"}>
            <i>
              Clip Studio Paint
            </i>
          </p>
          <p className={"px-4"}>
            by Scimister
          </p>
          <p className={"pt-8 px-4 hidden 2xl:block"}>
            Lorem ipsum dolor amet mustache knausgaard +1, blue bottle waistcoat tbh semiotics
            artisan synth stumptown gastropub cornhole celiac swag. Brunch raclette vexillologist
            post-ironic glossier ennui XOXO mlkshk godard pour-over blog tumblr humblebrag. Blue
            bottle put a bird on it twee prism biodiesel brooklyn. Blue bottle ennui tbh succulents.
          </p>
          <p className={"pt-8 px-4 hidden 2xl:block"}>
            <NavItem
              location={"#"}
              title={"See More"}
              icon={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
            />
          </p>
        </span>
      </div>
    </div>
  );
};

/**
 * The home page/gallery.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Home: NextPage = () => {
  return (
    <div className={"mx-2 my-2"}>
      <Head>
        <title>Design Refresh</title>

        <meta name="description" content="To be rewritten." />
      </Head>

      <div>
        <Item />
        <Item />
        <Item />
      </div>
    </div>
  );
};

export default Home;
