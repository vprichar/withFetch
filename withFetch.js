import React from 'react';

const withFetch = (url) => {
	return (Component) => {
		return class withFetchedData extends React.Component {
			constructor(props) {
				super(props);
				this.state = {
					data: []
				}
			}
			componentDidMount() {
				fetch(url)
					.then(r => r.json())
					.then(data => this.setState({ data }))
					.catch(error => console.log(error))
			}
			render() {
				const { data } = this.state;
				return (
					<Component
						data={data}
						{...this.props}
						{...this.state}
					/>
				)
			}
		}
	}
}

export {
	withFetch
}