const API_URL = 'https://YOUR_TOKEN.mockapi.io';

class Plane 
{
    constructor(id, number, brand, seats, speed, range) 
    {
        this.id = id;
        this.number = number;
        this.brand = brand;
        this.seats = seats;
        this.speed = speed;
        this.range = range;
    }

    edit(number, brand, seats, speed, range) 
    {
        this.number = number;
        this.brand = brand;
        this.seats = parseInt(seats);
        this.speed = speed;
        this.range = range;
    }

    displayAsTableRow() 
    {
        return `
            <tr>
                <td>${this.number}</td>
                <td>${this.brand}</td>
                <td>${this.seats}</td>
                <td>${this.speed}</td>
                <td>${this.range}</td>
                <td>
                    <button data-id="${this.id}" class="edit-plane btn btn-warning">Редагувати</button>
                    <button data-id="${this.id}" class="delete-plane btn btn-danger">Видалити</button>
                </td>
            </tr>
        `;
    }

    displayAsOption() 
    {
        return `<option value="${this.number}">${this.number}</option>`;
    }
}

class Route 
{
    constructor(id, from, to, distance, duration) 
    {
        this.id = id;
        this.from = from;
        this.to = to;
        this.distance = distance;
        this.duration = duration;
    }

    edit(from, to, distance, duration) 
    {
        this.from = from;
        this.to = to;
        this.distance = distance;
        this.duration = duration;
    }

    displayAsTableRow() 
    {
        return `
            <tr>
                <td>${this.from}</td>
                <td>${this.to}</td>
                <td>${this.distance}</td>
                <td>${this.duration}</td>
                <td>
                    <button data-id="${this.id}" class="edit-route btn btn-warning">Редагувати</button>
                    <button data-id="${this.id}" class="delete-route btn btn-danger">Видалити</button>
                </td>
            </tr>
        `;
    }
}

class Flight 
{
    constructor(id, plane, departure, arrival, tickets) 
    {
        this.id = id;
        this.plane = plane;
        this.departure = departure;
        this.arrival = arrival;
        this.tickets = tickets;
    }

    edit(plane, departure, arrival, tickets) 
    {
        this.plane = plane;
        this.departure = departure;
        this.arrival = arrival;
        this.tickets = parseInt(tickets);
    }

    displayAsTableRow() 
    {
        return `
            <tr>
                <td>${this.plane}</td>
                <td>${this.departure}</td>
                <td>${this.arrival}</td>
                <td>${this.tickets}</td>
                <td>
                    <button data-id="${this.id}" class="edit-flight btn btn-warning">Редагувати</button>
                    <button data-id="${this.id}" class="delete-flight btn btn-danger">Видалити</button>
                </td>
            </tr>
        `;
    }
}

class BaseList 
{
    constructor() 
    {
        this.list = [];
    }

    edit(dataObj) 
    {
        for (let i = 0; i < this.list.length; i++) 
            {
            if (dataObj.id == this.list[i].id) 
            {
                this.list[i].edit(...Object.values(dataObj).slice(1));
                break;
            }
        }
    }

    delete(id) 
    {
        for (let i = 0; i < this.list.length; i++) 
        {
            if (id == this.list[i].id) 
            {
                this.list.splice(i, 1);
                break;
            }
        }
    }

    displayTableRows() 
    {
        let content = ``;
        for (let i = 0; i < this.list.length; i++) 
        {
            content += this.list[i].displayAsTableRow();
        }
        return content;
    }

    displaySelectOptions() 
    {
        let content = ``;
        for (let i = 0; i < this.list.length; i++) 
        {
            content += this.list[i].displayAsOption();
        }
        return content;
    }

    getById(id) 
    {
        for (let i = 0; i < this.list.length; i++) 
        {
            if (id == this.list[i].id) 
            {
                return this.list[i];
            }
        }
    }
}

class PlaneList extends BaseList 
{
    constructor() 
    {
        super();
    }

    async loadData() 
    {
        try 
        {
            const response = await fetch(`${API_URL}/planes`);
            if (!response.ok) throw new Error('Помилка завантаження літаків');
            const planes = await response.json();
            this.list = planes.map(plane => new Plane(plane.id, plane.number, plane.brand, plane.seats, plane.speed, plane.range));
            this.display();
        } catch (error) 
        {
            console.error('Помилка завантаження літаків:', error);
            alert('Не вдалося завантажити дані про літаки.');
        }
    }

