import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

// Constants
const TWITTER_HANDLE = 'jia_ayo';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = ["https://media2.giphy.com/media/E6B0Mt3GdpTA1QmwIU/200w.webp","https://media3.giphy.com/media/2tpRmJYw6vbVEyvTbM/200w.webp"]

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [inputValue, setInputValue] = useState("")
  const [gifList , setGifLIst] = useState([])
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
  const sendGif = async()=>{
    if(inputValue.length > 5){
      console.log(`Gif link: ${inputValue}`)
      setGifLIst([...gifList, inputValue])
      setInputValue("")
    }
    else{
      console.log("empty link, input gif link")
    }
  }

  const onInputChange = event =>{
      const {value} = event.target;
      setInputValue(value)
  }

  const renderNotConnectedContainer = ()=>
   ( <button
    className='cta-button connect-wallet-button'
    onClick={connectWallet}
    >
      connect wallet
    </button>
  )

  const renderConnectedContainer = ()=>(
    <div className='connected-container'>
      <form
        onSubmit={event=>{
          event.preventDefault()
          sendGif()
        }}
      >
        <input type="text" placeholder="Enter gif link" value={inputValue} onChange={onInputChange}/>
        <button type="submit" className='cta-button submit-gif-button'>submit</button>
      </form>
      <div className='gif-grid'>
       {
         gifList.map(gif => (
            <div className='gif-item' key={gif}>
               <img src={gif} alt={gif}/>
            </div>
         ))
       }
      </div>
    </div>
  )
    useEffect(()=>{
    const onLoad = async()=>{
      await checkIfWalletIsConnected()
    }
    window.addEventListener("load", onLoad)
    return () => window.remove("load", onLoad)
  },[])
  useEffect(() => {
    if(walletAddress){
      console.log("fetching gif list ...")

      setGifLIst(TEST_GIFS)
    }
  },[walletAddress])
  return (
    <div className="App">
      <div className={walletAddress? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
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
