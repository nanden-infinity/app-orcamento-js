

export default class Despesas {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.id = Date.now().toString().substring(9);
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = +valor;
  }
  
}
