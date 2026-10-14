export default function Skeleton({ className = '' }) {
  return <div className={`rounded skeleton ${className}`} aria-hidden="true" />;
}
