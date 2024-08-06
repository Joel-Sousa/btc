import React, { useEffect, useState } from 'react';
import styles from './App.module.css'
import { Button, TextField, Tooltip } from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';
import { currencyBrlMask } from 'util-mask';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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

  const [btcNew, setBtcNew] = useState('' as any);
  const [brlNew, setBrlNew] = useState('' as any);

  useEffect(() => {

    if (!valorBrlSats) setValorBrlSats(0);
    if (!brl1) setBrl1(0);


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
    const newBtc = btcCustom < 999 ? btcCustom + '000' : btcCustom
    const vlrBtc = (newBtc / Math.pow(10, 0)).toFixed(3);
    const vlrSats = ((brlCustom / parseFloat(vlrBtc)) * Math.pow(10, 5)).toFixed(3)

    if (parseFloat(vlrBtc) < 999 || parseFloat(vlrBtc) > 100000)
      setQtdCustom(maskNumber(handleUnDot(vlrSats)));

  }, [
    btcCustom, brlCustom, qtdCustom
  ]);

  useEffect(() => {
    const vlr = (((btcNew * cotacaoFormatado) * Math.pow(10, 5)).toFixed(0))
    setBrlNew(vlr.slice(0, -2) + ',' + vlr.slice(-2));

    if (btcNew === '0.' || btcNew === '')
      setBrlNew(0)
  },
    [btcNew, brlNew, cotacaoFormatado]);

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
    <div>
      <div className={styles.header}>
        <h3>
          Calculadora de Bitcoin e BRL
        &nbsp;
          <Tooltip title="Todos os campos de verde são para inserção de valores" placement="right">
            <HelpOutlineIcon />
          </Tooltip>
        </h3>
      </div>
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
        <TextField
          className={styles.color}
          style={{ width: '145px', background: '#00ff9d' }}
          label="Valor do BTC"
          variant="filled"
          type='number'
          onChange={(e) => setBtcCustom(handleUnDot(e.target.value))}
          InputLabelProps={{ shrink: true }}
          title='Insira uma Cotação do BTC qualquer'
        />
        &nbsp;
        <TextField
          className={styles.color}
          style={{ width: '145px', background: '#00ff9d' }}
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
          style={{ width: '170px' }}
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
          style={{ width: '130px', background: '#00ff9d' }}
          autoFocus
          label="Valor BTC | Sats"
          variant="filled"
          type='number'
          onChange={(e) => setValorBrlSats(handleUnDot(e.target.value))}
          InputLabelProps={{ shrink: true }}
          title='Valor em BRL ou Sats'
        />
        &nbsp;
        <TextField
          className={styles.color}
          style={{ width: '130px', background: '#00ff9d' }}
          autoFocus
          label="Valor em BTC"
          variant="filled"
          type='number'
          onChange={(e) => setBtcNew(0 + '.' + e.target.value)}
          InputLabelProps={{ shrink: true }}
          title='Valor em BTC sem a casa decimal ex: 0025'
        />
        &nbsp;
        <TextField
          className={styles.color}
          style={{ width: '130px' }}
          autoFocus
          label="Valor em BRL"
          variant="filled"
          type='text'
          value={brlNew}
          // onChange={(e) => setValorBrlSats(handleUnDot(e.target.value))}
          InputLabelProps={{ shrink: true }}
          title='Valor em BRL'
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
          title='Conversão de BRL para Sats'
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="Valor em BRL"
          variant="filled"
          type='text'
          InputLabelProps={{ shrink: true }}
          value={brl1}
          title='Conversão de Satoshis para BRL'
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
          title='Conversão de Sats para BTC'
        />
        &nbsp;
        <TextField
          className={styles.color}
          label="BRL em BTC"
          variant="filled"
          type='text'
          value={btc1}
          InputLabelProps={{ shrink: true }}
          title='Conversão de BRL para BTC'
        />
      </div>
    </div>
  );
}

export default App;
