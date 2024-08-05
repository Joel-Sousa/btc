import React, { useEffect, useState } from 'react';
import styles from './App.module.css'
import { Button, TextField, Tooltip } from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';
import {currencyBrlMask} from 'util-mask';

function App() {

  const [cotacaoFormatado, setCotacaoFormatado] = useState('' as any);

  const [cotacao, setCotacao] = useState('' as any);

  const [time, setTime] = useState('' as any);

  const [btc, setBtc] = useState('' as any);
  const [sats, setSats] = useState('' as any);

  const [btc1, setBtc1] = useState('' as any);
  const [brl1, setBrl1] = useState('' as any);

  const [valorBrlSats, setValorBrlSats] = useState('' as any);

  const [btcCustom, setBtcCustom] = useState('' as any);
  const [brlCustom, setBrlCustom] = useState('' as any);
  const [qtdCustom, setQtdCustom] = useState('' as any);

  useEffect(() => {

    if (!valorBrlSats) setValorBrlSats(0);

    fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCBRL')
    // fetch('')
      .then((response) => response.json())
      .then((data) => {

        // sats
        const price = data.price / Math.pow(10, 3);

        setCotacaoFormatado(price.toFixed(3));
        setCotacao(price.toFixed(8));

        const satsConvert = (valorBrlSats / parseFloat(data.price)) * Math.pow(10, 8);
        const btcConvert = parseInt(valorBrlSats) / parseFloat(data.price);
        
        setSats(maskNumber(satsConvert.toFixed(0)));
        setBtc(btcConvert.toFixed(8));

        // brl
        const valorEmBTC = valorBrlSats / 100000000;
        const valorEmBRL = valorEmBTC * cotacaoFormatado;

        setBrl1(currencyBrlMask((valorEmBRL * 1000)));
        
        const btcConvert1 = parseInt((valorEmBRL * 1000).toFixed(2)) / parseFloat(data.price)
        setBtc1(btcConvert1.toFixed(8))
      })

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Os meses começam em 0
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const timer = day + '/' + month + '/' + year + ' | ' + hours + ':' + minutes;
    setTime(timer)

  }, [
    cotacaoFormatado, cotacao,
    valorBrlSats
  ]);

  useEffect(() => {
    const vlrBtc = (btcCustom / Math.pow(10, 0)).toFixed(3);
    const vlrSats = ((brlCustom / parseFloat(vlrBtc)) * Math.pow(10, 2)).toFixed(3)

    setQtdCustom(maskNumber(handleUnDot(vlrSats)))
  },[
    btcCustom, brlCustom, qtdCustom
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
          disabled
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="Data/Hora"
          variant="filled"
          type='text'
          value={time}
          disabled
          InputLabelProps={{ shrink: true }}
          />
      </div>

      <div className={styles.section}>
        <TextField
          className={styles.color}
          style={{ width: '120px' }}
          label="Valor do BTC"
          variant="filled"
          type='number'
          onChange={(e) => setBtcCustom(handleUnDot(e.target.value))}
          InputLabelProps={{ shrink: true }}
          title='Cotação do BTC'
          />
        &nbsp;
        <TextField
          className={styles.color}
          style={{ width: '120px' }}
          label="Valor em BRL"
          variant="filled"
          type='number'
          onChange={(e) => setBrlCustom(handleUnDot(e.target.value))}
          InputLabelProps={{ shrink: true }}
          title='Quantidade em BRL'
        />
        &nbsp;
        <TextField
          className={styles.color}
          style={{ width: '120px' }}
          label="Qtd em Sats"
          variant="filled"
          type='text'
          value={qtdCustom}
          InputLabelProps={{ shrink: true }}
          title='Quantidade de Sats'
        />
      </div>
      <div className={styles.section}>
        <TextField
          className={styles.color}
          autoFocus
          label="Valor"
          variant="filled"
          type='number'
          onChange={(e) => setValorBrlSats(handleUnDot(e.target.value))}
          InputLabelProps={{ shrink: true }}
          title='Valor em BRL ou Sats'
        />
        &nbsp;

        <Tooltip title="Atualizar Cotação" placement="left">
          <Button variant="contained" onClick={() => window.location.reload()}/*  style={{ height: '40px' }} */>
            <LoopIcon />
          </Button>
        </Tooltip>
        &nbsp;
      </div>
      <div className={styles.section}>
        <TextField
          className={styles.color}
          label="Valor em Sats"
          variant="filled"
          type='text'
          value={sats}
          InputLabelProps={{ shrink: true }}
          title='Conversão de Reais para Satoshis'
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="Valor em BRL"
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
          label="Sats em BTC"
          variant="filled"
          type='text'
          value={btc}
          InputLabelProps={{ shrink: true }}
          title='Conversão de Satoshis para Bitcoin'
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="BRL em BTC"
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
