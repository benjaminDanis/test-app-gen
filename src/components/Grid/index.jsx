import PropTypes from 'prop-types';

export const Grid = ({ children, className, name = 'main', }) => {
  const gridBaseClass = `grid__${name}`;
  const gridClass = className ? `${gridBaseClass} ${className}` : gridBaseClass;

  return (
    <>
      <div className={gridClass}>
        {children}
      </div>
    </>
  );
};

Grid.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    name: PropTypes.string,
}
export default Grid;
