export function Card({ children, className = '', style }) {
  return (
    <div style={style} className={`bg-white rounded-3xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  )
}
