
document.addEventListener('DOMContentLoaded', () => {

    const productWith = document.querySelector('.product-with')
    const colorWith = document.querySelector('.category-color')
    const materialWith = document.querySelector('.category-material')

    const dialogContent = document.querySelector('.dialog-content');

    const quantity = document.getElementById('quantity');
    const url = './src/data/db.json';

    const filterColorProduct = async (colorId) => {
        const response = await fetch(url)
        const data = await response.json();

        return data.products.filter((product) => product.colorProductId === +colorId)
    }
    const filterMaterialProduct = async (materialId) => {
        const response = await fetch(url);
        const data = await response.json();

        return data.products.filter((product) => product.materialProductId === +materialId)
    }
    const findProductData = async (productId) => {

        const response = await fetch(url);
        const data = await response.json();

        return data.products.find((product) => product.id === +productId);
    };

    const filterCategoryProduct = async (categoryId) => {
        const response = await fetch(url);
        const data = await response.json();

        return data.products.filter((product) => product.categoryId === +categoryId)
    }
    const fetchProduct = async () => {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        data.products.forEach(element => {
            productWith.innerHTML += `

            <div class="card"  data-product="${element.id}" data-categoryId="${element.categoryId}">
          
            <span class="new" data-new="${element.isNewProduct}">New</span>
            <a  class="card-img" data-product="${element.id}"  data-categoryId="${element.categoryId}">
            <img  src="${element.productImage}" alt="" />
            </a>
            <div class="card-body">
             <h2 class="card-title">${element.productName}</h2>
            
            </div>
  
            <div class="card-price">
            <button  class="btn-card"  data-id='${element.id}' data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}">AddToCart</button>
             <p class="price-title">$ ${element.price} </p>
            </div>
               <button type='submit' class="btn-detail" data-product="${element.id}" >Quick Look <span><i class="fa-regular fa-heart"></i></span></button>
          </div> 
            `;
            let basket = JSON.parse(localStorage.getItem('basket'));

            if (!basket) {
                basket = [];
                localStorage.setItem('basket', JSON.stringify(basket));
            }

            ;


            const btnCardButtons = document.querySelectorAll('.btn-card');
            const btnDetailButtons = document.querySelectorAll('.btn-detail');
            const detail = document.querySelector('.details');
            const card = document.querySelectorAll('.card-img')
            card.forEach(button => {

                const productId = button.getAttribute('data-product');
                const categoryId = button.getAttribute('data-categoryId');

                button.addEventListener('click', async (event) => {

                    const categoryProduct = await filterCategoryProduct(categoryId);
                    const product = await findProductData(productId);
                    const route = window.location.href = 'detail.html';
                    if (window.location.href === route) {

                        product.forEach((element) => {

                            detail.innerHTML =
                                `
                      <div class="detail-category">
                      <ul>
                          <li><a href="">Home</a></li>/
                          <li><a href="">With SideBar</a></li>/
                          <li><a href="">e${element.categoryName}</a></li>/
                          <li><a href="">${element.productName}</a></li>
                      </ul>
                  </div>
                  <div class="details-row">
                      <div class="details-img">
                          <img src="${element.productImage}" alt="">
                      </div>
                      <div class="details-text">
                          <h1 class="detail-title">${element.title}</h1>
                          <p class="detail-price"> $ ${element.price}</p>
       
                          <div class="detail-body">
                              <p class="detail-description">${element.description.substring(0, 70)}</p>
       
                          </div>
                          <div class="detail-quantity">
                              <input type="text">
                              <button>Add to Cart</button>
                              <div class="details-quantity-body">
                                 <p>Sku <strong>122</strong></p>
                                 <p>Categories <strong>${element.categoryName}</strong></p>
                           
                              </div>
                          </div>
                      </div>
                  </div>
                      `;

                        })

                        console.log(categoryProduct);
                    }
                    ; // Navigate to detail.html
                });
            });



            btnDetailButtons.forEach((button) => {
                button.addEventListener('click', async (event) => {
                    dialogContent.style.opacity = 1;
                    dialogContent.innerHTML = '';
                    const productId = button.getAttribute('data-product');
                    var product = await findProductData(productId);

                    if (product) {
                        dialogContent.innerHTML += `
              <div class="dialog-row">
              <span class="dialog-remove">X</span>
              <div class="dialog-image">
                  <img src="${product.productImage}" alt="">
              </div>
              <div class="dialog-text">
                  <h1 class="dialog-title">${product.productName}</h1>
                  <p class="dialog-price">$ ${product.price}</p>
                  <div class="dialog-body">
                    <p class="dialog-description">${product.description.substring(0, 160)}</p>
                
                  </div>
                  <div class="dialog-quantity">
                  <input class="dialog-input" type="number">
                   <button class="btn-add">Add TO Cart</button>
                </div>
              </div>
          </div>
              `

                        const dialogRemove = document.querySelector('.dialog-remove');

                        dialogRemove.addEventListener("click", () => {

                            dialogContent.style.opacity = 0;

                        })

                    } else {
                        console.log("no product find ")
                    }
                });
            });
            btnCardButtons.forEach((buttons) => {

                const id = buttons.getAttribute('data-id');
                const title = buttons.getAttribute('data-title');
                const price = buttons.getAttribute('data-price');
                const image = buttons.getAttribute('data-image');
                buttons.addEventListener('click', (event) => {




                    let basket = JSON.parse(localStorage.getItem('basket'));


                    let _id = basket.find(a => { return a.id == id })


                    if (_id == undefined) {

                        let item = {

                            id,
                            count: 1,
                            image,
                            title,
                            price
                        }
                        basket.push(item);
                    }



                    else {

                        _id.count++;
                    }
                    quantity.innerHTML = '12';
                    console.log(basket[id]);
                    basket.forEach(element=>{
                        total=+element.price*+element.count;
                        sub+=total;
                        quantity.innerHTML += `${sub}`;
                        console.log(sub)
                     })
                  


                    localStorage.setItem('basket', JSON.stringify(basket));
                });
            });


        });

    }
    const fetchColorProduct = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            {
                data.colorProduct.forEach((element) => {
                    colorWith.innerHTML +=
                        `
                  
                    <li ><a class="color-link" data-id="${element.id}">${element.colorName}</a></li>
                  
                    `;
                    const colorLink = document.querySelectorAll('.color-link');

                    colorLink.forEach(button => {

                        const colorId = button.getAttribute('data-id');

                        button.addEventListener('click', async (event) => {
                            productWith.innerHTML = '';
                            var filter = await filterColorProduct(colorId);
                            filter.forEach(element => {

                                productWith.innerHTML += `

                            <div class="card"  data-product="${element.id}" data-categoryId="${element.categoryId}">
                          
                            <span class="new" data-new="${element.isNewProduct}">New</span>
                            <a  class="card-img" data-product="${element.id}"  data-categoryId="${element.categoryId}">
                            <img  src="${element.productImage}" alt="" />
                            </a>
                            <div class="card-body">
                             <h2 class="card-title">${element.productName}</h2>
                            
                            </div>
                  
                            <div class="card-price">
                            <button  class="btn-card"  data-id='${element.id}' data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}">AddToCart</button>
                             <p class="price-title">$ ${element.price} </p>
                            </div>
                               <button type='submit' class="btn-detail" data-product="${element.id}" >Quick Look <span><i class="fa-regular fa-heart"></i></span></button>
                          </div> 
                            `;
                                let basket = JSON.parse(localStorage.getItem('basket'));
                                if (!basket) {
                                    localStorage.setItem('basket', JSON.stringify([]))
                                }
                                ;


                                const btnCardButtons = document.querySelectorAll('.btn-card');
                                const btnDetailButtons = document.querySelectorAll('.btn-detail');
                                const card = document.querySelectorAll('.card-img');
                                const detail = document.querySelector('.details')
                                card.forEach(button => {

                                    const productId = button.getAttribute('data-product');
                                    const categoryId = button.getAttribute('data-categoryId');

                                    button.addEventListener('click', async (event) => {

                                        const categoryProduct = await filterCategoryProduct(categoryId);
                                        const product = await findProductData(productId);
                                        const route = window.location.href = 'detail.html';
                                        if (window.location.href === route) {
                                            if (Array.isArray(product))
                                                product.forEach((element) => {

                                                    detail.innerHTML =
                                                        `
                                      <div class="detail-category">
                                      <ul>
                                          <li><a href="">Home</a></li>/
                                          <li><a href="">With SideBar</a></li>/
                                          <li><a href="">e${element.categoryName}</a></li>/
                                          <li><a href="">${element.productName}</a></li>
                                      </ul>
                                  </div>
                                  <div class="details-row">
                                      <div class="details-img">
                                          <img src="${element.productImage}" alt="">
                                      </div>
                                      <div class="details-text">
                                          <h1 class="detail-title">${element.title}</h1>
                                          <p class="detail-price"> $ ${element.price}</p>
                       
                                          <div class="detail-body">
                                              <p class="detail-description">${element.description.substring(0, 70)}</p>
                       
                                          </div>
                                          <div class="detail-quantity">
                                              <input type="text">
                                              <button>Add to Cart</button>
                                              <div class="details-quantity-body">
                                                 <p>Sku <strong>122</strong></p>
                                                 <p>Categories <strong>${element.categoryName}</strong></p>
                                           
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                      `;

                                                })

                                            console.log(categoryProduct);
                                        }
                                        ; // Navigate to detail.html
                                    });
                                });



                                btnDetailButtons.forEach((button) => {
                                    button.addEventListener('click', async (event) => {
                                        dialogContent.style.opacity = 1;
                                        dialogContent.innerHTML = '';
                                        const productId = button.getAttribute('data-product');
                                        var product = await findProductData(productId);

                                        if (product) {
                                            dialogContent.innerHTML += `
                              <div class="dialog-row">
                              <span class="dialog-remove">X</span>
                              <div class="dialog-image">
                                  <img src="${product.productImage}" alt="">
                              </div>
                              <div class="dialog-text">
                                  <h1 class="dialog-title">${product.productName}</h1>
                                  <p class="dialog-price">$ ${product.price}</p>
                                  <div class="dialog-body">
                                    <p class="dialog-description">${product.description.substring(0, 160)}</p>
                                
                                  </div>
                                  <div class="dialog-quantity">
                                  <input class="dialog-input" type="number">
                                   <button class="btn-add">Add TO Cart</button>
                                </div>
                              </div>
                          </div>
                              `

                                            const dialogRemove = document.querySelector('.dialog-remove');

                                            dialogRemove.addEventListener("click", () => {

                                                dialogContent.style.opacity = 0;

                                            })

                                        } else {
                                            console.log("no product find ")
                                        }
                                    });
                                });
                                btnCardButtons.forEach((buttons) => {

                                    const id = buttons.getAttribute('data-id');
                                    const title = buttons.getAttribute('data-title');
                                    const price = buttons.getAttribute('data-price');
                                    const image = buttons.getAttribute('data-image');
                                    buttons.addEventListener('click', (event) => {




                                        let basket = JSON.parse(localStorage.getItem('basket'));


                                        let _id = basket.find(a => { return a.id == id })


                                        if (_id == undefined) {

                                            let item = {

                                                id,
                                                count: 1,
                                                image,
                                                title,
                                                price
                                            }
                                            basket.push(item);
                                        }



                                        else {

                                            _id.count++;
                                        }
                                       
                                        let sub =0 ;
                                        let total =0 ;
                                       
                                         basket.forEach(element=>{
                                            total=+element.price*+element.count;
                                            sub+=total;
                                            quantity.innerHTML += `${sub}`;
                                            console.log(sub)
                                         })
                                        


                                        localStorage.setItem('basket', JSON.stringify(basket));
                                    });
                                });
                            }
                            )

                        })
                    })
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
    const fetchMaterialProduct = async () => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data.materialProduct))
            data.materialProduct.forEach(element => {

                materialWith.innerHTML += `
               <li ><a class='meterail-link' data-id="${element.id}">${element.materailName}</a></li>
               `;

                const materialLink = document.querySelectorAll('.meterail-link');

                materialLink.forEach(button => {
                    const materialId = button.getAttribute('data-id');

                    button.addEventListener('click', async (event) => {

                        productWith.innerHTML = '';
                        const materialProduct = await filterMaterialProduct(materialId);

                        materialProduct.forEach(element => {
                            console.log(element)
                            productWith.innerHTML += `

                    <div class="card"  data-product="${element.id}" data-categoryId="${element.categoryId}">
                  
                    <span class="new" data-new="${element.isNewProduct}">New</span>
                    <a  class="card-img" data-product="${element.id}"  data-categoryId="${element.categoryId}">
                    <img  src="${element.productImage}" alt="" />
                    </a>
                    <div class="card-body">
                     <h2 class="card-title">${element.productName}</h2>
                    
                    </div>
          
                    <div class="card-price">
                    <button  class="btn-card"  data-id='${element.id}' data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}">AddToCart</button>
                     <p class="price-title">$ ${element.price} </p>
                    </div>
                       <button type='submit' class="btn-detail" data-product="${element.id}" >Quick Look <span><i class="fa-regular fa-heart"></i></span></button>
                  </div> 
                    `;
                            let basket = JSON.parse(localStorage.getItem('basket'));
                            if (!basket) {
                                localStorage.setItem('basket', JSON.stringify([]))
                            }
                            ;


                            const btnCardButtons = document.querySelectorAll('.btn-card');
                            const btnDetailButtons = document.querySelectorAll('.btn-detail');
                            const card = document.querySelectorAll('.card-img');
                            const detail = document.querySelector('.details')
                            card.forEach(button => {

                                const productId = button.getAttribute('data-product');
                                const categoryId = button.getAttribute('data-categoryId');

                                button.addEventListener('click', async (event) => {

                                    const categoryProduct = await filterCategoryProduct(categoryId);
                                    const product = await findProductData(productId);
                                    const route = window.location.href = 'detail.html';
                                    if (window.location.href === route) {
                                        if (Array.isArray(product))
                                            product.forEach((element) => {

                                                detail.innerHTML =
                                                    `
                              <div class="detail-category">
                              <ul>
                                  <li><a href="">Home</a></li>/
                                  <li><a href="">With SideBar</a></li>/
                                  <li><a href="">e${element.categoryName}</a></li>/
                                  <li><a href="">${element.productName}</a></li>
                              </ul>
                          </div>
                          <div class="details-row">
                              <div class="details-img">
                                  <img src="${element.productImage}" alt="">
                              </div>
                              <div class="details-text">
                                  <h1 class="detail-title">${element.title}</h1>
                                  <p class="detail-price"> $ ${element.price}</p>
               
                                  <div class="detail-body">
                                      <p class="detail-description">${element.description.substring(0, 70)}</p>
               
                                  </div>
                                  <div class="detail-quantity">
                                      <input type="text">
                                      <button>Add to Cart</button>
                                      <div class="details-quantity-body">
                                         <p>Sku <strong>122</strong></p>
                                         <p>Categories <strong>${element.categoryName}</strong></p>
                                   
                                      </div>
                                  </div>
                              </div>
                          </div>
                              `;

                                            })

                                        console.log(categoryProduct);
                                    }
                                    ; // Navigate to detail.html
                                });
                            });
                            btnDetailButtons.forEach((button) => {
                                button.addEventListener('click', async (event) => {
                                    dialogContent.style.opacity = 1;
                                    dialogContent.innerHTML = '';
                                    const productId = button.getAttribute('data-product');
                                    var product = await findProductData(productId);

                                    if (product) {
                                        dialogContent.innerHTML += `
                                <div class="dialog-row">
                                <span class="dialog-remove">X</span>
                                <div class="dialog-image">
                                    <img src="${product.productImage}" alt="">
                                </div>
                                <div class="dialog-text">
                                    <h1 class="dialog-title">${product.productName}</h1>
                                    <p class="dialog-price">$ ${product.price}</p>
                                    <div class="dialog-body">
                                      <p class="dialog-description">${product.description.substring(0, 160)}</p>
                                  
                                    </div>
                                    <div class="dialog-quantity">
                                    <input class="dialog-input" type="number">
                                     <button class="btn-add">Add TO Cart</button>
                                  </div>
                                </div>
                            </div>
                                `

                                        const dialogRemove = document.querySelector('.dialog-remove');

                                        dialogRemove.addEventListener("click", () => {

                                            dialogContent.style.opacity = 0;

                                        })

                                    } else {
                                        console.log("no product find ")
                                    }
                                });
                            });
                            btnCardButtons.forEach((buttons) => {

                                const id = buttons.getAttribute('data-id');
                                const title = buttons.getAttribute('data-title');
                                const price = buttons.getAttribute('data-price');
                                const image = buttons.getAttribute('data-image');
                                buttons.addEventListener('click', (event) => {




                                    let basket = JSON.parse(localStorage.getItem('basket'));


                                    let _id = basket.find(a => { return a.id == id })


                                    if (_id == undefined) {

                                        let item = {

                                            id,
                                            count: 1,
                                            image,
                                            title,
                                            price
                                        }
                                        basket.push(item);
                                    }



                                    else {

                                        _id.count++;
                                    }
                                    quantity.innerHTML = ' ';
                                    console.log(basket[id]);

                                    quantity.innerHTML += `${basket[id].count}`;


                                    localStorage.setItem('basket', JSON.stringify(basket));
                                });
                            });
                        })
                    })
                })

            })
    }





    fetchProduct();
    fetchColorProduct();
    fetchMaterialProduct();
});

