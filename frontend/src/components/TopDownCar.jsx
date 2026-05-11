export default function TopDownCar({ color, isDarkMode }) {
  return (
    <svg width="22" height="42" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
      <rect x="2" y="4" width="20" height="40" rx="6" fill={color} opacity={isDarkMode ? '0.8' : '1'} />
      <rect x="3" y="14" width="18" height="10" rx="2" fill={isDarkMode ? '#000' : '#fff'} opacity="0.6" />
      <rect x="4" y="28" width="16" height="12" rx="2" fill={isDarkMode ? '#000' : '#fff'} opacity="0.6" />
      <rect x="0" y="16" width="3" height="5" rx="1.5" fill={color} />
      <rect x="21" y="16" width="3" height="5" rx="1.5" fill={color} />
      <rect x="4" y="3" width="5" height="3" rx="1.5" fill="#fef08a" />
      <rect x="15" y="3" width="5" height="3" rx="1.5" fill="#fef08a" />
      <rect x="4" y="42" width="6" height="3" rx="1.5" fill="#ef4444" />
      <rect x="14" y="42" width="6" height="3" rx="1.5" fill="#ef4444" />
    </svg>
  )
}
