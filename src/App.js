import React, { Component } from 'react';
import './App.css';
import { interval } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';

import { Header } from './components/header/Header';
import { LabeledInput } from './components/labeledInput/LabeledInput';
import { Salario } from './Salario';

export default class App extends Component {

  constructor() {
    super();

    this.state = {
      salario: new Salario(0),
      salarioLiquidoDesejado: '5000'
    }
  }

  updateSalario (event) {
    const value = +event.target.value;
    this.setState({ salario: new Salario(value) });
  };

  formatSalarioBruto (value) {
    return Math.floor(value) !== +value ? +value.toFixed(2) : +value;
  }

  formatValue (value) {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  updateSalarioLiquidoDesejado (event) {
    this.setState({ salarioLiquidoDesejado: event.target.value });
  };

  findSalarioBrutoFromLiquido () {
    const value = +this.state.salarioLiquidoDesejado;
    this.setState({ salario: new Salario(value) });

    const obs$ = interval(1).pipe(
      map(() => {
        const currentValue = +this.state.salario.salarioLiquido;
        const difference = Math.abs(currentValue - +this.state.salarioLiquidoDesejado);
        const increment = difference >= 5 ? 1 : 0.01;
        const valueIncremented = +this.state.salario.salarioBruto + increment
        this.setState({ salario: new Salario(valueIncremented) })
        return this.state.salario.salarioLiquido;
      })
    );

    const match$ = obs$.pipe(
      filter(currentValue => +currentValue >= +this.state.salarioLiquidoDesejado)
    );

    obs$.pipe(takeUntil(match$)).subscribe();
  };

  render() {
    return (
      <div className="App">
        <Header />
        <div className="content">
          <div className="main-content">
            <LabeledInput
              label="Salário bruto"
              customId="salario-bruto"
              currency={ false }
              disabled={ false }
              inputValue= { this.formatSalarioBruto(this.state.salario.salarioBruto) }
              onInputChange={ event => this.updateSalario(event) }
            />
            <LabeledInput
              label="Base INSS"
              currency={ true }
              disabled={ true }
              inputValue={ this.formatValue(this.state.salario.baseINSS) }
            />
            <LabeledInput
              label="Desconto INSS"
              currency={ true }
              disabled={ true }
              inputValue={ this.formatValue(this.state.salario.descontoINSS) }
            />
            <LabeledInput
              label="Base IRPF"
              currency={ true }
              disabled={ true }
              inputValue={ this.formatValue(this.state.salario.baseIRPF) }
            />
            <LabeledInput
              label="Desconto IRPF"
              currency={ true }
              disabled={ true }
              inputValue={ this.formatValue(this.state.salario.descontoIRPF) }
            />
            <LabeledInput
              label="Salário líquido"
              customId="salario-liquido"
              currency={ true }
              disabled={ true }
              inputValue={ this.formatValue(this.state.salario.salarioLiquido) }
            />
          </div>
          <div className="main-content">
            <LabeledInput
              label="Salário líquido desejado"
              customId="inputSalarioLiquidoDesejado"
              currency={ false }
              disabled={ false }
              inputValue={ this.state.salarioLiquidoDesejado }
              onInputChange={ event => this.updateSalarioLiquidoDesejado(event) }
            />
            <div className="content-calculator">
              <button className="calculator" onClick={ () => this.findSalarioBrutoFromLiquido() }>
                Calcular salário bruto
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};


