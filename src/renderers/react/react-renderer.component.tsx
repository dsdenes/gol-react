import React from 'react'
import { RendererProps } from '../../types/renderer.type'

interface ReactRendererProps extends RendererProps {}

interface CellProps {
  id: number
  live: boolean
}

export const Cell: React.FC<CellProps> = (props) => {
  return <div key={props.id}>{props.live}</div>
}

export const ReactRenderer: React.FC<ReactRendererProps> = (props) => {
  return <></>
}
