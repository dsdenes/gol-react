import { Button, ButtonProps } from 'antd'
import React from 'react'
import styled from 'styled-components'

const StyledButton = styled(Button)`
  width: 100%;
`

export const ControlButton: React.FC<ButtonProps> = (props) => {
  return <StyledButton {...props}>{props.children}</StyledButton>
}
