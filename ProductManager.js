import {promises as fs} from 'fs'

class ProductManager {
    constructor(path) {
        this.path = path
        this.products = []
        this.lastProductId = 0
    }


    validate(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos son obligatorios.");
        }


        if (this.products.some(product => product.code === code)) {
            throw new Error("El código del producto ya está en uso.");
        }
    }


    addProduct = async (title, description, price, thumbnail, code, stock) => {
        try {
            this.validate(title, description, price, thumbnail, code, stock)

            const product = {
                id: ++this.lastProductId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }

            this.products.push(product)

            return fs.writeFile(this.path, JSON.stringify(this.products))

        } catch (error) {
            console.error(error.message)
        }
    }


    getProducts = async () => {
        let response = await fs.readFile(this.path, "utf-8")
        let result=JSON.parse(response)
        return result
    }


    getProductById = async (productId) => {
        let result = await this.getProducts()
        let prod = result.find(product => product.id === productId)

        if (prod) {
            return prod;
        } else {
            console.error(`Producto no encontrado. ID: ${productId}`);
            return null;
        }
    }

    deleteProduct = async (productId) => {
        let resp = await this.getProducts()
        let product = resp.filter(prod => prod.id != productId)
        await fs.writeFile(this.path, JSON.stringify(product))
    }

    updateProduct = async (id, campo) => {
        let prod = await this.getProductById(id)
        await this.deleteProduct(id)
        let prods = await this.getProducts()
        let productUpdated = [{...prod, ...campo}, ...prods]
        await fs.writeFile(this.path, JSON.stringify(productUpdated))
    }

}


const productos = new ProductManager("./Products.json");

//const resultado= await productos.getProducts()
// Llamada al array vacío
//console.log(resultado);


// Agregar Productos
//await productos.addProduct('titulo1', 'descripcion1', 1500, 'imagen1', 'abc123', 5);
//await productos.addProduct('titulo2', 'descripcion2', 1500, 'imagen2', 'abc124', 4);


// Validación de código repetido
//await productos.addProduct('titulo3', 'descripcion3', 1500, 'imagen3', 'abc124', 7);


// Búsqueda de ID
//const productById2 = await productos.getProductById(1);
//console.log(productById2);


// Búsqueda ID no encontrado
//const productById5 = await productos.getProductById(5);
//console.log(productById5);

//Eliminar producto
//await productos.deleteProduct(1)

//Actualizar producto
//await productos.updateProduct(1, {title:"producto5"})