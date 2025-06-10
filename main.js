class Route {
    constructor(id, from, to, distance, duration) {
      this.id = id;
      this.from = from;
      this.to = to;
      this.distance = distance;
      this.duration = duration;
    }
  
    edit(data) {
      this.from = data.from;
      this.to = data.to;
      this.distance = data.distance;
      this.duration = data.duration;
    }
  
    toTableRow() {
      return `
              <tr>
                  <td>${this.id}</td>
                  <td>${this.from}</td>
                  <td>${this.to}</td>
                  <td>${this.distance}</td>
                  <td>${this.duration}</td>
                  <td>
                      <button class="btn btn-warning btn-sm" data-id="${this.id}" onclick="editEntity('route', ${this.id})">Редагувати</button>
                      <button class="btn btn-danger btn-sm" data-id="${this.id}" onclick="deleteEntity('route', ${this.id})">Видалити</button>
                  </td>
              </tr>
          `;
    }
  }
  
  class Plane {
    constructor(id, number, brand, seats, speed, range) {
      this.id = id;
      this.number = number;
      this.brand = brand;
      this.seats = seats;
      this.speed = speed;
      this.range = range;
    }
  
    edit(data) {
      this.number = data.number;
      this.brand = data.brand;
      this.seats = data.seats;
      this.speed = data.speed;
      this.range = data.range;
    }
  
    toTableRow() {
      return `
              <tr>
                  <td>${this.id}</td>
                  <td>${this.number}</td>
                  <td>${this.brand}</td>
                  <td>${this.seats}</td>
                  <td>${this.speed}</td>
                  <td>${this.range}</td>
                  <td>
                      <button class="btn btn-warning btn-sm" data-id="${this.id}" onclick="editEntity('plane', ${this.id})">Редагувати</button>
                      <button class="btn btn-danger btn-sm" data-id="${this.id}" onclick="deleteEntity('plane', ${this.id})">Видалити</button>
                  </td>
              </tr>
          `;
    }
  }
  
  class Flight {
    constructor(id, plane, departure, arrival, tickets) {
      this.id = id;
      this.plane = plane;
      this.departure = departure;
      this.arrival = arrival;
      this.tickets = tickets;
    }
  
    edit(data) {
      this.plane = data.plane;
      this.departure = data.departure;
      this.arrival = data.arrival;
      this.tickets = data.tickets;
    }
  
    toTableRow() {
      return `
              <tr>
                  <td>${this.id}</td>
                  <td>${this.plane}</td>
                  <td>${this.departure}</td>
                  <td>${this.arrival}</td>
                  <td>${this.tickets}</td>
                  <td>
                      <button class="btn btn-warning btn-sm" data-id="${this.id}" onclick="editEntity('flight', ${this.id})">Редагувати</button>
                      <button class="btn btn-danger btn-sm" data-id="${this.id}" onclick="deleteEntity('flight', ${this.id})">Видалити</button>
                  </td>
              </tr>
          `;
    }
  }
  
  class BaseList {
    constructor(endpoint) {
      this.items = [];
      this.endpoint = endpoint;
    }
  
    async fetchItems() {
      try {
        const apiUrl =
          this.endpoint === "routes"
            ? "https://681899705a4b07b9d1cfeab2.mockapi.io/routes"
            : this.endpoint === "planes"
            ? "https://681899705a4b07b9d1cfeab2.mockapi.io/planes"
            : "https://681899705a4b07b9d1cfeab2.mockapi.io/flights";
        const response = await fetch(apiUrl);
        this.items = await response.json();
        this.items = this.items.map((item) => {
          if (this.endpoint === "routes") {
            return new Route(
              item.id,
              item.from,
              item.to,
              item.distance,
              item.duration
            );
          } else if (this.endpoint === "planes") {
            return new Plane(
              item.id,
              item.number,
              item.brand,
              item.seats,
              item.speed,
              item.range
            );
          } else if (this.endpoint === "flights") {
            return new Flight(
              item.id,
              item.plane,
              item.departure,
              item.arrival,
              item.tickets
            );
          }
        });
      } catch (error) {
        console.error(`Error fetching ${this.endpoint}:`, error);
      }
    }
  
    async add(data) {
      try {
        const apiUrl =
          this.endpoint === "routes"
            ? "https://681899705a4b07b9d1cfeab2.mockapi.io/routes"
            : this.endpoint === "planes"
            ? "https://681899705a4b07b9d1cfeab2.mockapi.io/planes"
            : "https://681899705a4b07b9d1cfeab2.mockapi.io/flights";
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const newItem = await response.json();
        if (this.endpoint === "routes") {
          this.items.push(
            new Route(
              newItem.id,
              newItem.from,
              newItem.to,
              newItem.distance,
              newItem.duration
            )
          );
        } else if (this.endpoint === "planes") {
          this.items.push(
            new Plane(
              newItem.id,
              newItem.number,
              newItem.brand,
              newItem.seats,
              newItem.speed,
              newItem.range
            )
          );
        } else if (this.endpoint === "flights") {
          this.items.push(
            new Flight(
              newItem.id,
              newItem.plane,
              newItem.departure,
              newItem.arrival,
              newItem.tickets
            )
          );
        }
      } catch (error) {
        console.error(`Error adding to ${this.endpoint}:`, error);
      }
    }
  
    async delete(id) {
      try {
        const apiUrl =
          this.endpoint === "routes"
            ? "https://681899705a4b07b9d1cfeab2.mockapi.io/routes"
            : this.endpoint === "planes"
            ? "https://681899705a4b07b9d1cfeab2.mockapi.io/planes"
            : "https://681899705a4b07b9d1cfeab2.mockapi.io/flights";
        await fetch(`${apiUrl}/${id}`, {
          method: "DELETE",
        });
        this.items = this.items.filter((item) => item.id != id);
      } catch (error) {
        console.error(`Error deleting from ${this.endpoint}:`, error);
      }
    }
  
    async edit(id, data) {
      try {
        const apiUrl =
          this.endpoint === "routes"
            ? "https://681899705a4b07b9d1cfeab2.mockapi.io/routes"
            : this.endpoint === "planes"
            ? "https://681899705a4b07b9d1cfeab2.mockapi.io/planes"
            : "https://681899705a4b07b9d1cfeab2.mockapi.io/flights";
        const response = await fetch(`${apiUrl}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const updatedItem = await response.json();
        const item = this.items.find((item) => item.id == id);
        if (item) {
          item.edit(updatedItem);
        }
      } catch (error) {
        console.error(`Error editing ${this.endpoint}:`, error);
      }
    }
  
    getItem(id) {
      return this.items.find((item) => item.id == id);
    }
  }
  
  const routeList = new BaseList("routes");
  const planeList = new BaseList("planes");
  const flightList = new BaseList("flights");
  
  function generateTable(list, tableId, entityType) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = "";
    list.items.forEach((item) => {
      tableBody.innerHTML += item.toTableRow();
    });
  }
  
  function populatePlaneSelect() {
    const select = document.querySelector('#flightForm select[name="plane"]');
    select.innerHTML = '<option value="">Виберіть літак</option>';
    planeList.items.forEach((plane) => {
      select.innerHTML += `<option value="${plane.number}">${plane.number}</option>`;
    });
  }
  
  function showAddModal(entityType) {
    const form = document.getElementById(`${entityType}Form`);
    form.reset();
    form.querySelector('input[name="id"]').value = "";
    if (entityType === "flight") {
      populatePlaneSelect();
    }
    $(`#${entityType}Modal`).modal("show");
  }
  
  async function deleteEntity(entityType, id) {
    if (confirm(`Ви впевнені, що хочете видалити цей ${entityType}?`)) {
      let list;
      switch (entityType) {
        case "route":
          list = routeList;
          break;
        case "plane":
          list = planeList;
          break;
        case "flight":
          list = flightList;
          break;
      }
      await list.delete(id);
      generateTable(list, `${entityType}sTable`, entityType);
      if (entityType === "plane") {
        populatePlaneSelect();
      }
    }
  }
  
  function editEntity(entityType, id) {
    let list;
    switch (entityType) {
      case "route":
        list = routeList;
        break;
      case "plane":
        list = planeList;
        break;
      case "flight":
        list = flightList;
        break;
    }
    const item = list.getItem(id);
    const form = document.getElementById(`${entityType}Form`);
    form.querySelector('input[name="id"]').value = item.id;
    for (let key in item) {
      if (key !== "id") {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) input.value = item[key];
      }
    }
    if (entityType === "flight") {
      populatePlaneSelect();
    }
    $(`#${entityType}Modal`).modal("show");
  }
  
  async function saveEntity(entityType) {
    const form = document.getElementById(`${entityType}Form`);
    const id = form.querySelector('input[name="id"]').value;
    const newItem = {};
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach((input) => {
      if (input.name !== "id") {
        newItem[input.name] = input.value;
      }
    });
  
    let list;
    switch (entityType) {
      case "route":
        list = routeList;
        break;
      case "plane":
        list = planeList;
        break;
      case "flight":
        list = flightList;
        break;
    }
  
    if (id) {
      await list.edit(id, newItem);
    } else {
      await list.add(newItem);
    }
  
    generateTable(list, `${entityType}sTable`, entityType);
    if (entityType === "plane") {
      populatePlaneSelect();
    }
  
    $(`#${entityType}Modal`).modal("hide");
    form.reset();
  }
  
  document.addEventListener("DOMContentLoaded", async function () {
    await routeList.fetchItems();
    await planeList.fetchItems();
    await flightList.fetchItems();
    generateTable(routeList, "routesTable", "route");
    generateTable(planeList, "planesTable", "plane");
    generateTable(flightList, "flightsTable", "flight");
    populatePlaneSelect();
  });