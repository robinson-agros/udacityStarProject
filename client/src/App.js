import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import StarNotary from "./contracts/StarNotary.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { starName: null, starId: null, web3: null, accounts: null, contract: null , idInfo:1 ,starInfo: null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = StarNotary.networks[networkId];
      const instance = new web3.eth.Contract(
        StarNotary.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });//, this.runExample);      
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.createStar("estrellita", 7).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.tokenIdToStarInfo(7).call();

    // Update state with the result.
    this.setState({ starName: response });
  };

  starNameChange(event){
    this.setState({starName:event.target.value})
  }

  starIdChange(event){
    this.setState({starId:event.target.value})
  }

  idtooLoodfor(event){
    this.setState({idInfo:event.target.value})
  }

  createStar = async (event) => {
    const { accounts, contract } = this.state;
    await contract.methods.createStar(this.state.starName, this.state.starId).send({ from: accounts[0] });
  }

  lookStarInfo = async (event) => {
    const { accounts, contract } = this.state;
    const result = await contract.methods.lookuptokenIdToStarInfo(this.state.idInfo).call();    
    this.setState({starInfo:result});
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      <br></br>
      <h1>Create a Star</h1>
      <div>
        <label>Star Name: </label><input type="text" onChange={this.starNameChange.bind(this)}></input>
        <div className="divider"/>
        <label>Star Token ID: </label><input type="text" onChange={this.starIdChange.bind(this)}></input>
      </div>      
      <br></br>
      <div>
        <button onClick={this.createStar.bind(this)}>Crate your star now!</button>
      </div>
      <br></br>
      <h1>Look for a Star</h1>
      <div>
        <label> Token to Look For </label><input type="text" onChange={this.idtooLoodfor.bind(this)}></input>
        <div className="divider"/>
        <button onClick={this.lookStarInfo.bind(this)}>Look for your Star</button>
      </div>
      <div>
        <label>Your Star Name is: </label><label>{this.state.starInfo}</label>
      </div>
      </div>
    );
  }
}

export default App;
