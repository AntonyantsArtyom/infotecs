//в данном файле описываются классы, экземпляры которых работают с DOM сайта

class Product {
   constructor(product, parent, events) {
      //product - объект продукта
      //parent - html-узел, в который будет вставляться узел node
      //event - объект такого вида, что ключи - это названия событий узла node,
      //                      значения ключей - функции, которые вызываются при этих событиях

      //при своем создании, экземпляр класса создает узел node  и вставляет его в parent.
      //так же к объекту node добавляются все реакции на события из объекта event

      //создаваемые узел - это тот, который по заданию отражает title продукта

      //сохранение значений product, parent и event в качестве свойств экземпляра
      this.product = product
      this.parent = parent
      this.events = events
      //создание и добавление в DOM узла node, сохранение узла node в качестве свойства экземпляра
      this.node = document.createElement("div")
      this.node.classList.add("product")
      this.node.innerHTML = product.title
      this.node.draggable = true
      for (let event in events) {
         this.node[event] = events[event]
      }
      this.parent.append(this.node)
   }
   //я думал, что в js есть способ вызвать определенные действия перед удалением экземпляра класса
   //что-то вроде __del в питоне. Я хотел, чтобы при удаление экземпляра класса его узел так же
   //удалялся. Но в js нет такой возможности, во всяком случае я не смог найти, поэтому удаление
   //узла node вынесено в отдельный метод
   deleteNode() {
      this.node.remove()
   }
}
class InfoWindow {
   constructor(product, pos) {
      //product - объект продукта
      //pos - массив вида [x,y]

      //при своем создании экземпляр класса создает узел node - узел информационно окна
      //о продукте. В стилях прописано, что этот узел имеет абсолютное позиционирование
      //создаванный узел будет иметь координаты [x,y] px
      this.product = product
      this.x = pos[0]
      this.y = pos[1]

      this.node = document.createElement("div")
      this.node.classList.add("infoWindow")
      this.node.style.left = this.x + "px"
      this.node.style.top = this.y + "px"
      this.node.insertAdjacentHTML(
         "beforeend",
         `<h1 class="title">${product.title}</h1>
          <p class="description">${product.description}</p>
          <img class="image" src=${product.thumbnail} alt="">
          <div class="numerical-info">
             <p class="price">${product.price}$</p>
             <p class="rating">${product.rating}/10</p>
          </div>
          `
      )

      document.body.append(this.node)
   }
   deleteNode() {
      this.node.remove()
   }
}

export { Product, InfoWindow }
