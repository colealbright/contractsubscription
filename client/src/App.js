import React, { useEffect, useState, useRef } from "react";
import './App.css'
import Subscription from "./artifacts/contracts/Subscription.sol/Subscription.json";
import { ethers } from "ethers";
import { Button, Typography } from '@mui/material';
import AdminBox from './AdminBox.js';
import InfoBox from './InfoBox.js'
import logo from './logo.jpeg';

const styles = {
  buy: {
    borderRadius: '3px',
    boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.2)',
    backgroundColor: "#63ff88",
    color: "#000000",
    width: '170px',
    '&:hover': {
      filter: 'brightness(85%)',
      backgroundColor: "#63ff88",
    },
  },
  cancel: {
    borderRadius: '3px',
    boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.2)',
    backgroundColor: "#ff6969",
    color: "#000000",
    width: '170px',
    '&:hover': {
      filter: 'brightness(85%)',
      backgroundColor: "#ff6969",
    },
  }, 
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState({days: "0", hours: "00", minutes: "00", seconds: "00"})
  const [contract, setContract] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [randomImage, setRandomImage] = useState("");
  const topTexts = ["Bottom+text", "Corn+Dog", "Whatchu+lookin+at?", "Top+text", "Pop+Tart", "Boi", "EY!+Get+over+here", "Almind?", "Gurlic", "Cachino"];
  const bottomTexts = ["Top+text", "Corn+Puff", "Haha", "Bottom+text", "Boi", "Bing+Bong", "Luncheon+Time", "Banama!", "Nooble", "I'm+the+Beef"];
  const memes = ["Angry-Asian", "2nd-Term-Obama", "Afraid-To-Ask-Andy-Closeup", "Albert-Cagestein", "Ancient-Aliens", "Annoying-Childhood-Friend"];
  const [isOwner, setIsOwner] = useState(false);
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const [noSubText, setNoSubText] = useState("No Subscription");
  let count = 9;

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      setContract(new ethers.Contract(
        contractAddress,
        Subscription.abi,
        signer
      ));
    } catch (error) {
      console.log(error);
    }
  };

  function getLeadingZeroes(num) {
    if (num < 10){
      return "0" + num.toString();
    }
    return num.toString();
  }

  const calculateTimeLeft = async () =>  {
    checkStatus();
    const currentTime = Math.trunc(new Date().getTime()/1000);
    const subscriptionDate = await contract.getSubscriptionTime();
    const subscriptionNum = subscriptionDate.toNumber();
    const difference = subscriptionNum - currentTime;
    if (difference >= 0){
      const hr = getLeadingZeroes(Math.floor((difference / (60 * 60)) % 24));
      const min = getLeadingZeroes(Math.floor((difference / 60) % 60));
      const sec = getLeadingZeroes(Math.floor((difference) % 60));
      setTimeLeft({
        days: Math.floor(difference / (60 * 60 * 24)).toString(),
        hours: hr,
        minutes: min,
        seconds: sec
      })
    } else{
      setTimeLeft({
        days: "0",
        hours: "00",
        minutes: "00",
        seconds: "00"
      })
    }
    setHasSubscription(await contract.hasSubscription());
  }

  const buySubscription = async () =>  {
    if(contract !== null) {
      contract.buySubscription(Math.trunc(new Date().getTime()/1000), {value: contract.getSubscriptionFee()})
    }
  }

  const skipTime = async () =>  {
    if(contract !== null){
      contract.changeSubscription(Math.trunc(new Date().getTime()/1000));
    }
  }

  const checkStatus = async () => {
    if (contract !== null){
      const isSub = await contract.hasSubscription();
      setHasSubscription(isSub);
      const isOwn = await contract.isOwner();
      setIsOwner(isOwn);
      if (isOwn) {
        setNoSubText("Owner get memes forever");
      } else {
        setNoSubText("No Subscription");
      }
      if ((isSub || isOwn) && count === 10) {
        generateMeme();
        count = 0;
      } else if(isSub || isOwn){
        count = count+1;
      }
    }
  }

  function generateMeme(){
    const numA = Math.trunc(memes.length * Math.random());
    const numB = Math.trunc(topTexts.length * Math.random());
    const numC = Math.trunc(bottomTexts.length * Math.random());
    setRandomImage("https://apimeme.com/meme?meme="+memes[numA]+"&top="+topTexts[numB]+"&bottom="+bottomTexts[numC]);
  }

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract !== null){
      const interval = setInterval(() => calculateTimeLeft(), 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [contract]);

  return (
  <div className="gridmain">
    <div className="darkGrid" style={{paddingRight: 5, height: '100vh'}}>
      <img src={logo} width="175px" height="auto" style={{marginLeft: 15, marginTop: 15, boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.2)'}}></img>
      <div style={{padding: 10, border: '1px solid black', marginTop: 15, marginLeft: 5, boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.2)'}}>
        {isOwner ? null : (hasSubscription ? <Button variant="contained" onClick={skipTime} sx={styles.cancel}>Cancel Subscription</Button> : <Button variant="contained" onClick={buySubscription} sx={styles.buy}>Buy Subscription</Button>)}
        {isOwner ? <AdminBox contract={contract}/> : <InfoBox setIsOwner={setIsOwner} contract={contract}/>}
      </div>
    </div>
    <div className="centerGrid">
      {hasSubscription ? <Typography style={{marginBottom: 30}} variant="h3">{timeLeft.days} Days {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</Typography> : <Typography style={{marginBottom: 30}} variant="h3">{noSubText}</Typography>}
      <div className="imageFrame">
        {hasSubscription || isOwner ? <img src={randomImage}></img> : null}
      </div>
    </div>
  </div>
  );
}
