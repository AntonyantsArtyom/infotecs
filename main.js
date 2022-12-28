import store from "./modules/store.js"
import { InfoWindow, Product } from "./modules/views.js"

// переменные для хранения экземпляров классов из Views
let productNodes = []
let infoWindow = null
let dropProduct = null
let dragProduct = null
//переменная, указывающая сколько узлов продуктов нужно создать
let size = 10

//событие наведения курсора на html-узел продукта
let productOnmouseover = (index) => {
   return () => {
      //вызывает пересоздание информационного окна и устанавливает значение
      //store.hoverProduct
      infoWindow ? infoWindow.deleteNode() : 0
      store.hoverProduct = productNodes[index].product
      //создаваемое информационное окно находится рядом с узлом
      //продукта и отражает информацию о соответствующем продукте
      //так же созданный объект сохраняется в переменную infoWindow
      //дальнейшей с ним работы

      infoWindow = new InfoWindow(store.hoverProduct, [
         productNodes[index].node.offsetLeft +
            productNodes[index].node.offsetWidth +
            65,
         productNodes[index].node.offsetTop,
      ])
   }
}
//событие начала перетаскивание объекта
let productOndragstart = (index) => {
   return () => {
      //скрывает инфомрационное окно и устанавливает store.dragProduct
      infoWindow ? infoWindow.deleteNode() : 0
      dragProduct = productNodes[index]
      store.dragProduct = dragProduct.product
   }
}
//событие конца перетаскивания
let productOndrop = (index) => {
   return () => {
      //устанавливает значение dropProduct
      dropProduct = productNodes[index]
      store.dropProduct = dropProduct.product

      //меняет местами продукты в массиве store.products
      //что вызывает пересоздание узлов продуктов в DOM-дереве
      let products = store.productsAct("get")
      const indexDrop = products.indexOf(store.dropProduct)
      const indexDrag = products.indexOf(store.dragProduct)
      products = [...products]
      ;[products[indexDrag], products[indexDrop]] = [
         products[indexDrop],
         products[indexDrag],
      ]
      store.productsAct("set", products)

      //устанавливает новое значение hoverProduct (не store.hoverProduct)
      //новое значение необходимо вновь установить, так как предыдущие узлы
      //продуктов были просто удалены с DOM-дерева при пересоздание узлов
      //продуктов, а значит мы не сможем, например, получить координаты старого
      //узла hoverProuct, так как его просто нет

      //новое значение hoverProduct - это такой экземпляр Product, который описывает
      //тот же продукт, что и старый hoverProduct
      const hoverProduct =
         productNodes[
            productNodes.findIndex(
               (product) =>
                  JSON.stringify(product.product) ==
                  JSON.stringify(store.hoverProduct)
            )
         ]
      //через малый интервал времени вызываем создание информационного окна уже
      //рядом с новым hoverProduct

      //задержку пришлось добавить из-за того, что иначе информационное окно иногда не меняло
      //свое место при пересоздание узлов продуктов, так и не осознал причины этого. Проблему
      //можно увидеть, если добавить задержку с 500 или больше и не двигать мышью во время
      //изменения мест продуктов, в таком случае ошибка иногда проявляется
      setTimeout(() => {
         infoWindow ? infoWindow.deleteNode() : 0
         infoWindow = null
         infoWindow = new InfoWindow(hoverProduct.product, [
            hoverProduct.node.offsetLeft + hoverProduct.node.offsetWidth + 65,
            hoverProduct.node.offsetTop,
         ])
      }, 50)
   }
}
//пересоздание узлов продуктов
let setProductsNodes = () => {
   productNodes.forEach((product) => {
      product.deleteNode()
   })
   productNodes = []
   store
      .productsAct("get")
      .slice(0, size)
      .forEach((currentProduct, index) => {
         productNodes.push(
            new Product(
               currentProduct,
               document.querySelector(".productList"),
               {
                  onmouseover: productOnmouseover(index),
                  ondragstart: productOndragstart(index),
                  ondrop: productOndrop(index),
                  onmouseout: () => {
                     infoWindow.deleteNode()
                     infoWindow = null
                  },
                  ondragover: (event) => event.preventDefault(),
               }
            )
         )
      })
}

fetch("https://dummyjson.com/products")
   .then((response) => response.json())
   .then((response) => {
      //установка дополнительного действия для productAct
      store.productsActAdditional = setProductsNodes
      store.productsAct("set", response.products)
   })

//функционал изменения количества записей о продуктах и сортировок
//списка продуктов для соответствующих узлов
const countInput = document.querySelector(
   ".controllers > .count-setting > .count-input"
)
countInput.onfocus = () => {
   countInput.value = ""
}
countInput.onblur = () => {
   if (countInput.value.match(/^[0-9]+$/)) size = countInput.value
   setProductsNodes()
}
countInput.onkeyup = (event) => {
   if (event.keyCode == 13) {
      if (countInput.value.match(/^[0-9]+$/)) size = countInput.value
      setProductsNodes()
      countInput.blur()
   }
}

//сортировки работают только с видимой частью продуктов
const priceSortButton = document.querySelector(
   ".controllers > .sorting-buttons > .price-button"
)
priceSortButton.onclick = () => {
   let products = [...store.productsAct("get")]
   products = products.slice(0, size)
   products.sort((a, b) => {
      return a.price > b.price ? 1 : -1
   })
   products = [...products, ...store.productsAct("get").slice(size)]
   store.productsAct("set", products)
}

const ratingSortButton = document.querySelector(
   ".controllers > .sorting-buttons > .rating-button"
)
ratingSortButton.onclick = () => {
   let products = [...store.productsAct("get")]
   products = products.slice(0, size)
   products.sort((a, b) => {
      return a.rating > b.rating ? 1 : -1
   })
   products = [...products, ...store.productsAct("get").slice(size)]
   store.productsAct("set", products)
}