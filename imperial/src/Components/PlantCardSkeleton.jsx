const shimmer = `
  @keyframes shimmer {
    0% { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
`;

const Sk = ({ w = '100%', h = '16px', className = '' }) => (
  <div className={className} style={{
    width: w, height: h,
    background: 'linear-gradient(90deg, #1a3d2b 25%, #234d38 50%, #1a3d2b 75%)',
    backgroundSize: '600px 100%',
    animation: 'shimmer 1.6s infinite',
    borderRadius: '2px',
  }} />
);

const PlantCardSkeleton = () => (
  <article>
    {/* Image */}
    <div className="relative overflow-hidden aspect-[4/5] bg-surface-container-low mb-stack-sm">
      <Sk h="100%" />
    </div>

    {/* Name + Price row */}
    <div className="flex mt-1 flex-row justify-between gap-1">
      <div className="flex flex-col px-1 mb-1 gap-2">
        <Sk w="100px" h="10px" />
        <Sk w="140px" h="16px" />
      </div>
      <Sk w="60px" h="16px" />
    </div>

    {/* Care details row */}
    <div className="grid gap-20 grid-cols-3 mt-stack-sm pt-1 border-t border-primary/5">
      <Sk h="12px" />
      <Sk h="12px" />
      <Sk h="12px" />
    </div>
  </article>
);

export default PlantCardSkeleton;