const Skeleton = ({ width = '100%', height = '16px', className = '' }) => (
  <div
    className={className}
    style={{
      width, height,
      background: 'linear-gradient(90deg, #1a3d2b 25%, #234d38 50%, #1a3d2b 75%)',
      backgroundSize: '600px 100%',
      animation: 'shimmer 1.6s infinite',
      borderRadius: '2px',
    }}
  />
);

export default Skeleton;
