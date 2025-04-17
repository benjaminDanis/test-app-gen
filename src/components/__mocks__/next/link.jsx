const PropTypes = require('prop-types');
const NextLinkMock = ({ children, href }) => (
  <a href={href} data-testid="next-link-mock">
    {children}
  </a>
);
NextLinkMock.displayName = 'NextLinkMock';
NextLinkMock.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};
module.exports = NextLinkMock;
