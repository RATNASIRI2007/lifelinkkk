import { label } from '../utils.js';

export default function BloodDrop({ group, size = 'md' }) {
  return (
    <span className={`drop drop-${size}`} aria-label={`Blood group ${label(group)}`}>
      <span>{label(group)}</span>
    </span>
  );
}
