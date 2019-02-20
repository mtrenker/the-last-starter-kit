import * as React from "react"

import styled from "@/lib/styledComponents";
import { IBaseProps } from "./BaseComponent";

interface IProps extends IBaseProps {
  foo: string
}

const Footer: React.FunctionComponent<IProps> = ({className}) => (
  <footer className={className}>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Quidem quia minima hic saepe quae illo reiciendis ut perferendis blanditiis
      eos repellendus iusto quaerat, distinctio molestiae assumenda provident quo nemo alias?
    </p>
  </footer>
)

export const StyledFooter = styled(Footer)`
  color: hotpink;
`;
