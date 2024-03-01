import React from 'react';

const HomePage: React.FC = () => {


  React.useEffect(() => {

  }, []);

  return (
    <div className="app">
      <div className="header p-2">
        <div className="d-flex align-items-center justify-content-end h-100 w-100">
          <button className="wallet-connect-btn fw-bold">Connect</button>
        </div>
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
                  <div className="pay-amount">0</div>
                  <div className="pay-token">
                    <button
                      className="pay-token-btn text-uppercase fw-bold d-flex align-items-center justify-content-between"
                    >
                      <div className="token-icon">
                        <div className="token-name text-uppercase">ETH</div>
                        <div className="token-icon-img">
                          <img
                            src="assets/images/eth-icon.svg"
                            className="w-100"
                            alt="eth-icon"
                          />
                        </div>
                      </div>
                      <div>eth</div>
                      <img
                        src="assets/images/dropdown-dark-icon.svg"
                        alt="dropdown-icon"
                        className="w-100 ms-2"
                      />
                    </button>
                  </div>
                </div>
                <div className="text-end text-sm mt-1">
                  Balance: 0.0011 <span className="text-highlight pointer">Max</span>
                </div>
              </div>
              <div
                className="arrow-wrapper d-flex align-items-center justify-content-center"
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
                        <div className="token-name text-uppercase">WET</div>
                        <div className="token-icon-img">
                          <img
                            src="assets/images/eth-icon.svg"
                            className="w-100"
                            alt="eth-icon"
                          />
                        </div>
                      </div>
                      <div>weth</div>
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
              <button className="swap-btn">Wrap</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HomePage);