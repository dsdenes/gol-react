import { Slider } from 'antd'
import { SliderSingleProps } from 'antd/lib/slider'
import React from 'react'
import styled from 'styled-components'

const StylesSlider = styled(Slider)`
  width: 200px;
`
export const ControlSlider: React.FC<SliderSingleProps> = (props) => {
  return (
    <StylesSlider
      value={props.value}
      min={100}
      max={1000}
      tooltipPlacement='bottom'
      onChange={props.onChange}
    />
  )
}