    async add(dataObj) 
    {
        try 
        {
            const response = await fetch(`${API_URL}/planes`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                {
                    number: dataObj.number,
                    brand: dataObj.brand,
                    seats: parseInt(dataObj.seats),
                    speed: dataObj.speed,
                    range: dataObj.range
                })
            });
            if (!response.ok) throw new Error('Помилка додавання літака');
            await this.loadData();
        } catch (error) 
        {
            console.error('Помилка додавання літака:', error);
            alert('Не вдалося додати літак.');
        }
    }

    async edit(dataObj) 
    {
        try 
        {
            const response = await fetch(`${API_URL}/planes/${dataObj.id}`, 
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                {
                    number: dataObj.number,
                    brand: dataObj.brand,
                    seats: parseInt(dataObj.seats),
                    speed: dataObj.speed,
                    range: dataObj.range
                })
            });
            if (!response.ok) throw new Error('Помилка редагування літака');
            await this.loadData(); 
        } catch (error) 
        {
            console.error('Помилка редагування літака:', error);
            alert('Не вдалося відредагувати літак.');
        }
    }

    async delete(id) 
    {
        try 
        {
            const response = await fetch(`${API_URL}/planes/${id}`, 
            {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Помилка видалення літака');
            await this.loadData();
        } catch (error) 
        {
            console.error('Помилка видалення літака:', error);
            alert('Не вдалося видалити літак.');
        }
    }

    display() 
    {
        const planeTab = document.getElementById('planes');
        let planeTabContent = `
            <h3>Літаки</h3>
            <button id="addPlanes" class="btn btn-success" data-toggle="modal" data-target="#planeModal">Додати</button>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Номер</th>
                        <th>Марка</th>
                        <th>Кількість місць</th>
                        <th>Швидкість</th>
                        <th>Максимальна дальність</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
        `;
        if (this.list.length === 0) 
        {
            planeTabContent += '<tr><td colspan="6">Літаки відсутні</td></tr>';
        } else 
        {
            planeTabContent += this.displayTableRows();
        }
        planeTabContent += `</tbody></table>`;
        planeTab.innerHTML = planeTabContent;
    }
}

class RouteList extends BaseList 
{
    constructor() 
    {
        super();
    }

    async loadData() 
    {
        try 
        {
            const response = await fetch(`${API_URL}/routes`);
            if (!response.ok) throw new Error('Помилка завантаження маршрутів');
            const routes = await response.json();
            this.list = routes.map(route => new Route(route.id, route.from, route.to, route.distance, route.duration));
            this.display();
        } catch (error) 
        {
            console.error('Помилка завантаження маршрутів:', error);
            alert('Не вдалося завантажити дані про маршрути.');
        }
    }

    async add(dataObj) 
    {
        try 
        {
            const response = await fetch(`${API_URL}/routes`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                {
                    from: dataObj.from,
                    to: dataObj.to,
                    distance: dataObj.distance,
                    duration: dataObj.duration
                })
            });
            if (!response.ok) throw new Error('Помилка додавання маршруту');
            await this.loadData();
        } catch (error) 
        {
            console.error('Помилка додавання маршруту:', error);
            alert('Не вдалося додати маршрут.');
        }
    }

    async edit(dataObj) 
    {
        try 
        {
            const response = await fetch(`${API_URL}/routes/${dataObj.id}`, 
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                {
                    from: dataObj.from,
                    to: dataObj.to,
                    distance: dataObj.distance,
                    duration: dataObj.duration
                })
            });
            if (!response.ok) throw new Error('Помилка редагування маршруту');
            await this.loadData();
        } catch (error) 
        {
            console.error('Помилка редагування маршруту:', error);
            alert('Не вдалося відредагувати маршрут.');
        }
    }

    async delete(id) 
    {
        try 
        {
            const response = await fetch(`${API_URL}/routes/${id}`, 
            {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Помилка видалення маршруту');
            await this.loadData(); 
        } catch (error) 
        {
            console.error('Помилка видалення маршруту:', error);
            alert('Не вдалося видалити маршрут.');
        }
    }

    display() 
    {
        const routeTab = document.getElementById('routes');
        let routeTabContent = `
            <h3>Маршрути</h3>
            <button id="addRoutes" class="btn btn-success" data-toggle="modal" data-target="#routeModal">Додати</button>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Пункт вильоту</th>
                        <th>Пункт призначення</th>
                        <th>Відстань</th>
                        <th>Тривалість</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
        `;
        if (this.list.length === 0) 
        {
            routeTabContent += '<tr><td colspan="5">Маршрути відсутні</td></tr>';
        } else 
        {
            routeTabContent += this.displayTableRows();
        }
        routeTabContent += `</tbody></table>`;
        routeTab.innerHTML = routeTabContent;
    }
}

class FlightList extends BaseList 
{
    constructor(planeList) 
    {
        super();
        this.planeList = planeList;
        this.list = []; 
    }

    add(dataObj) 
    {
        dataObj.id = this.list.length + 1; 
        let flight = new Flight(dataObj.id, dataObj.plane, dataObj.departure, dataObj.arrival, dataObj.tickets);
        this.list.push(flight);
    }

    display() 
    {
        const flightTab = document.getElementById('flights');
        const flightSelect = document.getElementById('flightPlaneInput');
        let flightTabContent = `
            <h3>Рейси</h3>
            <button id="addFlights" class="btn btn-success" data-toggle="modal" data-target="#flightModal">Додати</button>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Літак</th>
                        <th>Дата, час вильоту</th>
                        <th>Дата, час прибуття</th>
                        <th>Кількість проданих квитків</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
        `;
        if (this.list.length === 0) 
        {
            flightTabContent += '<tr><td colspan="5">Рейси відсутні</td></tr>';
        } else 
        {
            flightTabContent += this.displayTableRows();
        }
        flightTabContent += `</tbody></table>`;
        flightTab.innerHTML = flightTabContent;

        flightSelect.innerHTML = this.planeList.list.map(plane => plane.displayAsOption()).join('');
    }
}

(async () => 
{
    const planeList = new PlaneList();
    const routeList = new RouteList();
    const flightList = new FlightList(planeList);

    await Promise.all([planeList.loadData(), routeList.loadData()]);
    flightList.display();

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-plane')) 
        {
            e.preventDefault();
            let elementId = e.target.getAttribute('data-id');
            planeList.delete(elementId);
            flightList.display();
        } else if (e.target.classList.contains('delete-flight')) 
        {
            e.preventDefault();
            let elementId = e.target.getAttribute('data-id');
            flightList.delete(elementId);
            flightList.display();
        } else if (e.target.classList.contains('delete-route')) 
        {
            e.preventDefault();
            let elementId = e.target.getAttribute('data-id');
            routeList.delete(elementId);
        } else if (e.target.classList.contains('edit-plane')) 
        {
            e.preventDefault();
            let elementId = e.target.getAttribute('data-id');
            let plane = planeList.getById(elementId);
            document.getElementById('planeIdInput').value = plane.id;
            document.getElementById('planeNumberInput').value = plane.number;
            document.getElementById('planeBrandInput').value = plane.brand;
            document.getElementById('planeSeatsInput').value = plane.seats;
            document.getElementById('planeSpeedInput').value = plane.speed;
            document.getElementById('planeRangeInput').value = plane.range;
            document.getElementById('addPlanes').click();
        } else if (e.target.classList.contains('edit-flight')) 
        {
            e.preventDefault();
            let elementId = e.target.getAttribute('data-id');
            let flight = flightList.getById(elementId);
            document.getElementById('flightIdInput').value = flight.id;
            document.getElementById('flightPlaneInput').value = flight.plane;
            document.getElementById('flightDepartureInput').value = flight.departure;
            document.getElementById('flightArrivalInput').value = flight.arrival;
            document.getElementById('flightTicketsInput').value = flight.tickets;
            document.getElementById('addFlights').click();
        } else if (e.target.classList.contains('edit-route')) 
        {
            e.preventDefault();
            let elementId = e.target.getAttribute('data-id');
            let route = routeList.getById(elementId);
            document.getElementById('routeIdInput').value = route.id;
            document.getElementById('routeDepartureInput').value = route.from;
            document.getElementById('routeArrivalInput').value = route.to;
            document.getElementById('routeDistanceInput').value = route.distance;
            document.getElementById('routeDurationInput').value = route.duration;
            document.getElementById('addRoutes').click();
        }
    });

    document.addEventListener('submit', function (e) 
    {
        if (e.target.id == "planeForm") 
        {
            e.preventDefault();
            let id = document.getElementById('planeIdInput').value;
            let newPlane = 
            {
                id: id,
                number: document.getElementById('planeNumberInput').value,
                brand: document.getElementById('planeBrandInput').value,
                seats: document.getElementById('planeSeatsInput').value,
                speed: document.getElementById('planeSpeedInput').value,
                range: document.getElementById('planeRangeInput').value
            };
            if (id == "") 
            {
                planeList.add(newPlane);
            } else 
            {
                planeList.edit(newPlane);
            }
            flightList.display();
            document.getElementById('planeIdInput').value = "";
            document.getElementById('planeForm').reset();
            document.getElementById('closePlaneModal').click();
        } else if (e.target.id == "flightForm") 
        {
            e.preventDefault();
            let id = document.getElementById('flightIdInput').value;
            let newFlight = 
            {
                id: id,
                plane: document.getElementById('flightPlaneInput').value,
                departure: document.getElementById('flightDepartureInput').value,
                arrival: document.getElementById('flightArrivalInput').value,
                tickets: document.getElementById('flightTicketsInput').value
            };
            if (id == "") 
            {
                flightList.add(newFlight);
            } else 
            {
                flightList.edit(newFlight);
            }
            flightList.display();
            document.getElementById('flightIdInput').value = "";
            document.getElementById('flightForm').reset();
            document.getElementById('closeFlightModal').click();
        } else if (e.target.id == "routeForm") 
        {
            e.preventDefault();
            let id = document.getElementById('routeIdInput').value;
            let newRoute = 
            {
                id: id,
                from: document.getElementById('routeDepartureInput').value,
                to: document.getElementById('routeArrivalInput').value,
                distance: document.getElementById('routeDistanceInput').value,
                duration: document.getElementById('routeDurationInput').value
            };
            if (id == "") 
            {
                routeList.add(newRoute);
            } else 
            {
                routeList.edit(newRoute);
            }
            document.getElementById('routeIdInput').value = "";
            document.getElementById('routeForm').reset();
            document.getElementById('closeRouteModal').click();
        }
    });
})();