const PropTypes = require('prop-types');
const NextImageMock = ({ src, alt }) => <img src={src} alt={alt} data-testid="next-image-mock" />;
NextImageMock.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};
NextImageMock.displayName = 'NextImageMock';
module.exports = NextImageMock;
