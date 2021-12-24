import {faAngleDoubleLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {NextPage} from "next";
import Head from "next/head";
import SidebarLink from "../components/sidebar-link";

const Item = (props: { id: string }) => {
  // TODO: Limit props length. 380 characters description

  return (
    <div className={"flex-col xl:flex xl:flex-row"}>
      <div className={"px-2 py-2 lg:px-3 lg:py-4"}>
        <img
          src={`https://placem.at/things?w=2048&h=1440&random=${props.id}`}
          srcSet={
            `https://placem.at/things?w=1024&h=720&random=${props.id}, ` +
            `https://placem.at/things?w=2048&h=1440&random=${props.id} 1.5x`
          }
          className={"align-bottom"}
          style={{width: 1024}}
          alt={"A placeholder image."}
        />
      </div>

      {/* Mobile-only gallery caption and horizontal rule + pad. */}

      <div className={"px-2 flex xl:hidden text-xs"}>
        <div className={"flex-grow"}>
          <p><b>Title Name</b></p>
        </div>
        <div className={"self-end"}>
          <i>Scimister</i>
        </div>
      </div>

      <div className={"px-2 py-2 xl:hidden"}>
        <hr className={"border-t"} />
      </div>

      {/* Responsive caption on the right side for wider screens. */}

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
            bottle put a bird on it twee prism biodiesel brooklyn. Blue bottle ennui tbh
            succulents...
          </p>
          <p className={"pt-8 px-4 hidden 2xl:block"}>
            <SidebarLink
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
    <div className={"mx-2 my-2 lg:mr-5"}>
      <Head>
        <title>Design Refresh</title>

        <meta name="description" content="To be rewritten." />
      </Head>

      <div className={"pb-2"}>
        <Item id={"1"} />
        <Item id={"2"} />
        <Item id={"3"} />
        <Item id={"4"} />
        <Item id={"5"} />
        <Item id={"6"} />
      </div>
    </div>
  );
};

export default Home;
