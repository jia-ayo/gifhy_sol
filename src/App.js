import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

// Constants
const TWITTER_HANDLE = 'jia_ayo';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const checkIfWalletIsConnected = async()=>{
    try{
      const {solana} = window;
      if (solana) {
        if (solana.isPhantom){
          console.log("Phantom wallet found")

          const response = await solana.connect({onlyIfTrusted: true})
          console.log(`connected with e wallet of publickey: ${response.publicKey.toString()}`)
          setWalletAddress(response.publicKey.toString())
        }
      }else{
        alert("solana object not found! get a phantom wallet")
      }
    }catch (error){
      console.error(error)
    }
  }

  const connectWallet = async ()=>{
    const {solana} = window;
    if(solana){
      const response = solana.connect();
      console.log(`connected with e wallet of publickey: ${response.publicKey.toString()}`)
      setWalletAddress(response.publicKey.toString())
    }
  };

  const renderNotConnectedContainer = ()=>
   ( <button
    className='cta-button connect-wallet-button'
    onClick={connectWallet}
    >
      connect wallet
    </button>)
    useEffect(()=>{
    const onLoad = async()=>{
      await checkIfWalletIsConnected()
    }
    window.addEventListener("load", onLoad)
    return () => window.remove("load", onLoad)
  },[])
  return (
    <div className="App">
      <div className={walletAddress? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
