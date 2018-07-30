import React from 'react';
import Rx from 'rxjs/Rx';
import { isFunction, isEmpty } from 'lodash';

const withFetch = (url, whenMounted, Observa = {}, miInit) => (Component) => {
  class withFetchedData extends React.Component {

    state = {
      data: (data) => data,
      onErro: false,
      loading: false,
    };

    componentDidMount() {
      if (whenMounted) {
        this.dofetch();
      }
    }

    dofetch = (completed, destas) => {
      this.setState({ loading: true });
      const promise1 = fetch(url,
        isEmpty(destas) ? miInit : destas
      ).then((data) => data.json());

      Rx.Observable.fromPromise(promise1).subscribe(
        (data) => isFunction(completed) ? completed({ data, status: 'ok', error: null }) : this.setState({ data }),
        (err) => isFunction(completed) ? completed({ data: null, status: 'error', error: err }) : this.setState({ err }),
        () => { this.setState({ loading: false }); }
      );
    }

    render() {
      return (<Component
        getData={this.dofetch}
        {...this.props}
        {...this.state}
        {...Observa.props({ ownProps: { ...this.props }, getData: this.dofetch })}
      />);
    }
    }
  return withFetchedData;
};


export { withFetch };
