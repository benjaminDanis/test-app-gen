import PropTypes from 'prop-types';

export const GridItem = ({ children, className, area }) => {
  const gridBaseClass = `grid__${area}`;
  const gridClass = className ? `${gridBaseClass} ${className}` : gridBaseClass;

  return (
    <>
      <div className={gridClass}>
        {children}
      </div>
    </>
  );
};

GridItem.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    area: PropTypes.string.isRequired,
}
export default GridItem;
