import type {NextPage} from "next";
import Head from "next/head";
import Item from "../components/gallery-item";

/**
 * The home page/gallery.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Home: NextPage = () => {
  return (
    <div className={"mx-2 my-2 md:mr-5"}>
      <Head>
        <title>Design Refresh</title>

        <meta name="description" content="To be rewritten." />
      </Head>

      <div className={"pb-2"}>
        <Item
          id={"123"}
          title={"Some Very Long and Stupid Title Here"}
          artist={"Scimister"}
          medium={"Paint Tool Sai"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan leo ac " +
            "odio aliquet, et gravida metus blandit. Ut sed metus non enim gravida congue non " +
            "a nulla. Sed maximus neque eu sem bibendum, vitae blandit libero venenatis. " +
            "Curabitur mauris augue, volutpat vitae nulla id, commodo luctus dolor. Vivamus ac " +
            "aliquam lacus. Duis aliquet faucibus diam sed consequat. Vivamus condimentum eros " +
            "leo, ut lobortis turpis tincidunt vitae."
          }
          preview={`https://placem.at/things?w=1024&h=720&random=${"123"}`}
          retinaPreview={`https://placem.at/things?w=2048&h=1440&random=${"123"}`}
        />
        <Item
          id={"234"}
          title={"Some Very Long and Stupid Title Here"}
          artist={"Scimister"}
          medium={"Paint Tool Sai"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan leo ac " +
            "odio aliquet, et gravida metus blandit. Ut sed metus non enim gravida congue non " +
            "a nulla. Sed maximus neque eu sem bibendum, vitae blandit libero venenatis. " +
            "Curabitur mauris augue, volutpat vitae nulla id, commodo luctus dolor. Vivamus ac " +
            "aliquam lacus. Duis aliquet faucibus diam sed consequat. Vivamus condimentum eros " +
            "leo, ut lobortis turpis tincidunt vitae."
          }
          preview={`https://placem.at/things?w=1024&h=720&random=${"234"}`}
          retinaPreview={`https://placem.at/things?w=2048&h=1440&random=${"234"}`}
        />
        <Item
          id={"345"}
          title={"Some Very Long and Stupid Title Here"}
          artist={"Scimister"}
          medium={"Paint Tool Sai"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan leo ac " +
            "odio aliquet, et gravida metus blandit. Ut sed metus non enim gravida congue non " +
            "a nulla. Sed maximus neque eu sem bibendum, vitae blandit libero venenatis. " +
            "Curabitur mauris augue, volutpat vitae nulla id, commodo luctus dolor. Vivamus ac " +
            "aliquam lacus. Duis aliquet faucibus diam sed consequat. Vivamus condimentum eros " +
            "leo, ut lobortis turpis tincidunt vitae."
          }
          preview={`https://placem.at/things?w=1024&h=720&random=${"345"}`}
          retinaPreview={`https://placem.at/things?w=2048&h=1440&random=${"345"}`}
        />
        <Item
          id={"456"}
          title={"Some Very Long and Stupid Title Here"}
          artist={"Scimister"}
          medium={"Paint Tool Sai"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan leo ac " +
            "odio aliquet, et gravida metus blandit. Ut sed metus non enim gravida congue non " +
            "a nulla. Sed maximus neque eu sem bibendum, vitae blandit libero venenatis. " +
            "Curabitur mauris augue, volutpat vitae nulla id, commodo luctus dolor. Vivamus ac " +
            "aliquam lacus. Duis aliquet faucibus diam sed consequat. Vivamus condimentum eros " +
            "leo, ut lobortis turpis tincidunt vitae."
          }
          preview={`https://placem.at/things?w=1024&h=720&random=${"456"}`}
          retinaPreview={`https://placem.at/things?w=2048&h=1440&random=${"456"}`}
        />
        <Item
          id={"567"}
          title={"Some Very Long and Stupid Title Here"}
          artist={"Scimister"}
          medium={"Paint Tool Sai"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan leo ac " +
            "odio aliquet, et gravida metus blandit. Ut sed metus non enim gravida congue non " +
            "a nulla. Sed maximus neque eu sem bibendum, vitae blandit libero venenatis. " +
            "Curabitur mauris augue, volutpat vitae nulla id, commodo luctus dolor. Vivamus ac " +
            "aliquam lacus. Duis aliquet faucibus diam sed consequat. Vivamus condimentum eros " +
            "leo, ut lobortis turpis tincidunt vitae."
          }
          preview={`https://placem.at/things?w=1024&h=720&random=${"567"}`}
          retinaPreview={`https://placem.at/things?w=2048&h=1440&random=${"567"}`}
        />
        <Item
          id={"678"}
          title={"Some Very Long and Stupid Title Here"}
          artist={"Scimister"}
          medium={"Paint Tool Sai"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan leo ac " +
            "odio aliquet, et gravida metus blandit. Ut sed metus non enim gravida congue non " +
            "a nulla. Sed maximus neque eu sem bibendum, vitae blandit libero venenatis. " +
            "Curabitur mauris augue, volutpat vitae nulla id, commodo luctus dolor. Vivamus ac " +
            "aliquam lacus. Duis aliquet faucibus diam sed consequat. Vivamus condimentum eros " +
            "leo, ut lobortis turpis tincidunt vitae."
          }
          preview={`https://placem.at/things?w=1024&h=720&random=${"678"}`}
          retinaPreview={`https://placem.at/things?w=2048&h=1440&random=${"678"}`}
        />
        <Item
          id={"789"}
          title={"Some Very Long and Stupid Title Here"}
          artist={"Scimister"}
          medium={"Paint Tool Sai"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan leo ac " +
            "odio aliquet, et gravida metus blandit. Ut sed metus non enim gravida congue non " +
            "a nulla. Sed maximus neque eu sem bibendum, vitae blandit libero venenatis. " +
            "Curabitur mauris augue, volutpat vitae nulla id, commodo luctus dolor. Vivamus ac " +
            "aliquam lacus. Duis aliquet faucibus diam sed consequat. Vivamus condimentum eros " +
            "leo, ut lobortis turpis tincidunt vitae."
          }
          preview={`https://placem.at/things?w=1024&h=720&random=${"789"}`}
          retinaPreview={`https://placem.at/things?w=2048&h=1440&random=${"789"}`}
        />
        <Item
          id={"890"}
          title={"Some Very Long and Stupid Title Here"}
          artist={"Scimister"}
          medium={"Paint Tool Sai"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan leo ac " +
            "odio aliquet, et gravida metus blandit. Ut sed metus non enim gravida congue non " +
            "a nulla. Sed maximus neque eu sem bibendum, vitae blandit libero venenatis. " +
            "Curabitur mauris augue, volutpat vitae nulla id, commodo luctus dolor. Vivamus ac " +
            "aliquam lacus. Duis aliquet faucibus diam sed consequat. Vivamus condimentum eros " +
            "leo, ut lobortis turpis tincidunt vitae."
          }
          preview={`https://placem.at/things?w=1024&h=720&random=${"890"}`}
          retinaPreview={`https://placem.at/things?w=2048&h=1440&random=${"890"}`}
        />
      </div>
    </div>
  );
};

export default Home;
