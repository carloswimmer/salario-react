const TETO_INSS_2018 = 621.04;

const tabelaINSS_2018 = [
  {
    ate: 1693.72,
    aliquota: 8,
  },
  {
    ate: 2822.9,
    aliquota: 9,
  },
  {
    ate: 5645.8,
    aliquota: 11,
  },
  {
    ate: Number.MAX_SAFE_INTEGER,
    aliquota: 11,
  },
];

const tabelaIRPF_2018 = [
  {
    ate: 1903.98,
    aliquota: 0,
    deducao: 0,
  },
  {
    ate: 2826.65,
    aliquota: 7.5,
    deducao: 142.8,
  },
  {
    ate: 3751.05,
    aliquota: 15.0,
    deducao: 354.8,
  },
  {
    ate: 4664.68,
    aliquota: 22.5,
    deducao: 636.13,
  },
  {
    ate: Number.MAX_SAFE_INTEGER,
    aliquota: 27.5,
    deducao: 869.36,
  },
];

export class Salario {
  /**
   *
   * @param {number} O salário bruto, que deve ser um
   * número maior ou igual a 0
   */
  constructor(pSalarioBruto) {
    this._salarioBruto = undefined;
    this._baseINSS = undefined;
    this._descontoINSS = undefined;
    this._baseIRPF = undefined;
    this._descontoIRPF = undefined;
    this._salarioLiquido = undefined;

    this._validarSalarioBruto(pSalarioBruto);
    this._realizarCalculos();

    //Congelando
    Object.freeze(this);
  }

  _validarSalarioBruto(pSalarioBruto) {
    /**
     * Regras de validação
     */
    if (pSalarioBruto === undefined || typeof pSalarioBruto !== 'number' || pSalarioBruto < 0) {
      throw new Error(
        'O parâmetro do salário bruto ' +
          'é obrigatório e deve ser um ' +
          'valor do tipo number maior ou igual a 0!',
      );
    }

    //Salário bruto validado!
    this._salarioBruto = pSalarioBruto;
  }

  _realizarCalculos() {
    this._baseINSS = this._salarioBruto;
    this._descontoINSS = this._calcularDescontoINSS();
    this._baseIRPF = this._salarioBruto - this._descontoINSS;
    this._descontoIRPF = this._calcularDescontoIRPF();
    this._salarioLiquido = this._salarioBruto - this._descontoINSS - this._descontoIRPF;
  }

  _calcularDescontoINSS() {
    let descontoINSS = 0;

    /**
     * Pra cada item da tabelaINSS, procuramos
     * onde a baseINSS "se encaixa". Assim que
     * acharmos, calculamos o desconto e
     * "quebramos" o loop para evitar cálculos
     * desnecessários
     */
    for (let item of tabelaINSS_2018) {
      if (this._baseINSS <= item.ate) {
        /**
         * Nesse momento, encontramos o item correto.
         * Precisamos calcular o desconto com base no teto do INSS.
         * Por isso, o Math.min auxilia garantindo o valor
         * mínimo com base em TETO_INSS_2018
         */
        descontoINSS = Math.min(this._baseINSS * (item.aliquota / 100), TETO_INSS_2018);

        /**
         * Uma vez que encontramos, forçamos o
         * encerramento do for para evitar
         * calculos desnecessários (performance)
         */
        break;
      }
    }

    return descontoINSS;
  }

  /**
   * O cálculo é bastante semelhante ao do INSS,
   * exceto pelo teto, que não existe e pela aplicação
   * da dedução
   */
  _calcularDescontoIRPF() {
    let descontoIRPF = 0;

    for (let item of tabelaIRPF_2018) {
      if (this._baseIRPF <= item.ate) {
        descontoIRPF = this._baseIRPF * (item.aliquota / 100);
        //Aplicando a dedução
        descontoIRPF -= item.deducao;
        break;
      }
    }

    return descontoIRPF;
  }

  /**
   * Getters com um mínimo de formatação
   */
  get salarioBruto() {
    return this._salarioBruto.toFixed(2);
  }

  get baseINSS() {
    return this._baseINSS.toFixed(2);
  }

  get descontoINSS() {
    return this._descontoINSS.toFixed(2);
  }

  get baseIRPF() {
    return this._baseIRPF.toFixed(2);
  }

  get descontoIRPF() {
    return this._descontoIRPF.toFixed(2);
  }

  get totalDescontos() {
    return (this._descontoINSS + this._descontoIRPF).toFixed(2);
  }

  get salarioLiquido() {
    return this._salarioLiquido.toFixed(2);
  }
}
