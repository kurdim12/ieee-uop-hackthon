const COMMON = {
  width: 36,
  height: 36,
  viewBox: '0 0 36 36',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconBuild(props) {
  return (
    <svg {...COMMON} {...props}>
      <rect x="5" y="14" width="10" height="14" />
      <rect x="17" y="6" width="14" height="22" />
      <path d="M5 28h26" />
      <path d="M21 12h6M21 17h6M21 22h6" />
    </svg>
  );
}

export function IconShip(props) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M6 24h24l-3 5H9l-3-5z" />
      <path d="M9 24V10l9-4 9 4v14" />
      <path d="M18 6v18" />
      <path d="M12 14h12" />
    </svg>
  );
}

export function IconSpark(props) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M18 4v8M18 24v8M4 18h8M24 18h8" />
      <path d="M8 8l5 5M23 23l5 5M28 8l-5 5M13 23l-5 5" />
    </svg>
  );
}

export function IconArrow(props) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M6 18h24" />
      <path d="M22 10l8 8-8 8" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M6 18l8 8 16-16" />
    </svg>
  );
}

export function IconBack(props) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M30 18H6" />
      <path d="M14 10l-8 8 8 8" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M14 6H8a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h6" />
      <path d="M22 12l6 6-6 6" />
      <path d="M28 18H14" />
    </svg>
  );
}

export function IconBolt(props) {
  return (
    <svg {...COMMON} {...props}>
      <path d="M20 4L8 22h8l-2 10 12-18h-8l2-10z" />
    </svg>
  );
}
