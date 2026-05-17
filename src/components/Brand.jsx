// IEEE University of Petra Student Branch — official brand lockup.
// Source: /public/brand.png (cropped version of /public/Main Logo.png)

const HEIGHTS = {
  sm: 32,
  md: 44,
  lg: 96,
};

export default function Brand({ size = 'sm', className = '' }) {
  const height = HEIGHTS[size] ?? HEIGHTS.sm;
  return (
    <img
      src="/brand.png"
      alt="IEEE University of Petra Student Branch"
      style={{ height }}
      className={`block w-auto ${className}`}
    />
  );
}

export function BrandStacked({ className = '' }) {
  return <Brand size="lg" className={className} />;
}
