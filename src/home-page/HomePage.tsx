import React, { useEffect, useState } from 'react';
import ButtonConnectWallet from '../components/common/ButtonConnectWallet';
import useUniswapHooks from '../hooks/useUniswapHooks';
import { TOKEN_LIST } from '../utils/Consts';
import { UI } from '../utils';
import { LoadingOutlined } from '@ant-design/icons';

let interval: any = null;
const WAIT_TIME = 30;

const HomePage: React.FC = () => {
  const { UseSwap } = useUniswapHooks();
  const [hash, setHash] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pairSwap, setPairSwap] = useState<any[]>([
    TOKEN_LIST.WETH,
    TOKEN_LIST.UNI,
  ]);

  useEffect(() => {
    return function cleanUp() {
      clearInterval(interval);
    }
  }, []);

  const startTimer = (waittime: number) => {
    interval = setInterval(() => {
      setTimer(waittime);
      waittime -= 1;
      if (waittime <= -1) {
        clearInterval(interval);
      }
    }, 1000);
  }

  const handleSwap = async () => {
    setHash('');
    setLoading(true);
    let result = await UseSwap(pairSwap[0].address, pairSwap[1].address, 0.01);
    if (result.status === 'ERROR') {
      UI.toastError('Error to swap!');
      setLoading(false);
      return;
    }
    if (result.status === 'APPROVING') {
      UI.toastInfo('Approving, please wait in 30s');
      startTimer(WAIT_TIME);
      const receive = await result.result.wait();
      if (receive.status === 1) {
        result = await UseSwap(TOKEN_LIST.WETH.address, TOKEN_LIST.UNI.address, 0.01, true);
        setLoading(false);
        setHash(result.result.hash);
        setTimer(0);
        clearInterval(interval);
      } else {
        UI.toastError('Unable to swap!');
      }
      return;
    }

    setLoading(false);
    setHash(result.result.hash);
  }

  const handleChangeIndexSwap = () => {
    const old = pairSwap;
    const newPair = [old[1], old[0]];
    setPairSwap(newPair);
  }

  return (
    <div className="app">
      <div className="header p-2">
        <ButtonConnectWallet />
      </div>
      {/* <!-- main --> */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col col-lg-5">
            <div className="d-flex flex-column px-md-4 py-5">
              <div className="swap-task">Swap</div>
              <div className="you-pay-sec mt-2">
                <div className="">You pay</div>
                <div
                  className="pay-input-sec d-flex align-items-center justify-content-between"
                >
                  <div className="pay-amount">0.001</div>
                  <div className="pay-token">
                    <button
                      className="pay-token-btn text-uppercase fw-bold d-flex align-items-center justify-content-between"
                    >
                      <div className="token-icon">
                        <div className="token-name text-uppercase">{pairSwap[0].name}</div>
                        <div className="token-icon-img">
                          <img
                            src={`assets/images/${pairSwap[0].icon}`}
                            className="w-100"
                            alt={`${pairSwap[0].name}-icon`}
                          />
                        </div>
                      </div>
                      <div>{pairSwap[0].name}</div>
                      <img
                        src="assets/images/dropdown-dark-icon.svg"
                        alt="dropdown-icon"
                        className="w-100 ms-2"
                      />
                    </button>
                  </div>
                </div>
                <div className="text-end text-sm mt-1">
                  Balance: comming <span className="text-highlight pointer">Max</span>
                </div>
              </div>
              <div
                className="arrow-wrapper d-flex align-items-center justify-content-center"
                style={{ cursor: 'pointer' }}
                onClick={handleChangeIndexSwap}
              >
                <div
                  className="arrow-down-icon d-flex align-items-center justify-content-center"
                >
                  <img
                    src="assets/images/arrow-down.svg"
                    alt="arrow-down"
                    className="w-100"
                  />
                </div>
              </div>
              <div className="you-pay-sec">
                <div className="">You receive</div>
                <div
                  className="pay-input-sec d-flex align-items-center justify-content-between"
                >
                  <div className="pay-amount">0</div>
                  <div className="pay-token">
                    <button
                      className="pay-token-btn text-uppercase fw-bold d-flex align-items-center justify-content-between"
                    >
                      <div className="token-icon">
                        <div className="token-name text-uppercase">{pairSwap[1].name}</div>
                        <div className="token-icon-img">
                          <img
                            src={`assets/images/${pairSwap[1].icon}`}
                            className="w-100"
                            alt={`${pairSwap[1].name}-icon`}
                          />
                        </div>
                      </div>
                      <div>{pairSwap[1].name}</div>
                      <img
                        src="assets/images/dropdown-dark-icon.svg"
                        alt="dropdown-icon"
                        className="w-100 ms-2"
                      />
                    </button>
                  </div>
                </div>
                <div className="text-end text-sm mt-1">Balance: 0</div>
              </div>
              <button disabled={loading} onClick={handleSwap} className={`swap-btn ${loading ? 'disable' : ''}`}>Swap {timer >= 1 && (<span>({timer})</span>)}
                {loading && timer <= 0 && (<LoadingOutlined />)}
              </button>
              <div className='mt-3'>
                {hash && (
                  <div>
                    <span className='text-success fw-bod'>Swap Success:&nbsp;</span>
                    <span>
                      <a target='_blank' rel="noreferrer" href={`https://goerli.etherscan.io/tx/${hash}`}>View On Block Explorer</a>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HomePage);