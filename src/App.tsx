import React, { useEffect, useState } from 'react';
import styles from './App.module.css'
import { Button, Card, TextField, Tooltip, Typography } from '@mui/material';
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

  const [valorBrl, setValorBrl] = useState('' as any);
  const [valorSats, setValorSats] = useState('' as any);

  const [btcPercentage, setBtcPercentage] = useState('' as any);
  const [percentage, setPercentage] = useState('' as any);

  const [btcCustom, setBtcCustom] = useState('' as any);
  const [brlCustom, setBrlCustom] = useState('' as any);
  const [qtdCustom, setQtdCustom] = useState('' as any);

  const [btcNew, setBtcNew] = useState('' as any);
  const [brlNew, setBrlNew] = useState('' as any);

  const [dataPrice, setDataPrice] = useState('' as any);

  //  useEffect(() => {

  //   },[]);

  useEffect(() => {
    setInterval(() => {
      updateTime();
    }, 60000);

    function updateTime() {

      fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCBRL')
        // fetch('')
        .then((response) => response.json())
        .then((data) => {

          setDataPrice(data.price)

          const price = data.price / Math.pow(10, 3);

          setCotacaoFormatado(price.toFixed(3));
          setCotacao(price.toFixed(8));

        });

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Os meses começam em 0
      const day = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      const timer = day + '/' + month + '/' + year + ' | ' + hours + ':' + minutes;
      setTime(timer)
    }

    updateTime();
  }, []);

  useEffect(() => {

    const satsConvert = (valorBrl / parseFloat(dataPrice)) * Math.pow(10, 8);
    const btcConvert = parseInt(valorBrl) / parseFloat(dataPrice);

    setSats(maskNumber(satsConvert.toFixed(0)));
    setBtc(btcConvert.toFixed(8));

    if (valorBrl === '' || valorBrl === undefined) {
      setSats('')
      setBtc('')
    }

  }, [cotacaoFormatado, cotacao, valorBrl, dataPrice]);

  useEffect(() => {
    const valorEmBTC = parseInt(valorSats) / 100000000;
    const valorEmBRL = valorEmBTC * cotacaoFormatado;

    setBrl1(currencyBrlMask((valorEmBRL * 1000)));

    const btcConvert1 = parseInt((valorEmBRL * 1000).toFixed(2)) / parseFloat(dataPrice)
    setBtc1(btcConvert1.toFixed(8));

    if (valorSats === '') {
      setBrl1('');
      setBtc1('');
    }
  }, [cotacaoFormatado, cotacao, valorSats, dataPrice]);

  useEffect(() => {
    let newBtc = 0.0;

    if (btcCustom < 999)
      newBtc = parseFloat(btcCustom + '000');
    else
      newBtc = btcCustom;

    const vlrSats = (brlCustom / newBtc)

    let newVlrSats = (vlrSats * 100000000).toFixed(0)

    const btcLenght = btcCustom === undefined ? 0 : btcCustom.toString().length;

    if (btcLenght === 2 || btcLenght === 3 || btcLenght === 6)
      setQtdCustom(maskNumber(handleUnDot(newVlrSats)));

  }, [btcCustom, brlCustom, qtdCustom]);

  useEffect(() => {
    const vlr = (((btcNew * cotacaoFormatado) * Math.pow(10, 5)).toFixed(0))
    setBrlNew(vlr.slice(0, -2) + ',' + vlr.slice(-2));

    if (btcNew === '0.' || btcNew === '')
      setBrlNew(0)
  }, [btcNew, cotacaoFormatado]);

  useEffect(() => {
    const toFixedBtc = parseInt(cotacaoFormatado)
    const percent = ((toFixedBtc - btcPercentage) / toFixedBtc) * 100;

    if (btcPercentage === '' || btcPercentage === 0)
      setPercentage('');
    else
      setPercentage(percent.toFixed(2) + '%');

  }, [cotacaoFormatado, btcPercentage]);


  // useEffect(() => {

  // },[]);

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

  const text = `Todos os campos de verde são <br> para inserção de valores`;

  return (
    <div>
      <div className={styles.header}>
        <Card variant="outlined">
          &nbsp;
          <b>
            Calculadora de Bitcoin e BRL
          </b>
          &nbsp;
          <Tooltip title={<> <span dangerouslySetInnerHTML={{ __html: text }}></span> </>} placement="left">
            <HelpOutlineIcon />
          </Tooltip>
          &nbsp;
          <Tooltip title="Atualizar Cotação" placement="left">
            <Button variant="contained" onClick={() => window.location.reload()}/*  style={{ height: '40px' }} */>
              <LoopIcon />
            </Button>
          </Tooltip>

        </Card>
      </div>
      <div className={styles.section}>
        <Card variant="outlined">
          <Typography><b>&nbsp;Cotação e data e hora</b></Typography>
          <TextField
            className={styles.color}
            style={{ width: '180px' }}
            size="small"
            label="Cotação Atual do BTC"
            variant="filled"
            type='text'
            value={cotacaoFormatado}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true, }}
          />
          &nbsp;
          <TextField
            className={styles.color}
            style={{ width: '180px' }}
            size="small"
            label="Data/Hora"
            variant="filled"
            type='text'
            value={time}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true, }}
          />
        </Card>
      </div>
      <div className={styles.section}>
        <Card variant="outlined">
          <Typography><b>&nbsp;Diferença em porcentagem %</b></Typography>
          <TextField
            className={styles.color}
            size="small"
            style={{ width: '180px', background: '#00ff9d' }}
            label="Valor em BTC"
            variant="filled"
            type='number'
            onChange={(e) => setBtcPercentage(e.target.value)}
            InputLabelProps={{ shrink: true }}
            title='Inserir o valor do BTC Ex: 330'
          />
          &nbsp;
          <TextField
            className={styles.color}
            size="small"
            style={{ width: '180px' }}
            label="Valor em Porcentagem %"
            variant="filled"
            type='text'
            value={percentage}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true, }}
            title='Diferença em porcentagen entre o valor da contação atual e o Inseridos'
          />
        </Card>
      </div>
      <div className={styles.section}>
        <Card variant="outlined">
          <Typography><b>&nbsp;Conversão de BTC para BRL</b></Typography>
          <TextField
            className={styles.color}
            size="small"
            style={{ width: '180px', background: '#00ff9d' }}
            label="Valor em BTC"
            variant="filled"
            type='number'
            onChange={(e) => setBtcNew(0 + '.' + e.target.value)}
            InputLabelProps={{ shrink: true }}
            title='Inserir o valor do BTC somente com as casas fracionarias Ex: 0025'
          />
          &nbsp;
          <TextField
            className={styles.color}
            size="small"
            style={{ width: '180px' }}
            label="Valor em BRL"
            variant="filled"
            type='text'
            value={brlNew}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true, }}
          />
        </Card>
      </div>
      <div className={styles.section}>
        <Card variant="outlined">
          <Typography><b>&nbsp;Simulação de compra de BTC</b></Typography>
          <TextField
            className={styles.color}
            size="small"
            style={{ width: '110px', background: '#00ff9d' }}
            label="Valor do BTC"
            variant="filled"
            type='number'
            onChange={(e) => setBtcCustom(handleUnDot(e.target.value))}
            InputLabelProps={{ shrink: true }}
            title='Insira uma Cotação do BTC qualquer Ex: 300'
          />
          &nbsp;
          <TextField
            className={styles.color}
            size="small"
            style={{ width: '115px', background: '#00ff9d' }}
            label="Valor em BRL"
            variant="filled"
            type='number'
            onChange={(e) => setBrlCustom(handleUnDot(e.target.value))}
            InputLabelProps={{ shrink: true }}
            title='Insira a Quantidade em BRL Ex: 1000'
          />
          &nbsp;
          <TextField
            className={styles.color}
            size="small"
            style={{ width: '130px' }}
            label="Quantidade de Sats"
            variant="filled"
            type='text'
            value={qtdCustom}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true, }}
          />
        </Card>

      </div>
      <div className={styles.section}>
        <Card variant="outlined">
          <Typography><b>&nbsp;Conversão de BRL ou Sats </b></Typography>

          <TextField
            className={styles.color}
            size="small"
            style={{ width: '180px', background: '#00ff9d' }}
            fullWidth
            label="Valor em BRL"
            variant="filled"
            type='number'
            // onChange={(e) => setValorBrl(handleUnDot(e.target.value))}
            onChange={(e) => setValorBrl(handleUnDot(e.target.value))}
            InputLabelProps={{ shrink: true }}
            title='Insira o valor em BRL Ex: 1000'
          />
          &nbsp;
          <TextField
            className={styles.color}
            size="small"
            style={{ width: '180px', background: '#00ff9d' }}
            fullWidth
            label="Valor em Sats"
            variant="filled"
            type='number'
            // onChange={(e) => setValorSats(handleUnDot(e.target.value))}
            onChange={(e) => setValorSats(e.target.value)}
            InputLabelProps={{ shrink: true }}
            title='Insira o valor em Sats para converter Ex:?1000'
          />

          <div className={styles.section}>
            <TextField
              className={styles.color}
              style={{ width: '180px' }}
              size="small"
              label="Valor de BRL para Sats"
              variant="filled"
              type='text'
              value={sats}
              InputLabelProps={{ shrink: true }}

            />
            &nbsp;
            <TextField
              className={styles.color}
              style={{ width: '180px' }}
              size="small"
              label="Valor de Sats para BRL"
              variant="filled"
              type='text'
              InputLabelProps={{ shrink: true }}
              value={brl1}
              InputProps={{ readOnly: true, }}

            />
          </div>
          <div className={styles.section}>
            <TextField
              className={styles.color}
              style={{ width: '180px' }}
              size="small"
              label="Valor de Sats para BTC"
              variant="filled"
              type='text'
              value={btc}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true, }}

            />
            &nbsp;
            <TextField
              className={styles.color}
              style={{ width: '180px' }}
              size="small"
              label="Valor de BRL para BTC"
              variant="filled"
              type='text'
              value={btc1}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true, }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
