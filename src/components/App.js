import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';


class App extends React.Component {

  constructor() {
    super();

    this.addFish = this.addFish.bind(this); 
    this.removeFish = this.removeFish.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    this.loadSamples = this.loadSamples.bind(this);

    this.state = {
      fishes: {},
      order: {}
    };
  }
 
  componentDidMount() {
    this.ref = base.syncState('glamorous-long-teeth/fishes', {
      context: this,
      state: 'fishes'
    });

    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if(localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish(fish) {
    const fishes = {...this.state.fishes};
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    this.setState({ fishes });
  }
 
  updateFish = (key, updatedFish) => {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({ fishes });
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder(key) {
    const order = {...this.state.order};
    order[key] = order[key] + 1 || 1;
    this.setState({ order });
  }

  removeFromOrder(key) {
    const order = {...this.state.order};
    delete order[key];
    this.setState({ order });
  }
  
  removeFish(key) {
    const fishes = {...this.state.fishes};
    if (confirm("Are you sure you want to remove this fish?!")) {
      fishes[key] = null;
      this.setState({ fishes });
    }
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
	  <ul className="list-of-fishes">
	     { Object
		.keys(this.state.fishes)
		.map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
	     }
	  </ul>
        </div>
	<Order 
	  fishes={this.state.fishes}
	  order={this.state.order} 
	  removeFromOrder={this.removeFromOrder}
	/>
	<Inventory 
	  addFish={this.addFish}
	  loadSamples={this.loadSamples}
	  fishes={this.state.fishes}
	  updateFish={this.updateFish}
	  removeFish={this.removeFish}
	/>
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default App;
