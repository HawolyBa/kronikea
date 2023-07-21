import React from 'react'

const Button = ({ onClick, children, type, color, disabled, textColor }) => {
  return (
    <button style={{ fontSize: "0.65rem" }} onClick={() => {
      return onClick ? onClick() : null
    }} disabled={disabled ? disabled : false} type={type} className={`${!disabled ? `cursor-pointer active:scale-95 active:shadow-none ${color} ${textColor ? textColor : 'text-slate-50'}` : 'bg-slate-100 text-zinc-300'} px-3 py-2 rounded-sm shadow-md md:w-fit w-full tracking-widest uppercase md:ml-3`}>{children}
    </button>
  )
}

export default Button