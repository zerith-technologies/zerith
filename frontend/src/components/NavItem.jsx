import { cloneElement } from 'react'

export default function NavItem({ icon, text, active, alert, small, isOpen, textOnly, theme, isDarkMode, onClick }) {
  if (textOnly && !isOpen) return null
  return (
    <div
      onClick={onClick}
      title={!isOpen ? text : ''}
      className={`relative flex items-center ${isOpen ? 'justify-start px-4' : 'justify-center px-0'} py-3 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
        active
          ? isDarkMode ? 'bg-[#1e2532] text-white' : 'bg-[#e9ecef] text-gray-900'
          : `${theme.hover} ${theme.textMuted}`
      }`}
    >
      <div className="flex items-center gap-3.5">
        {icon && (
          <span className={`shrink-0 ${active ? (isDarkMode ? 'text-white' : 'text-gray-900') : theme.textMuted}`}>
            {cloneElement(icon, { size: small ? 18 : 20 })}
          </span>
        )}
        {!icon && small && isOpen && (
          <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} ml-2 shrink-0`}></div>
        )}
        <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'} ${small ? 'text-xs' : 'text-sm'} ${active ? 'font-medium' : ''}`}>
          {text}
        </span>
      </div>
      {alert && (
        <div className={`h-1.5 w-1.5 bg-red-500 rounded-full ${isOpen ? 'ml-auto' : 'absolute top-2 right-2'}`}></div>
      )}
    </div>
  )
}
