import React, { useEffect, useState } from 'react';
import './App.css';
import styled from 'styled-components';
import { motion, useAnimation } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';

import useConnect from './hooks/useConnect';
import useContract from './hooks/useContract';
import myEpicNFT from './contracts/MyEpicNFT.json';
import uruguay from './assets/uruguay.png';
import rarible from './assets/rarible.png';
import 'react-toastify/dist/ReactToastify.css';

const CONTRACT_ADDRESS = '0x2392072242ad1bca1913e21bC3e64F0209246e95';

const Container = styled.div`
  display: flex;
  width: 100%;
  background-color: black;
  height: 100vh;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  position: fixed;
  justify-content: space-between;
  padding: 24px;
  align-items: center;
`;

const Button = styled.button`
  width: 100px;
  height: 42px;
  background: linear-gradient(
    90deg, rgba(0,240,254,1) 0%, rgba(93,254,156,1) 100%);
  border-radius: 12px;
  color: black;
  letter-spacing: 0.5px;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-right: 36px;
`;

const Background = styled(motion.img)`
  opacity: 0.3;
  width: 100%;
  max-width: 550px;
  height: fit-content;
  align-self: center;
`;

const CollectionContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-left: 24px;
  cursor: pointer;
  flex-direction: column;
`;

const CollectionText = styled.span`
  color: white;
`;

const Underline = styled(motion.div)`
  height: 2px;
  background-color: #FFF;
`;

const OpenNFT = styled.span`
  margin-left: 4px;
  text-decoration: underline;
  color: #43afe9;
`;

export const underlineMotion = {
  rest: {
    width: 0,
    transition: {
      duration: 0.45,
      type: "tween",
      ease: "easeIn"
    },
  },
  hover: {
    width: 'auto',
    visibility: 'visible',
    transition: {
      duration: 0.45,
      type: "tween",
      ease: "easeOut"
    }
  }
}

const imageVariant = {
  rest: {
    opacity: 0.3,
    transition: {
      duration: 0.7,
      type: "tween",
      ease: "easeOut",
    }
  },
  loading: {
    opacity: 1,
    transition: {
      duration: 1.7,
      type: "tween",
      repeat: 'Infinity',
      repeatType: "reverse",
      ease: "circIn",
      repeatDelay: 0.20,
    }
  },
}

function App() {
  const { connect, account } = useConnect();
  const [isLoading, setIsLoading] = useState(false);
  const controls = useAnimation();
  const nftContract = useContract(CONTRACT_ADDRESS, myEpicNFT.abi);

  useEffect(() => {
    if (isLoading) {
      controls.start('loading');
    } else {
      controls.start('rest');
    }
  }, [isLoading, controls])

  useEffect(() => {
    nftContract.on("NewNFTMinted", (from, tokenId) => {
      console.log(from, tokenId.toNumber());
      toast(<ToastMessage tokenId={tokenId.toNumber()} />);
    });
    return () => nftContract.removeListener("NewNFTMinted");
  }, [nftContract]);

  const ToastMessage = ({ tokenId }) => (
    <div>
      <span>You've got a new NFT!</span>
      <OpenNFT onClick={() => window.open(`https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId}`)}>
        Check it out
      </OpenNFT>
    </div>
  )

  const mintNFT = async () => {
    let nftTxn = await nftContract.makeAnEpicNFT();

    setIsLoading(true);
    console.log("Mining...please wait.")

    await nftTxn.wait();

    setIsLoading(false);
    console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  }

  return (
    <Container>
      <Header>
        <CollectionContainer
          initial="rest"
          whileHover="hover"
          onClick={() => window.open(`https://rinkeby.rarible.com/collection/${CONTRACT_ADDRESS}`, "_blank")
          }>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CollectionText>Open collection</CollectionText>
            <img src={rarible} alt="Rarible" style={{ width: 48 }} />
          </div>
          <Underline variants={underlineMotion} />
        </CollectionContainer>
        {!account ? <Button onClick={connect}>Connect</Button> : <Button onClick={mintNFT} disabled={isLoading}>Mint</Button>}
      </Header>
      <Background animate={controls} src={uruguay} variants={imageVariant} initial="rest" />
      <ToastContainer closeOnClick={false} />
    </Container>
  );
}

export default App;
