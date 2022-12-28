//store - объект для хранения и работы с данными
//свойства:
//   массив products - служит для хранения массива продуктов, который получаются с запроса на API
//   объект hoverProduct - служит для хранения объекта продукта, на html-узел которого наведен пользователь
//   объект dragProduct - служит для хранения объекта продукта, html-узел которого перетаскивается
//   объект dropProduct - служит для хранения объекта продукта, на html-узел которого перетащили узел объекта dragProduct
//методы
//   productsAct - метод для получения и изменения products, принимает аргументы type и value
//                 вызывает метод productActAdditional при своем срабатывание
//   productActAdditional - метод, который вызывается при вызове productAct
const store = {
   _products: [],
   hoverProduct: {},
   dragProduct: {},
   dropProduct: {},
   productsActAdditional() {},
   productsAct(type, value) {
      if (type == "get") {
         return this._products
      }
      if (type == "set") {
         this._products = value
      }
      this.productsActAdditional()
   },
}

export default store
