import * as React from 'react';

import { compose } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';

import { StyledFooter } from "@/components/Footer"

class Gateway extends React.PureComponent {
  public render() {
    return (
      <div>
        Test :)
          <StyledFooter />
      </div>
    );
  }
}

export default Gateway;
