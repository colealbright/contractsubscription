import { TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import './App.css';

const styles = {
  buy: {
    borderRadius: '3px',
    boxShadow: '0px 0px 2px 1px rgba(0, 0, 0, 0.2)',
    backgroundColor: "#95ff91",
    color: "#000000",
    width: '170px',
    '&:hover': {
      filter: 'brightness(85%)',
      backgroundColor: "#95ff91",
    },
  },
}

export default function InfoBox(props) {
  const contract = props.contract;
  const [subscriptionFee, setSubscriptionFee] = useState("");
  const [subscriptionDays, setSubscriptionDays] = useState("");

  const getValues = async() => {
    const days = await contract.getSubscriptionDays();
    const fee = await contract.getSubscriptionFee();
    setSubscriptionFee(ethers.utils.formatEther(fee).toString() + " Ether");
    setSubscriptionDays(days.toString() + " Days");
  }

  const purchaseMemes = async () => {
    await contract.purchase_ownership({value: ethers.utils.parseEther("30")});
  }

  useEffect(() => {
    if (contract !== null){
      getValues();
    }
  }, [contract])

  return (
    <div style={{marginTop: 20}}>
      <div style={{marginTop: 5}}>
        <TextField value={subscriptionDays} readOnly label="Current Subscription Time" variant="filled"></TextField>
      </div>
      <div style={{marginTop: 30}}>
        <TextField value={subscriptionFee} readOnly label="Current Subscription Fee" variant="filled"></TextField>
      </div>
      <div style={{marginTop: 40, marginBottom: 5}}>
        <TextField value="30 Ether" label="Purchase Meme Generator" variant="filled"></TextField>
        <Button variant="contained" onClick={purchaseMemes} style={{marginTop: 5}} sx={styles.buy}>Buy</Button>
      </div>
    </div>
  )
}