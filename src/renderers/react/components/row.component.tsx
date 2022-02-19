import React from 'react'

export const Row: React.FC = React.memo((props) => {
  return <div>{props.children}</div>
})

Row.displayName = 'Row'
