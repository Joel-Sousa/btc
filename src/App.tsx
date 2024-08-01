import React, { useEffect, useState } from 'react';
import styles from './App.module.css'
import { Button, TextField, Tooltip } from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';
import ClearIcon from '@mui/icons-material/Clear';

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
    // fetch('')
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

        const btcConvert1 = parseInt((valorEmBRL * 1000).toFixed(2)) / parseFloat(data.price)
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

  }, [
    cotacaoFormatado, cotacao,
    brl, sats1
  ]);

  function maskNumber(num: number | string, separator: string = '.'): string {
    let numStr = num.toString();
    let reversedStr = numStr.split('').reverse().join('');
    let maskedReversedStr = reversedStr.replace(/(\d{3}(?!$))/g, `$1${separator}`);
    let maskedStr = maskedReversedStr.split('').reverse().join('');
    return maskedStr;
  }

  const handleUnDot = (e: any) => {
    if (e)
      return e.replace(/\D/g, '').replace('.', '').replace(',', '');
  }

  return (
    <div >
      <div className={styles.section}>
        <TextField
          className={styles.color}
          label="Cotação BTC"
          variant="filled"
          type='text'
          value={cotacaoFormatado}
          InputLabelProps={{ shrink: true }}
          title='Cotação atual do Bitcoin'
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="Data/Hora"
          variant="filled"
          type='text'
          value={time}
          InputLabelProps={{ shrink: true }}
          />

      </div>
      <div className={styles.section}>
        <Tooltip title="Atualizar Cotação" placement="left">
          <Button variant="contained" onClick={() => window.location.reload()}>
            <LoopIcon />
          </Button>
        </Tooltip>
      </div>
      <div className={styles.section}>
        <TextField
          className={styles.color}
          label="BRL"
          variant="filled"
          type='number'
          onChange={(e) => setBrl(handleUnDot(e.target.value))}
          InputLabelProps={{ shrink: true }}
          title='Quantidade em Reais'
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="Sats"
          variant="filled"
          type='number'
          onChange={(e) => setSats1(handleUnDot(e.target.value))}
          InputLabelProps={{ shrink: true }}
          title='Quantidade em Satoshis'
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
          title='Conversão de Reais para Satoshis'
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="Sats->BRL"
          variant="filled"
          type='text'
          InputLabelProps={{ shrink: true }}
          value={brl1}
          title='Conversão de Satoshis para Reais'
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
          title='Conversão de Satoshis para Bitcoin'
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="BRL->BTC"
          variant="filled"
          type='text'
          value={btc1}
          InputLabelProps={{ shrink: true }}
          title='Conversão de Reais para Bitcoin'
        />
      </div>
    </div>
  );
}

export default App;
