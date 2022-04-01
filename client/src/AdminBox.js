import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { BigNumber, ethers } from "ethers";
import './App.css';


export default function AdminBox(props) {
  const contract = props.contract;
  const [subscriptionFee, setSubscriptionFee] = useState("");
  const [subscriptionDays, setSubscriptionDays] = useState("");
  const [feeError, setFeeError] = useState(false);
  const [dayError, setDayError] = useState(false);

  const getValues = async() => {
    const days = await contract.getSubscriptionDays();
    const fee = await contract.getSubscriptionFee();
    setSubscriptionFee(ethers.utils.formatEther(fee));
    setSubscriptionDays(days);
  }

  function submitDays() {
    if (isNaN(subscriptionFee)){
      setDayError(true);
    } else{
      setDayError(false);
      contract.setSubscriptionDays(BigNumber.from(subscriptionDays));
    }
  }

  function submitFee() {
    if (isNaN(subscriptionFee)){
      setFeeError(true);
    } else{
      setFeeError(false);
      contract.setSubscriptionFee(ethers.utils.parseEther(subscriptionFee));
    }
  }

  useEffect(() => {
    if (contract !== null){
      getValues();
    }
  }, [contract])

  return (
    <div style={{marginTop: 20}}>
      <div style={{marginTop: 5}}>
        <TextField value={subscriptionDays} onChange={(event) => setSubscriptionDays(event.target.value)} label="Subscription Time (Days)" error={dayError}></TextField>
        <Button variant="contained" onClick={submitDays} style={{marginTop: 10}}>Save</Button>
      </div>
      <div style={{marginTop: 40, marginBottom: 5}}>
        <TextField value={subscriptionFee} onChange={(event) => setSubscriptionFee(event.target.value)} label="Subscription Fee (Ether)" error={feeError}></TextField>
        <Button variant="contained" onClick={submitFee} style={{marginTop: 10}}>Save</Button>
      </div>
    </div>
  )
}