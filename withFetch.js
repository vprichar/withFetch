import React from 'react';
import Rx from 'rxjs/Rx';
import { isFunction, noop } from 'lodash';
import { withState, compose, withHandlers } from 'recompose';

const withData = withState('data', 'updateData', { refetch: noop, loading: true, error: null });

const withDataHandlers = withHandlers({
  onResult: ({ updateData }) => (result) => updateData((data) => ({ result, data })),
  onError: ({ updateData }) => (err) => updateData((data) => ({ data, err })),
});

const withDataManager = compose(withData, withDataHandlers);


const withFetch = (url, whenMounted, Observa = {}) => (Component) => {
  class withFetchedData extends React.Component {

    state = {
      data: (data) => data,
      onErro: () => {},
      loading: false,
    };

    componentDidMount() {
      if (whenMounted) {
        this.dofetch();
      }
    }


    dofetch = (completed) => {
      this.setState({ loading: true });
      Rx.Observable.from(
        fetch(url,
          { headers: {} }
        ).then((data) => data.json())
      ).subscribe(
       (data) => isFunction(completed) ? completed({ data, status: 'ok' }) : this.setState({ data }),
       (onErro) => isFunction(completed) ? completed({ error: onErro, status: 'error' }) : this.setState({ onErro }),
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

  return withDataManager(withFetchedData);
};


export { withFetch };