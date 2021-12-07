import React, { useEffect } from 'react';
import './App.css';
import styled from 'styled-components';

import useConnect from './hooks/useConnect';
import useContract from './hooks/useContract';
import myEpicNFT from './contracts/MyEpicNFT.json';
import uruguay from './assets/uruguay.png';
import rarible from './assets/rarible.png';

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

const Background = styled.img`
  opacity: 0.3;
  width: 100%;
  max-width: 550px;
  height: fit-content;
  align-self: center;
`;

const CollectionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 24px;
`;

const CollectionText = styled.span`
  color: white;
`;

function App() {
  const { connect, account } = useConnect();
  const nftContract = useContract(CONTRACT_ADDRESS, myEpicNFT.abi)

  useEffect(() => {
    nftContract.on("NewNFTMinted", (from, tokenId) => {
      console.log(from, tokenId.toNumber())
      alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}>`)
    });
    return () => nftContract.removeListener("NewNFTMinted");
  }, [nftContract]);

  const mintNFT = async () => {
    console.log("Going to pop wallet now to pay gas...")
    let nftTxn = await nftContract.makeAnEpicNFT();

    console.log("Mining...please wait.")
    await nftTxn.wait();

    console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  }

  return (
    <Container>
      <Header>
        <CollectionContainer>
          <CollectionText>Open collection</CollectionText>
          <img src={rarible} alt="Rarible" style={{ width: 48 }}/>
        </CollectionContainer>
        {!account ? <Button onClick={connect}>Connect</Button> : <Button onClick={mintNFT}>Mint</Button>}
      </Header>
      <Background src={uruguay} />
    </Container>
  );
}

export default App;
