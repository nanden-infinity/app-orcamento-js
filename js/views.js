import { state } from "./modal.js";
import Despesas from "./despesas.js";
import dataBase from "./dataBase.js";
class View {
  #parentElementTBody;
  constructor() {
    this.#parentElementTBody = document.querySelector("tbody");
    this.init();
  }
  errorMessage = " Alguns campos não foram preenchidos...";
  sucessMessage = " Despesa  guardada com sucesso...";
  modalContainer = document.querySelector(".modal--container");
  #form = document.getElementById("form-despesa");
  #ano = document.getElementById("ano");
  #mes = document.getElementById("mes");
  #dia = document.getElementById("dia");
  #tipo = document.getElementById("tipo");
  #descricao = document.getElementById("descricao");
  #valor = document.getElementById("valor");
  handleEvent(type, handle) {
    if (type === "/index.html") {
      this.#form.addEventListener("submit", (e) => {
        // preventEventDefault
        e.preventDefault();

        if (this.#isEmpty()) {
          this.modalContainer.innerHTML = "";
          this.renderModal();
          this.#hideModal();
          return;
        }
        const despesas = new Despesas(
          this.#ano.value,
          this.#mes.value,
          this.#dia.value,
          this.#tipo.value,
          this.#descricao.value,
          this.#valor.value,
        );

        handle(despesas);
        this.modalContainer.innerHTML = "";
        this.renderModal("success", "Concluir");
        this.#showModal();
        // this.#clearForm();
      });
    }
  }
  #isEmpty() {
    const isValid = (input) =>
      input === "" || input === undefined || input === null;
    const isEmpty = [
      this.#ano.value,
      this.#mes.value,
      this.#dia.value,
      this.#tipo.value,
      this.#descricao.value,
      this.#valor.value,
    ].some(isValid);

    return isEmpty;
  }
  renderModal(elementId = "error", btnText = "corriguir") {
    const type = elementId === "error" ? "danger" : "success";
    const textHeading =
      elementId === "error"
        ? "Erro na gravação"
        : "Despesa gravada com sucesso!";
    const textBtn = btnText === "corriguir" ? "Corriguir" : "Concluir";

    const html = `
  <div class="modal fade" id="${elementId}" data-bs-backdrop="static" data-bs-keyboard="true" tabindex="-1" aria-labelledby="${elementId}" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-${type}" id="${elementId}">${textHeading}</h1>
          ${type === "danger" ? `<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>` : ""}
        </div>
        <div class="modal-body">
          ${type === "danger" ? this.errorMessage : this.sucessMessage}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-${type}" data-bs-dismiss="modal">${textBtn}</button>

        </div>
      </div>
    </div>
  </div>`;
    this.modalContainer.innerHTML = "";
    this.modalContainer.insertAdjacentHTML("afterend", html);

    return;
  }
  #hideModal() {
    const modalEl = document.getElementById("error");
    if (!modalEl) return;

    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) modal = new bootstrap.Modal(modalEl);

    modal.show();
    this.#clearForm();
    return;
  }
  #showModal() {
    const modalEl = document.getElementById("success");
    if (!modalEl) return this;

    let modal = bootstrap.Modal.getInstance(modalEl);

    if (!modal) {
      modal = new bootstrap.Modal(modalEl);
    }

    modal.show();
    this.#clearForm();
    return this;
  }
  #clearForm() {
    let empty = "";
    this.#ano.value = empty;
    this.#mes.value = empty;
    this.#dia.value = empty;
    this.#tipo.value = empty;
    this.#descricao.value = empty;
    this.#valor.value = empty;
  }
  renderDespesa() {
    const tbody = this.#parentElementTBody;
    if (!tbody) return;

    tbody.replaceChildren();

    const lastId = Number(localStorage.getItem("id")) || 0;
    const tipoOptions = Array.from(
      document.querySelectorAll("#tipo option[value]"),
    );
    const tipos = new Map(
      tipoOptions.map((option) => [option.value, option.textContent.trim()]),
    );
    const despesas = [];

    for (let id = 1; id <= lastId; id += 1) {
      const storedDespesa = localStorage.getItem(String(id));
      if (!storedDespesa) continue;

      try {
        const despesa = JSON.parse(storedDespesa);
        if (despesa && typeof despesa === "object") despesas.push(despesa);
      } catch {
        console.log(
          "Ignora registros inválidos para que os demais continuem sendo exibidos.",
        );
      }
    }

    despesas.forEach((despesa) => {
      const tr = document.createElement("tr");
      const data = new Date(
        Number(despesa.ano),
        Number(despesa.mes) - 1,
        Number(despesa.dia),
      );
      const dataFormatada = Number.isNaN(data.getTime())
        ? ""
        : data.toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
      const valores = [
        despesa.id,
        dataFormatada,
        tipos.get(String(despesa.tipo)) ?? "",
        despesa.descricao,
        despesa.valor,
      ];

      valores.forEach((valor) => {
        const td = document.createElement("td");
        td.textContent = valor == null ? "" : String(valor);
        tr.append(td);
      });

      const actions = document.createElement("td");
      const editar = document.createElement("button");
      editar.className = "btn btn-sm btn-primary me-1";
      editar.dataset.btn = "editar";
      editar.dataset.id = String(despesa.id);
      editar.textContent = "Editar";

      const excluir = document.createElement("button");
      excluir.className = "btn btn-sm btn-danger";
      excluir.dataset.btn = "excluir";
      excluir.dataset.id = String(despesa.id);
      excluir.textContent = "Excluir";

      actions.append(editar, excluir);
      tr.append(actions);
      tbody.append(tr);
    });
  }
  editarDespesa() {
    console.log("editando despesas");
  }
  excluirDespesa() {
    this.#parentElementTBody?.addEventListener("click", (e) => {
      const button = e.target.closest?.("button[data-btn]");
      if (!button) return;

      if (button.dataset.btn === "excluir") {
        const confirmed = confirm("Deseja Excluir esta despesa?");
        if (!confirmed) return;

        const id = button.dataset.id;
        const lastId = Number(localStorage.getItem("id")) || 0;

        for (let storageId = 1; storageId <= lastId; storageId += 1) {
          const data = localStorage.getItem(String(storageId));
          if (!data) continue;

          try {
            const despesa = JSON.parse(data);
            if (String(despesa?.id) !== id) continue;

            this.removerList(storageId);
            state.idSearch = id;
            state.despesas.push(despesa);
            button.closest("tr")?.remove();
            this.updateState();
            return;
          } catch {
            continue;
          }
        }
        return;
      }

      if (button.dataset.btn === "editar") {
        console.log("Editando");
        this.editarDespesa();
      }
    });
  }
  updateState() {
    console.log("Your State is Updated :", state);
  }
  removerList(storageId) {
    localStorage.removeItem(String(storageId));
  }
  init() {
    this.renderDespesa = this.renderDespesa.bind(this);
    this.excluirDespesa();
  }
}

export default new View();

const lista = ["Ana", undefined, null, "marcos", "Fidel"];

for (let i = 0; i < lista.length; i++) {
  if (lista[i] === null || lista[i] === undefined) {
    continue;
  }
}

console.log(state);
