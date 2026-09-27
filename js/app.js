import DataBase from "./dataBase.js";
import view from "./views.js";
// view.init()
import Despesas from "./despesas.js";

let href = window.location.pathname;

view.handleEvent(href, cadastrarDespesa);

// Gravando dados no localStorage
function cadastrarDespesa(despesa) {
  DataBase.saveDate(despesa);
}

window.addEventListener("DOMContentLoaded", () => {
  const d = new Despesas();
  DataBase.recuperarRegistros(view.renderDespesa);
});
