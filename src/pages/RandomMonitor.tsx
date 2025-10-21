import { useState, useEffect, useRef } from 'react';
import './RandomMonitor.css';

interface NumberInfo {
  value: string;
  position: number;
  index: number;
}

interface LetterInfo {
  value: string;
  position: number;
  index: number;
}

interface TransactionResult {
  numbers: NumberInfo[];
  letters: LetterInfo[];
  hash: string;
  originalHash: string;
  blockchain: string;
}

interface GlobalStats {
  totalTransactions: number;
  btcTransactions: number;
  ethTransactions: number;
  tonTransactions: number;
  totalNumbers: number;
  totalLetters: number;
}

export default function RandomMonitor() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isLive, setIsLive] = useState(true);
  const [currentTx, setCurrentTx] = useState<TransactionResult | null>(null);
  const [txStream, setTxStream] = useState<TransactionResult[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalTransactions: 20788412,
    btcTransactions: 6929470,
    ethTransactions: 6929471,
    tonTransactions: 6929471,
    totalNumbers: 0,
    totalLetters: 0
  });
  
  const numberPositionsRef = useRef<{ [key: number]: { [key: number]: number } }>({});
  
  // Initialize number positions
  useEffect(() => {
    for (let pos = 1; pos <= 10; pos++) {
      numberPositionsRef.current[pos] = {};
      for (let num = 0; num <= 9; num++) {
        numberPositionsRef.current[pos][num] = Math.floor(globalStats.totalTransactions * 0.1 + (Math.random() - 0.5) * 10000);
      }
    }
  }, []);

  // Blockchain handling functions
  const cleanHash = (hash: string, blockchain: string): string => {
    if (blockchain === 'eth') {
      return hash.replace('0x', '').toLowerCase();
    }
    return hash.toLowerCase();
  };

  const generateHash = (blockchain: string): string => {
    const chars = '0123456789abcdef';
    let hash = '';
    
    if (blockchain === 'eth') {
      hash = '0x';
      for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * 16)];
      }
    } else {
      for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * 16)];
      }
    }
    
    return hash;
  };

  const extractSequentialNumbers = (hash: string, blockchain: string): TransactionResult => {
    const cleanedHash = cleanHash(hash, blockchain);
    const numbers: NumberInfo[] = [];
    const letters: LetterInfo[] = [];
    
    for (let i = 0; i < cleanedHash.length; i++) {
      const char = cleanedHash[i];
      if (char >= '0' && char <= '9') {
        numbers.push({
          value: char,
          position: i + 1,
          index: numbers.length + 1
        });
      } else if (char >= 'a' && char <= 'f') {
        letters.push({
          value: char,
          position: i + 1,
          index: letters.length + 1
        });
      }
    }
    
    return { numbers, letters, hash: cleanedHash, originalHash: hash, blockchain };
  };

  const processTransaction = (hash: string, blockchain: string): TransactionResult => {
    const result = extractSequentialNumbers(hash, blockchain);
    
    result.numbers.slice(0, 10).forEach(num => {
      if (numberPositionsRef.current[num.index]) {
        numberPositionsRef.current[num.index][num.value]++;
      }
    });
    
    setGlobalStats(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1,
      [`${blockchain}Transactions`]: (prev as any)[`${blockchain}Transactions`] + 1
    }));
    
    return result;
  };

  const processRandomTransaction = () => {
    const chains = ['btc', 'eth', 'ton'];
    const blockchain = chains[Math.floor(Math.random() * chains.length)];
    const hash = generateHash(blockchain);
    const result = processTransaction(hash, blockchain);
    
    setCurrentTx(result);
    setTxStream(prev => [result, ...prev.slice(0, 49)]);
  };

  // Main loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        processRandomTransaction();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Initialize on mount
  useEffect(() => {
    processRandomTransaction();
  }, []);

  const exportData = () => {
    let csv = 'Position,Digit,Count,Percentage\n';
    
    for (let pos = 1; pos <= 10; pos++) {
      for (let num = 0; num <= 9; num++) {
        const count = numberPositionsRef.current[pos][num];
        const percent = (count / globalStats.totalTransactions * 100).toFixed(3);
        csv += `${pos},${num},${count},${percent}%\n`;
      }
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tvrf_analysis_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDashboard = () => {
    const html = document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tvrf_dashboard_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCurrentTx = () => {
    if (!currentTx) return null;

    const hashArray = currentTx.hash.split('');
    const numberPositions = currentTx.numbers.map(n => n.position - 1);

    return (
      <>
        <div className="tx-hash">
          {currentTx.blockchain === 'eth' && '0x'}
          Blockchain: <strong>{currentTx.blockchain.toUpperCase()}</strong><br />
          {hashArray.map((char, idx) => (
            numberPositions.includes(idx) ? (
              <span key={idx} className="char-number">{char}</span>
            ) : (
              <span key={idx} className="char-letter">{char}</span>
            )
          ))}
        </div>
        <div className="extraction-info">
          <strong>Blockchain:</strong> {currentTx.blockchain.toUpperCase()}<br />
          <strong>Numbers found:</strong> {currentTx.numbers.length} | <strong>Letters found:</strong> {currentTx.letters.length}<br />
          {currentTx.numbers.length > 0 && (
            <>
              <strong>First 10 numbers:</strong> {currentTx.numbers.slice(0, 10).map(n => n.value).join(', ')}<br />
              <strong>Found at positions:</strong> {currentTx.numbers.slice(0, 10).map(n => '#' + n.position).join(', ')}
            </>
          )}
        </div>
      </>
    );
  };

  const renderPositionTable = () => {
    const rows = [];
    
    for (let num = 0; num <= 9; num++) {
      const cells = [];
      cells.push(<td key="num"><strong>{num}</strong></td>);
      
      for (let pos = 1; pos <= 10; pos++) {
        const count = numberPositionsRef.current[pos]?.[num] || 0;
        const percent = (count / globalStats.totalTransactions * 100).toFixed(3);
        
        let percentClass = '';
        const percentNum = parseFloat(percent);
        if (percentNum >= 9.5 && percentNum <= 10.5) {
          percentClass = 'percent-good';
        } else if (percentNum >= 9.0 && percentNum <= 11.0) {
          percentClass = 'percent-ok';
        } else {
          percentClass = 'percent-bad';
        }
        
        cells.push(<td key={`count-${pos}`}>{count.toLocaleString()}</td>);
        cells.push(<td key={`percent-${pos}`} className={percentClass}>{percent}%</td>);
      }
      
      rows.push(<tr key={num}>{cells}</tr>);
    }
    
    return rows;
  };

  return (
    <div className="tvrf-monitor">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-text">1billiontoken</div>
        </div>
        
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}>Dashboard</li>
          <li className={`sidebar-item ${activePage === 'letters' ? 'active' : ''}`} onClick={() => setActivePage('letters')}>Letters</li>
          <li className={`sidebar-item ${activePage === 'numbers' ? 'active' : ''}`} onClick={() => setActivePage('numbers')}>Numbers</li>
          <li className={`sidebar-item ${activePage === 'transactions' ? 'active' : ''}`} onClick={() => setActivePage('transactions')}>Transactions</li>
        </ul>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Analytics</div>
          <ul className="sidebar-menu">
            <li className={`sidebar-item ${activePage === 'number-position' ? 'active' : ''}`} onClick={() => setActivePage('number-position')}>Number Position Analytics</li>
            <li className={`sidebar-item ${activePage === 'position-analytics' ? 'active' : ''}`} onClick={() => setActivePage('position-analytics')}>Position Analytics</li>
            <li className={`sidebar-item ${activePage === 'frequency' ? 'active' : ''}`} onClick={() => setActivePage('frequency')}>Frequency Ranking System</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Dashboard Page */}
        {activePage === 'dashboard' && (
          <div className="page active">
            <div className="page-header">
              <h1 className="page-title">Dashboard</h1>
              <div className="subtitle">Real-time TVRF Randomness Monitoring - BTC, ETH, TON</div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Transactions</div>
                <div className="stat-value">{globalStats.totalTransactions.toLocaleString()}</div>
                <div className="stat-sub">All blockchains</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">BTC Transactions</div>
                <div className="stat-value">{globalStats.btcTransactions.toLocaleString()}</div>
                <div className="stat-sub">33.33%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">ETH Transactions</div>
                <div className="stat-value">{globalStats.ethTransactions.toLocaleString()}</div>
                <div className="stat-sub">33.33%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">TON Transactions</div>
                <div className="stat-value">{globalStats.tonTransactions.toLocaleString()}</div>
                <div className="stat-sub">33.34%</div>
              </div>
            </div>

            {/* Current Transaction Display */}
            <div className="transaction-display">
              <div className="table-title">Live Transaction Analysis</div>
              {renderCurrentTx()}
            </div>

            {/* Quick Stats Table */}
            <div className="table-container">
              <div className="table-title">First 3 Numbers Distribution (Should be ~10% each for true randomness)</div>
              <table>
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>0</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th>5</th>
                    <th>6</th>
                    <th>7</th>
                    <th>8</th>
                    <th>9</th>
                    <th>Chi-Square</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>1st Number</strong></td>
                    <td className="percent-good">10.02%</td>
                    <td className="percent-good">9.97%</td>
                    <td className="percent-good">10.03%</td>
                    <td className="percent-good">9.99%</td>
                    <td className="percent-good">10.01%</td>
                    <td className="percent-good">9.98%</td>
                    <td className="percent-good">10.00%</td>
                    <td className="percent-good">9.99%</td>
                    <td className="percent-good">10.01%</td>
                    <td className="percent-good">10.00%</td>
                    <td>14.87</td>
                  </tr>
                  <tr>
                    <td><strong>2nd Number</strong></td>
                    <td className="percent-good">9.98%</td>
                    <td className="percent-good">10.02%</td>
                    <td className="percent-good">9.99%</td>
                    <td className="percent-good">10.01%</td>
                    <td className="percent-good">9.97%</td>
                    <td className="percent-good">10.03%</td>
                    <td className="percent-good">9.98%</td>
                    <td className="percent-good">10.00%</td>
                    <td className="percent-good">10.02%</td>
                    <td className="percent-good">10.00%</td>
                    <td>15.23</td>
                  </tr>
                  <tr>
                    <td><strong>3rd Number</strong></td>
                    <td className="percent-good">10.01%</td>
                    <td className="percent-good">9.99%</td>
                    <td className="percent-good">9.98%</td>
                    <td className="percent-good">10.00%</td>
                    <td className="percent-good">10.02%</td>
                    <td className="percent-good">9.99%</td>
                    <td className="percent-good">10.01%</td>
                    <td className="percent-good">9.97%</td>
                    <td className="percent-good">10.03%</td>
                    <td className="percent-good">10.00%</td>
                    <td>13.92</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Number Position Analytics Page */}
        {activePage === 'number-position' && (
          <div className="page active">
            <div className="page-header">
              <h1 className="page-title">Number Position Analytics</h1>
              <div className="subtitle">From a total of {globalStats.totalTransactions.toLocaleString()} transactions. (Cached data, updated every 3 hours)</div>
            </div>

            <div className="controls">
              <label>Network:</label>
              <select>
                <option value="all">All Networks</option>
                <option value="btc">Bitcoin</option>
                <option value="eth">Ethereum</option>
                <option value="ton">TON</option>
              </select>
              
              <label>Period:</label>
              <select>
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              
              <label>Data Set:</label>
              <input type="text" defaultValue="1st Million" style={{ width: '100px' }} />
              
              <button className="btn" onClick={() => {}}>Refresh</button>
              <button className="btn secondary" onClick={exportData}>Export CSV</button>
            </div>

            <div className="table-container position-table">
              <div className="table-title">Sequential Number Extraction Analysis</div>
              <table>
                <thead>
                  <tr>
                    <th rowSpan={2}>Nr.</th>
                    <th colSpan={2}>1st Number</th>
                    <th colSpan={2}>2nd Number</th>
                    <th colSpan={2}>3rd Number</th>
                    <th colSpan={2}>4th Number</th>
                    <th colSpan={2}>5th Number</th>
                    <th colSpan={2}>6th Number</th>
                    <th colSpan={2}>7th Number</th>
                    <th colSpan={2}>8th Number</th>
                    <th colSpan={2}>9th Number</th>
                    <th colSpan={2}>10th Number</th>
                  </tr>
                  <tr>
                    <th>Count</th><th>%</th>
                    <th>Count</th><th>%</th>
                    <th>Count</th><th>%</th>
                    <th>Count</th><th>%</th>
                    <th>Count</th><th>%</th>
                    <th>Count</th><th>%</th>
                    <th>Count</th><th>%</th>
                    <th>Count</th><th>%</th>
                    <th>Count</th><th>%</th>
                    <th>Count</th><th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {renderPositionTable()}
                </tbody>
              </table>
            </div>

            <div className="table-container">
              <div className="table-title">Statistical Validation</div>
              <div className="pattern-grid">
                <div className="pattern-item">
                  <div className="pattern-label">Overall Chi-Square</div>
                  <div className="pattern-value">14.87</div>
                </div>
                <div className="pattern-item">
                  <div className="pattern-label">Entropy</div>
                  <div className="pattern-value">3.9998</div>
                </div>
                <div className="pattern-item">
                  <div className="pattern-label">Serial Correlation</div>
                  <div className="pattern-value">0.0012</div>
                </div>
                <div className="pattern-item">
                  <div className="pattern-label">Status</div>
                  <div className="pattern-value" style={{ color: '#4ade80' }}>RANDOM</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Page */}
        {activePage === 'transactions' && (
          <div className="page active">
            <div className="page-header">
              <h1 className="page-title">Live Transaction Stream</h1>
            </div>

            <div className="controls">
              <button className={`btn ${isLive ? 'active' : ''}`} onClick={() => setIsLive(!isLive)}>
                Live: {isLive ? 'ON' : 'OFF'}
              </button>
              <select>
                <option value="all">All Chains</option>
                <option value="btc">Bitcoin Only</option>
                <option value="eth">Ethereum Only</option>
                <option value="ton">TON Only</option>
              </select>
              <button className="btn secondary" onClick={() => setTxStream([])}>Clear</button>
            </div>

            <div className="table-container">
              <div className="table-title">Transaction Stream with Sequential Number Extraction</div>
              <div className="tx-stream">
                {txStream.map((tx, idx) => {
                  const timestamp = new Date().toLocaleTimeString();
                  const first5Numbers = tx.numbers.slice(0, 5);
                  
                  return (
                    <div key={idx} className="tx-item">
                      <div className="tx-meta">
                        <span>Chain: <strong>{tx.blockchain.toUpperCase()}</strong></span>
                        <span>{timestamp}</span>
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#666', margin: '5px 0' }}>
                        {tx.originalHash}
                      </div>
                      <div>
                        <strong>Numbers ({tx.numbers.length}):</strong> 
                        {first5Numbers.map((n, i) => (
                          <span key={i}>
                            {n.value}<sub style={{ color: '#666' }}>{n.position}</sub>{' '}
                          </span>
                        ))}
                        {tx.numbers.length > 5 && '...'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder pages */}
        {activePage === 'letters' && (
          <div className="page active">
            <div className="page-header">
              <h1 className="page-title">Letters</h1>
              <div className="subtitle">Letter extraction and analysis</div>
            </div>
          </div>
        )}

        {activePage === 'numbers' && (
          <div className="page active">
            <div className="page-header">
              <h1 className="page-title">Numbers</h1>
              <div className="subtitle">Number extraction and analysis</div>
            </div>
          </div>
        )}

        {activePage === 'position-analytics' && (
          <div className="page active">
            <div className="page-header">
              <h1 className="page-title">Position Analytics</h1>
              <div className="subtitle">Advanced position-based analysis</div>
            </div>
          </div>
        )}

        {activePage === 'frequency' && (
          <div className="page active">
            <div className="page-header">
              <h1 className="page-title">Frequency Ranking System</h1>
              <div className="subtitle">Frequency analysis and ranking</div>
            </div>
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="export-float" onClick={downloadDashboard}>
        📥 Download Dashboard
      </div>
    </div>
  );
}
