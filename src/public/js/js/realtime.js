const socket = io();
const $ = document;

socket.on("products", (data) => {
    viewProducts(data);
});

const viewProducts = (productos) => {
    const prods = document.getElementById("product-list");
    prods.innerHTML = "";
    productos.docs.forEach(item => {
        const cardProds = document.createElement("div");
        cardProds.innerHTML =
            ` 
            <div>
            <div>codigo del producto: ${item.code
            } </br>ID: ${item._id}</div>
            <div>
            <img src="${item.thumbnail
            }" alt="img" id="img">
            <ul>
                <li><h4 >${item.title
            }</h4></li>
                <li >categoria: ${item.category
            }</li>
                <li>Estado: ${item.status}</li>
                <li>Existencias: ${item.stock
            }</li>
                <li>$${item.price
            }</li>
                <div>
                <button type="button" onclick="deleteProduct('${String(
                item._id
            )}')">Eliminar</button>
                </div>
            </ul>
            </div>
        </div>
        </div>
        `;
        prods.appendChild(cardProds);
        cardProds.querySelector("button").addEventListener("click", () => {
            deleteproduct(item._id);
        });
    });
};

const deleteproduct = (id) => {
    socket.emit("deleteProd", id);
};

document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct();
});

const addProduct = () => {
    const producto = {
        title: $.getElementById("title").value,
        thumbnail: $.getElementById("img").value,
        description: $.getElementById("description").value,
        price: $.getElementById("price").value,
        img: $.getElementById("img").value,
        code: $.getElementById("code").value,
        stock: $.getElementById("stock").value,
        category: $.getElementById("category").value,
        status: $.getElementById("status").value === "true",
    };
    socket.emit("addProd", producto);
};