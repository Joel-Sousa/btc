import React, { useEffect, useState } from 'react';
import styles from './App.module.css'
import { TextField } from '@mui/material';

function App() {

  const [cotacaoFormatado, setCotacaoFormatado] = useState('' as any);
  const [cotacao, setCotacao] = useState('' as any);

  const [time, setTime] = useState('' as any);

  const [btc, setBtc] = useState('' as any);
  const [sats, setSats] = useState('' as any);
  const [brl, setBrl] = useState('' as any);

  const [btc1, setBtc1] = useState('' as any);
  const [sats1, setSats1] = useState('' as any);
  const [brl1, setBrl1] = useState('' as any);

  useEffect(() => {
    
      if (!brl) setBrl(0);
      if (!sats1) setSats1(0);

      fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCBRL')
        .then((response) => response.json())
        .then((data) => {

          // sats
          const price = data.price / Math.pow(10, 3);

          setCotacaoFormatado(price.toFixed(3))
          setCotacao(price.toFixed(8))

          const btcConvert = parseInt(brl) / parseFloat(data.price)

          setBtc(btcConvert.toFixed(8))

          const satsConvert = (brl / parseFloat(data.price)) * Math.pow(10, 8)

          setSats(maskNumber(satsConvert.toFixed(0)))

          // brl
          const valorEmBTC = sats1 / 100000000;
          const valorEmBRL = valorEmBTC * cotacaoFormatado;
          setBrl1((valorEmBRL * 1000).toFixed(2));

          const btcConvert1 = parseInt(brl1) / parseFloat(data.price)
          setBtc1(btcConvert1.toFixed(8))
        })

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Os meses começam em 0
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      // const seconds = now.getSeconds();

      const timer = day + '/' + month + '/' + year + ' | ' + hours + ':' + minutes;
      setTime(timer)

  }, [cotacaoFormatado, cotacao,
    btc, sats, brl,
    btc1, sats1, brl1,

  ]);

  function maskNumber(num: number | string, separator: string = '.'): string {
    let numStr = num.toString();
    let reversedStr = numStr.split('').reverse().join('');
    let maskedReversedStr = reversedStr.replace(/(\d{3}(?!$))/g, `$1${separator}`);
    let maskedStr = maskedReversedStr.split('').reverse().join('');
    return maskedStr;
  }

  return (
    <div /* style={{marginBottom: '1000px'}} */>
      <div className={styles.section}>
        <TextField
          className={styles.color}
          label="Cotação BTC"
          variant="filled"
          type='text'
          value={cotacaoFormatado}
          InputLabelProps={{ shrink: true }}
        />
        | {time}
      </div>
      <div className={styles.section}>
        <TextField
          className={styles.color}
          label="BRL"
          variant="filled"
          // type='search'
          type='number'
          onChange={(e) => setBrl(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="Sats"
          variant="filled"
          // type='search'
          type='number'
          onChange={(e) => setSats1(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <div className={styles.section}>
        <TextField
          className={styles.color}
          label="BRL->Sats"
          variant="filled"
          type='text'
          value={sats}
          InputLabelProps={{ shrink: true }}
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="Sats->BRL"
          variant="filled"
          type='text'
          InputLabelProps={{ shrink: true }}
          value={brl1}
        />
      </div>
      <div className={styles.section}>
        <TextField
          className={styles.color}
          label="Sats->BTC"
          variant="filled"
          type='text'
          value={btc}
          InputLabelProps={{ shrink: true }}
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="BRL->BTC"
          variant="filled"
          type='text'
          value={btc1}
          InputLabelProps={{ shrink: true }}
        />
      </div>
    </div>
  );
}

export default App;
