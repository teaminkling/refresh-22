/**
 * The sidebar which controls all content on the right side of the screen.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Sidebar = (): JSX.Element => {
  return (
    <div>
      {/* Top of sidebar. */}

      <a href={"#"}>Test Link Top 1</a>
      <a href={"#"}>Test Link Top 2</a>
      <a href={"#"}>Test Link Top 3</a>

      {/* Middle of sidebar. */}

      <a href={"#"}>Test Link Middle 1</a>
      <a href={"#"}>Test Link Middle 2</a>

      {/* Bottom of sidebar. */}

      <a href={"#"}>Test Link Bottom 1</a>
      <a href={"#"}>Test Link Bottom 2</a>
      <a href={"#"}>Test Link Bottom 3</a>
      <a href={"#"}>Test Link Bottom 4</a>
    </div>
  );
};

export default Sidebar;
