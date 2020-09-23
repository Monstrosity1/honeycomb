import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import HoneyIcon from '../../../assets/img/honey.svg'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useAllStakedValue from '../../../hooks/useAllStakedValue'
import useFarms from '../../../hooks/useFarms'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useHoney from '../../../hooks/useSushi'
import { getSushiAddress, getSushiSupply } from '../../../sushi/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'

const PendingRewards: React.FC = () => {
  let start = 0
  let end = 0
  let scale = 1
  return (
    <span
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block',
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
        duration={1}
        onStart={() => {
          //setScale(1.25)
          //setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
    </span>
  )

  // const [start, setStart] = useState(0)
  // const [end, setEnd] = useState(0)
  // const [scale, setScale] = useState(1)

  // const allEarnings = useAllEarnings()
  // let sumEarning = 0
  // for (let earning of allEarnings) {
  //   sumEarning += new BigNumber(earning)
  //     .div(new BigNumber(10).pow(18))
  //     .toNumber()
  // }

  // const [farms] = useFarms()
  // const allStakedValue = useAllStakedValue()

  // if (allStakedValue && allStakedValue.length) {
  //   const sumWeth = farms.reduce(
  //     (c, { id }, i) => c + (allStakedValue[i].totalWethValue.toNumber() || 0),
  //     0,
  //   )
  // }

  // useEffect(() => {
  //   setStart(end)
  //   setEnd(sumEarning)
  // }, [sumEarning])

  // return (
  //   <span
  //     style={{
  //       transform: `scale(${scale})`,
  //       transformOrigin: 'right bottom',
  //       transition: 'transform 0.5s',
  //       display: 'inline-block',
  //     }}
  //   >
  //     <CountUp
  //       start={start}
  //       end={end}
  //       decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
  //       duration={1}
  //       onStart={() => {
  //         setScale(1.25)
  //         setTimeout(() => setScale(1), 600)
  //       }}
  //       separator=","
  //     />
  //   </span>
  // )
}

const Balances: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const honey = useHoney()
  const honeyBalance = useTokenBalance(getSushiAddress(honey))
  const { account, ethereum }: { account: any; ethereum: any } = useWallet()

  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await getSushiSupply(honey)
      setTotalSupply(supply)
    }
    if (honey) {
      fetchTotalSupply()
    }
  }, [honey, setTotalSupply])

  return (
    <StyledWrapper>
      <Card fixedHeight>
        <CardContent>
          <StyledBalances>
            <StyledBalance>
              <StyledRow>
                <img src={HoneyIcon} />
                <Spacer />
                <div style={{ flex: 1 }}>
                  <Label text="Your Honey Balance" />
                  <Value
                    value={!!account ? getBalanceNumber(honeyBalance) : 'Locked'}
                  />
                </div>
              </StyledRow>
            </StyledBalance>
          </StyledBalances>
        </CardContent>
        <Footnote>
          Pending harvest
          <FootnoteValue>
            <PendingRewards /> Honey
          </FootnoteValue>
        </Footnote>
      </Card>
      <Spacer />

      <Card fixedHeight>
        <CardContent>
          <StyledBalance>
          <StyledRow>
            <img src={HoneyIcon} />
            <Spacer />
            <div style={{ flex: 1 }}>
              <Label text="Total Honey Supply" />
              <Value
                value={totalSupply ? getBalanceNumber(totalSupply) : 'Locked'}
              />
            </div>
          </StyledRow>
          </StyledBalance>
        </CardContent>
        {/* Are we doing rewards per block like this?
        
        <Footnote>
          New rewards per block
          <FootnoteValue>1,000 SUSHI</FootnoteValue>
        </Footnote> */}
      </Card>
    </StyledWrapper>
  )
}

const StyledRow = styled.div`
  display: flex;
  align-items: center;
`

const Footnote = styled.div`
  font-size: 14px;
  padding: 8px 20px;
  color: #818181;
  border-top: solid 1px #818181;
`
const FootnoteValue = styled.div`
  font-family: 'Overpass', sans-serif;
  float: right;
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledBalances = styled.div`
  display: flex;
`

const StyledBalance = styled.div`
  align-items: flex-start;
  display: flex;
  flex: 1;
`

export default Balances
