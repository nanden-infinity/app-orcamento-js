
class DataBase {
  constructor() {
    let id = localStorage.getItem("id");
    this._getDate = id || 0;
    if (id === null) {
      localStorage.setItem("id", 0);
      this._getDate = id;
    }
  }
  getNextId() {
    let nextId = Number(localStorage.getItem("id"));
    // nextId = +nextId++
    // console.log(id++, ": ", Number(nextId)++);
    // nextId = nextId = 0;
    return nextId + 1;
  }

  saveDate(items) {
    // const data = this.data.push(items);
    // if (!data)
    // const dd = this.data.some((d) => d === this.getDate);
    // console.log(this.data, this.getDate);
    // for (let i = 0; i < this.data.length; i++) {
    //   console.log(
    //     this.data[i] === JSON.parse(localStorage.getItem("despesas")),
    //   );
    // }
    // localStorage.setItem(this.getNextId(), JSON.stringify(this.data));
    // this.getNextId();
    let id = this.getNextId();
    localStorage.setItem("id", id);
    localStorage.setItem(id, JSON.stringify(items));
    this._getDate = id;
  }
  set _getDate(id) {
    this.data = JSON.parse(localStorage.getItem(id));
    // const items = [];
    // items.push(data);
    // // this.items.push({ id: data.id, item: [, ...data] });
    // this.#localItems = items;
    // this.data.push(items);
    // console.log(this.#localItems, this.data);
    // localStorage.setItem("items", JSON.stringify(this.data));
    // // console.log(...JSON.parse(localStorage.getItem("items")));
    return id;
  }
  get getDate() {
    return this._getDate;
  }
  recuperarRegistros(registro) {
    registro(this.getNextId());
  }
}

export default new DataBase();
