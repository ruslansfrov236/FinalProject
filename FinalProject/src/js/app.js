

document.addEventListener('DOMContentLoaded', () => {



  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const categoryNavbar = document.querySelector('.category-navbar');
  const dialogContent = document.querySelector('.dialog-content');
  const productCard = document.querySelector('.product-card');
  const productLeng = document.querySelector('.productLang');
  const quantity = document.getElementById('quantity');


  const url = './src/data/db.json';




  const fetchData = async () => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data && data.carousel) {
      data.carousel.forEach((element) => {
        const template = `
        
        <div class="swiper-slide"  >

            <div class="swiper-text">
            
            <h2>${element.title}</h2>
            <p>${element.decoration}</p>
            </div>
            <div class="swipper-image">
            <img src='${element.carouselImage}' alt=""/>
            </div>
           
        </div>
         
      `;
        swiperWrapper.innerHTML += template;

        const swiper = new Swiper('.swiper', {
          direction: 'horizontal',
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },

          pagination: {
            el: '.swiper-pagination',
          },

          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
      });
    } else {
      console.log('No colorProducts found in the data.');
    }
  };

  const fetchCategoryData = async () => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data && data.category) {
      data.category.forEach((element) => {
        categoryNavbar.innerHTML += `
           
          <li><a   class="category-link " data-id="${element.id}">${element.categoryName}</a></li>
          `;
        const categoryLink = document.querySelectorAll('.category-link');

        const dataFilterProductCategory = async (categoryId) => {
          const response = await fetch(url);
          const data = await response.json();
          return data.products.filter((a) => +categoryId === a.categoryId);
        };

        categoryLink.forEach((link) => {
          link.addEventListener('click', async (event) => {
            const categoryId = link.getAttribute('data-id');
            var dataProduct = await dataFilterProductCategory(categoryId);

            productCard.innerHTML = '';
            dataProduct.forEach(element => {


              productCard.innerHTML += `
         
          <div class="card"  data-product="${element.id}" data-categoryId="${element.categoryId}">
          
          <span class="new" data-new="${element.isNewProduct}">New</span>
          <a  class="card-img" data-product="${element.id}"  data-categoryId="${element.categoryId}">
          <img  src="${element.productImage}" alt="" />
          </a>
          <div class="card-body">
           <h2 class="card-title">${element.productName}</h2>
          
          </div>

          <div class="card-price">
          <p class="price-title">$ ${element.price} </p>
           <button class="btn-card"  data-id='${element.id}' data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}"
           >Click Me</button>

          </div>
             <button type='submit' class="btn-detail" data-product="${element.id}" >Quick Look <span><i class="fa-regular fa-heart"></i></span></button>
        </div>  
          `;

              let basket = JSON.parse(localStorage.getItem('basket'));
              let detailData = JSON.parse(localStorage.getItem('detailData'));
              let detailCategoryData = JSON.parse(localStorage.getItem('detailCategoryData'));

              if (!basket) {

                localStorage.setItem('basket', JSON.stringify([]));


              }
              if (!detailData) {
                localStorage.setItem('detailData', JSON.stringify([]))
              }
              if (!detailCategoryData) {
                localStorage.setItem('detailCategoryData', JSON.stringify([]))
              }

              ;



              const btnCardButtons = document.querySelectorAll('.btn-card');
              const btnDetailButtons = document.querySelectorAll('.btn-detail');

              const detail = document.querySelector('.details')
              const card = document.querySelectorAll('.card-img');
              card.forEach(button => {

                const productId = button.getAttribute('data-product');
                const categoryId = button.getAttribute('data-categoryId');



                button.addEventListener('click', async (event) => {

                  const categoryProduct = await filterCategoryProduct(categoryId);
                  const product = await findProductData(productId);


                  detailData.push(product);
                  detailCategoryData.push(categoryProduct)

                  localStorage.setItem('detailData', JSON.stringify(detailData));
                  localStorage.setItem('basket', JSON.stringify(basket));
                  localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
                  window.location.href = 'detail.html'

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


                buttons.addEventListener('click', (event) => {

                  const id = buttons.getAttribute('data-id');
                  const title = buttons.getAttribute('data-title');
                  const price = buttons.getAttribute('data-price');
                  const image = buttons.getAttribute('data-image');

                  let basket = JSON.parse(localStorage.getItem('basket'));
                  let _id = basket.find(item => item.id === id);

                  if (_id === undefined) {
                    let item = {
                      id,
                      count: 1,
                      image,
                      title,
                      price
                    };
                    basket.push(item);

                  } else {
                    _id.count++;
                  }





                  localStorage.setItem('basket', JSON.stringify(basket));
                  localStorage.setItem('detailData', JSON.stringify(detailData));
                  localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));

                });
              });

            })

          });
        });
      });
    } else {
      console.log('No categories found in the data.');
    }
  };


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

  const fetchProductData = async () => {

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data && data.products) {



        data.products.forEach(element => {


          productCard.innerHTML += `
    
          <div   class="card" data-product="${element.id}"  data-categoryId="${element.categoryId}">
           
            <span class="new" data-new="${element.isNewProduct}">New</span>
          
            <a class="card-img" data-product="${element.id}"  data-categoryId="${element.categoryId}">
            <img  src="${element.productImage}" alt="" />
            </a>

            <div class="card-body">
             <h2 class="card-title">${element.productName}</h2>
            
            </div>
            <div class="card-price">
            <button    class="btn-card"  data-id='${element.id}' data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}"   >AddToCart</button>
             <p class="price-title">$ ${element.price} </p>
            </div>
               <button type="submit" class="btn-detail"  data-product="${element.id}">Quick Look <span><i class="fa-regular fa-heart"></i></span></button>
          </div>
        `;
          let basket = JSON.parse(localStorage.getItem('basket'));
          let detailData = JSON.parse(localStorage.getItem('detailData'));
          let detailCategoryData = JSON.parse(localStorage.getItem('detailCategoryData'));

          if (!basket) {

            localStorage.setItem('basket', JSON.stringify([]));


          }
          if (!detailData) {
            localStorage.setItem('detailData', JSON.stringify([]))
          }
          if (!detailCategoryData) {
            localStorage.setItem('detailCategoryData', JSON.stringify([]))
          }

          ;



          const btnCardButtons = document.querySelectorAll('.btn-card');
          const btnDetailButtons = document.querySelectorAll('.btn-detail');

          const detail = document.querySelector('.details')
          const card = document.querySelectorAll('.card-img');
          card.forEach(button => {

            const productId = button.getAttribute('data-product');
            const categoryId = button.getAttribute('data-categoryId');



            button.addEventListener('click', async (event) => {

              const categoryProduct = await filterCategoryProduct(categoryId);
              const product = await findProductData(productId);


              detailData.push(product);
              detailCategoryData.push(categoryProduct)

              localStorage.setItem('detailData', JSON.stringify(detailData));
              localStorage.setItem('basket', JSON.stringify(basket));
              localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
              window.location.href = "detail.html"

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
                <div class="dialogs"   >
                <p class="quantity-dialogs-title">Quantity</p>
                    <div class="quantity-button" >
                     <button  type='button'  id="min">  <i class="fa-solid fa-caret-left"></i></button>
                     <button type='button'   id="max">  <i class="fa-solid fa-caret-right"></i></button>
                
                <input type="number" minlength="0"  id="quantityValue"   data-quantity="element"  />
                    </div>
                </div>
                 <button class="btn-add"  data-productId="${element.id}" data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}">Add TO Cart</button>
              </div>
            </div>
        </div>
            `
                let caretRight = document.querySelectorAll('#max');
                let caretLeft = document.querySelectorAll('#min');
                let quantityValue = document.querySelector('#quantityValue');
                const dialogRemove = document.querySelector('.dialog-remove');
                let basket = JSON.parse(localStorage.getItem('basket'));
                if (!basket) {

                  localStorage.setItem('basket', JSON.stringify([]));


                }
                const btnAddButtons= document.querySelector('.btn-add');
                caretLeft.forEach(button => {
                  button.addEventListener('click', event => {

                    quantityValue.value = +quantityValue.value - 1;
                    if (quantityValue.value == 0 || quantityValue.value < 0)
                      quantityValue.value = 0;

                  });
                });

                caretRight.forEach(button => {
                  button.addEventListener('click', event => {

                    quantityValue.value = +quantityValue.value + 1;
                  });
                });
                console.log(quantityValue.value)


                 
                    const id = btnAddButtons.getAttribute('data-productId');
                    const title = btnAddButtons.getAttribute('data-title');
                    const image = btnAddButtons.getAttribute('data-image');
                    const price = btnAddButtons.getAttribute('data-price');
                   
                    btnAddButtons.addEventListener("click" ,(event)=>{
                      let _id = basket.find(item => item.id === id);

                  if (_id === undefined) {
                   
                      let item = {
                        productId,
                        count: quantityValue.value,
                        image,
                        title,
                        price
                      };
                    
                      basket.push(item);
                   
                  
                  }
                });
                 



                  localStorage.setItem('basket', JSON.stringify(basket));
                
                  
                
                btnCardButtons.forEach((buttons) => {


                  buttons.addEventListener('click', (event) => {

                    const id = buttons.getAttribute('data-id');
                    const title = buttons.getAttribute('data-title');
                    const price = buttons.getAttribute('data-price');
                    const image = buttons.getAttribute('data-image');

                    let basket = JSON.parse(localStorage.getItem('basket'));
                    let detailData = JSON.parse(localStorage.getItem('detailData'));
                    let detailCategoryData = JSON.parse(localStorage.getItem('detailCategoryData'));

                    if (!basket) {

                      localStorage.setItem('basket', JSON.stringify([]));


                    }
                    if (!detailData) {
                      localStorage.setItem('detailData', JSON.stringify([]))
                    }
                    if (!detailCategoryData) {
                      localStorage.setItem('detailCategoryData', JSON.stringify([]))
                    }
                    ;



                    const btnCardButtons = document.querySelectorAll('.btn-card');
                    const btnDetailButtons = document.querySelectorAll('.btn-detail');

                    const detail = document.querySelector('.details')
                    const card = document.querySelectorAll('.card-img');
                    card.forEach(button => {

                      const productId = button.getAttribute('data-product');
                      const categoryId = button.getAttribute('data-categoryId');



                      button.addEventListener('click', async (event) => {

                        const categoryProduct = await filterCategoryProduct(categoryId);
                        const product = await findProductData(productId);


                        detailData.push(product);
                        detailCategoryData.push(categoryProduct)

                        localStorage.setItem('detailData', JSON.stringify(detailData));
                        localStorage.setItem('basket', JSON.stringify(basket));
                        localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
                        window.location.href = 'detail.html'

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
                          <div class="dialogs"   >
                          <p class="quantity-dialogs-title">Quantity</p>
                              <div class="quantity-button" >
                               <button  type='button'  id="min">  <i class="fa-solid fa-caret-left"></i></button>
                               <button type='button'   id="max">  <i class="fa-solid fa-caret-right"></i></button>
                          
                          <input type="number" minlength="0"  id="quantityValue"   data-quantity="element"  />
                              </div>
                          </div>
                           <button class="btn-add"  data-productId="${element.id}" data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}">Add TO Cart</button>
                        </div>
                      </div>
                  </div>
                      `
                          let caretRight = document.querySelectorAll('#max');
                          let caretLeft = document.querySelectorAll('#min');
                          let quantityValue = document.querySelector('#quantityValue');
                          const dialogRemove = document.querySelector('.dialog-remove');
                          let basket = JSON.parse(localStorage.getItem('basket'));
                          if (!basket) {
          
                            localStorage.setItem('basket', JSON.stringify([]));
          
          
                          }
                          const btnAddButtons= document.querySelector('.btn-add');
                          caretLeft.forEach(button => {
                            button.addEventListener('click', event => {
          
                              quantityValue.value = +quantityValue.value - 1;
                              if (quantityValue.value == 0 || quantityValue.value < 0)
                                quantityValue.value = 0;
          
                            });
                          });
          
                          caretRight.forEach(button => {
                            button.addEventListener('click', event => {
          
                              quantityValue.value = +quantityValue.value + 1;
                            });
                          });
                          console.log(quantityValue.value)
          
          
                           
                              const productId = btnAddButtons.getAttribute('data-productId');
                              const title = btnAddButtons.getAttribute('data-title');
                              const image = btnAddButtons.getAttribute('data-image');
                              const price = btnAddButtons.getAttribute('data-price');
  
                              btnAddButtons.addEventListener("click" ,(event)=>{
                                let _id = basket.find(item => item.id === id);
          
                            if (_id === undefined) {
                             
                                let item = {
                                  productId,
                                  count: quantityValue.value,
                                  image,
                                  title,
                                  price
                                };
                              
                                basket.push(item);
                             
                            
                            }else{
                              _id.count
                            }
                          });
                           
          
          
          
                            localStorage.setItem('basket', JSON.stringify(basket));
                            
                          
                            
                          
                          btnCardButtons.forEach((buttons) => {
          
          
                            buttons.addEventListener('click', (event) => {
          
                              const id = buttons.getAttribute('data-id');
                              const title = buttons.getAttribute('data-title');
                              const price = buttons.getAttribute('data-price');
                              const image = buttons.getAttribute('data-image');
          
                              let basket = JSON.parse(localStorage.getItem('basket'));
                              let detailData = JSON.parse(localStorage.getItem('detailData'));
                              let detailCategoryData = JSON.parse(localStorage.getItem('detailCategoryData'));
          
                              if (!basket) {
          
                                localStorage.setItem('basket', JSON.stringify([]));
          
          
                              }
                              if (!detailData) {
                                localStorage.setItem('detailData', JSON.stringify([]))
                              }
                              if (!detailCategoryData) {
                                localStorage.setItem('detailCategoryData', JSON.stringify([]))
                              }
                              ;
          
          
          
                              const btnCardButtons = document.querySelectorAll('.btn-card');
                              const btnDetailButtons = document.querySelectorAll('.btn-detail');
          
                              const detail = document.querySelector('.details')
                              const card = document.querySelectorAll('.card-img');
                              card.forEach(button => {
          
                                const productId = button.getAttribute('data-product');
                                const categoryId = button.getAttribute('data-categoryId');
          
          
          
                                button.addEventListener('click', async (event) => {
          
                                  const categoryProduct = await filterCategoryProduct(categoryId);
                                  const product = await findProductData(productId);
          
          
                                  detailData.push(product);
                                  detailCategoryData.push(categoryProduct)
          
                                  localStorage.setItem('detailData', JSON.stringify(detailData));
                                  localStorage.setItem('basket', JSON.stringify(basket));
                                  localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
                                  window.location.href = 'detail.html'
          
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
          
          
                                buttons.addEventListener('click', (event) => {
          
                                  const id = buttons.getAttribute('data-id');
                                  const title = buttons.getAttribute('data-title');
                                  const price = buttons.getAttribute('data-price');
                                  const image = buttons.getAttribute('data-image');
          
                                  let basket = JSON.parse(localStorage.getItem('basket'));
                                  let _id = basket.find(item => item.id === id);
          
                                  if (_id === undefined) {
                                    let item = {
                                      id,
                                      count: 1,
                                      image,
                                      title,
                                      price
                                    };
                                    basket.push(item);
          
                                  } else {
                                    _id.count++;
                                  }
          
          
          
          
          
                                  localStorage.setItem('basket', JSON.stringify(basket));
                                  localStorage.setItem('detailData', JSON.stringify(detailData));
                                  localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
          
                                });
                              });
          
          
          
                            });
                          });
                        
          
          
                          dialogRemove.addEventListener("click", () => {
          
                            dialogContent.style.opacity = 0;
          
                          })
          
                        } else {
                          console.log("no product find ")
                        }
                      });
                    });
                    btnCardButtons.forEach((buttons) => {


                      buttons.addEventListener('click', (event) => {

                        const id = buttons.getAttribute('data-id');
                        const title = buttons.getAttribute('data-title');
                        const price = buttons.getAttribute('data-price');
                        const image = buttons.getAttribute('data-image');

                        let basket = JSON.parse(localStorage.getItem('basket'));
                        let _id = basket.find(item => item.id === id);

                        if (_id === undefined) {
                          let item = {
                            id,
                            count: 1,
                            image,
                            title,
                            price
                          };
                          basket.push(item);

                        } else {
                          _id.count++;
                        }





                        localStorage.setItem('basket', JSON.stringify(basket));
                        localStorage.setItem('detailData', JSON.stringify(detailData));
                        localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));

                      });
                    });



                  });
                });
              


                dialogRemove.addEventListener("click", () => {

                  dialogContent.style.opacity = 0;

                })

              } else {
                console.log("no product find ")
              }
            });
          });
          btnCardButtons.forEach((buttons) => {


            buttons.addEventListener('click', (event) => {

              const id = buttons.getAttribute('data-id');
              const title = buttons.getAttribute('data-title');
              const price = buttons.getAttribute('data-price');
              const image = buttons.getAttribute('data-image');

              let basket = JSON.parse(localStorage.getItem('basket'));
              let detailData = JSON.parse(localStorage.getItem('detailData'));
              let detailCategoryData = JSON.parse(localStorage.getItem('detailCategoryData'));

              if (!basket) {

                localStorage.setItem('basket', JSON.stringify([]));


              }
              if (!detailData) {
                localStorage.setItem('detailData', JSON.stringify([]))
              }
              if (!detailCategoryData) {
                localStorage.setItem('detailCategoryData', JSON.stringify([]))
              }
              ;



              const btnCardButtons = document.querySelectorAll('.btn-card');
              const btnDetailButtons = document.querySelectorAll('.btn-detail');

              const detail = document.querySelector('.details')
              const card = document.querySelectorAll('.card-img');
              card.forEach(button => {

                const productId = button.getAttribute('data-product');
                const categoryId = button.getAttribute('data-categoryId');



                button.addEventListener('click', async (event) => {

                  const categoryProduct = await filterCategoryProduct(categoryId);
                  const product = await findProductData(productId);


                  detailData.push(product);
                  detailCategoryData.push(categoryProduct)

                  localStorage.setItem('detailData', JSON.stringify(detailData));
                  localStorage.setItem('basket', JSON.stringify(basket));
                  localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
                  window.location.href = 'detail.html'

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
                    <div class="dialogs"   >
                    <p class="quantity-dialogs-title">Quantity</p>
                        <div class="quantity-button" >
                         <button  type='button'  id="min">  <i class="fa-solid fa-caret-left"></i></button>
                         <button type='button'   id="max">  <i class="fa-solid fa-caret-right"></i></button>
                    
                    <input type="number" minlength="0"  id="quantityValue"   data-quantity="element"  />
                        </div>
                    </div>
                     <button class="btn-add"  data-productId="${element.id}" data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}">Add TO Cart</button>
                  </div>
                </div>
            </div>
                `
                    let caretRight = document.querySelectorAll('#max');
                    let caretLeft = document.querySelectorAll('#min');
                    let quantityValue = document.querySelector('#quantityValue');
                    const dialogRemove = document.querySelector('.dialog-remove');
                    let basket = JSON.parse(localStorage.getItem('basket'));
                    if (!basket) {
    
                      localStorage.setItem('basket', JSON.stringify([]));
    
    
                    }
                    const btnAddButtons= document.querySelector('.btn-add');
                    caretLeft.forEach(button => {
                      button.addEventListener('click', event => {
    
                        quantityValue.value = +quantityValue.value - 1;
                        if (quantityValue.value == 0 || quantityValue.value < 0)
                          quantityValue.value = 0;
    
                      });
                    });
    
                    caretRight.forEach(button => {
                      button.addEventListener('click', event => {
    
                        quantityValue.value = +quantityValue.value + 1;
                      });
                    });
                    console.log(quantityValue.value)
    
    
                     
                        const id = btnAddButtons.getAttribute('data-productId');
                        const title = btnAddButtons.getAttribute('data-title');
                        const image = btnAddButtons.getAttribute('data-image');
                        const price = btnAddButtons.getAttribute('data-price');
                        
                        btnAddButtons.addEventListener("click" ,(event)=>{
                          let _id = basket.find(item => item.id === id);
    
                      if (_id === undefined) {
                       
                          let item = {
                            productId,
                            count: quantityValue.value,
                            image,
                            title,
                            price
                          };
                        
                          basket.push(item);
                       
                      
                      }
                    });
                     
    
    
    
                      localStorage.setItem('basket', JSON.stringify(basket));
                      
                    
                      
                    
                    btnCardButtons.forEach((buttons) => {
    
    
                      buttons.addEventListener('click', (event) => {
    
                        const id = buttons.getAttribute('data-id');
                        const title = buttons.getAttribute('data-title');
                        const price = buttons.getAttribute('data-price');
                        const image = buttons.getAttribute('data-image');
    
                        let basket = JSON.parse(localStorage.getItem('basket'));
                        let detailData = JSON.parse(localStorage.getItem('detailData'));
                        let detailCategoryData = JSON.parse(localStorage.getItem('detailCategoryData'));
    
                        if (!basket) {
    
                          localStorage.setItem('basket', JSON.stringify([]));
    
    
                        }
                        if (!detailData) {
                          localStorage.setItem('detailData', JSON.stringify([]))
                        }
                        if (!detailCategoryData) {
                          localStorage.setItem('detailCategoryData', JSON.stringify([]))
                        }
                        ;
    
    
    
                        const btnCardButtons = document.querySelectorAll('.btn-card');
                        const btnDetailButtons = document.querySelectorAll('.btn-detail');
    
                        const detail = document.querySelector('.details')
                        const card = document.querySelectorAll('.card-img');
                        card.forEach(button => {
    
                          const productId = button.getAttribute('data-product');
                          const categoryId = button.getAttribute('data-categoryId');
    
    
    
                          button.addEventListener('click', async (event) => {
    
                            const categoryProduct = await filterCategoryProduct(categoryId);
                            const product = await findProductData(productId);
    
    
                            detailData.push(product);
                            detailCategoryData.push(categoryProduct)
    
                            localStorage.setItem('detailData', JSON.stringify(detailData));
                            localStorage.setItem('basket', JSON.stringify(basket));
                            localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
                            window.location.href = 'detail.html'
    
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
    
    
                          buttons.addEventListener('click', (event) => {
    
                            const id = buttons.getAttribute('data-id');
                            const title = buttons.getAttribute('data-title');
                            const price = buttons.getAttribute('data-price');
                            const image = buttons.getAttribute('data-image');
    
                            let basket = JSON.parse(localStorage.getItem('basket'));
                            let _id = basket.find(item => item.id === id);
    
                            if (_id === undefined) {
                              let item = {
                                id,
                                count: 1,
                                image,
                                title,
                                price
                              };
                              basket.push(item);
    
                            } else {
                              _id.count++;
                            }
    
    
    
    
    
                            localStorage.setItem('basket', JSON.stringify(basket));
                            localStorage.setItem('detailData', JSON.stringify(detailData));
                            localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
    
                          });
                        });
    
    
    
                      });
                    });
                  
    
    
                    dialogRemove.addEventListener("click", () => {
    
                      dialogContent.style.opacity = 0;
    
                    })
    
                  } else {
                    console.log("no product find ")
                  }
                });
              });
              btnCardButtons.forEach((buttons) => {


                buttons.addEventListener('click', (event) => {

                  const id = buttons.getAttribute('data-id');
                  const title = buttons.getAttribute('data-title');
                  const price = buttons.getAttribute('data-price');
                  const image = buttons.getAttribute('data-image');

                  let basket = JSON.parse(localStorage.getItem('basket'));
                  let _id = basket.find(item => item.id === id);

                  if (_id === undefined) {
                    let item = {
                      id,
                      count: 1,
                      image,
                      title,
                      price
                    };
                    basket.push(item);

                  } else {
                    _id.count++;
                  }





                  localStorage.setItem('basket', JSON.stringify(basket));
                  localStorage.setItem('detailData', JSON.stringify(detailData));
                  localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));

                });
              });



            });
          });
          const newProductElement = document.querySelector(".new");

          // Check if the element exists before manipulating its classList
          if (newProductElement) {
            if (element.isNewProduct.value == true) {
              newProductElement.classList.add("active");
            } else {
              newProductElement.classList.remove("active");
            }
          }
        });



      } else {
        console.log('No products found in the data.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  const productLength = () => {


    productLeng.addEventListener("click", async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data && data.products) {


          productCard.innerHTML = ' '
          data.products.forEach(element => {



            productCard.innerHTML += `
      
            <div class="card"  data-categoryId="${element.categoryId}">
             
              <span class="new" data-new="${element.isNewProduct}">New</span>
              <a  class="card-img" data-product="${element.id}"  data-categoryId="${element.categoryId}">
              <img  src="${element.productImage}" alt="" />
              </a>
              <div class="card-body">
               <h2 class="card-title">${element.productName}</h2>
              
              </div>
  
              <div class="card-price">
              <a  class="btn-card"  data-id='${element.id}' data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}" >AddToCart</a>
               <p class="price-title">$ ${element.price} </p>
              </div>
                 <button type="submit" class="btn-detail"  data-product="${element.id}">Quick Look <span><i class="fa-regular fa-heart"></i></span></button>
            </div>
          `;


            let basket = JSON.parse(localStorage.getItem('basket'));
            let detailData = JSON.parse(localStorage.getItem('detailData'));
            let detailCategoryData = JSON.parse(localStorage.getItem('detailCategoryData'));

            if (!basket) {

              localStorage.setItem('basket', JSON.stringify([]));


            }
            if (!detailData) {
              localStorage.setItem('detailData', JSON.stringify([]))
            }
            if (!detailCategoryData) {
              localStorage.setItem('detailCategoryData', JSON.stringify([]))
            }

            ;



            const btnCardButtons = document.querySelectorAll('.btn-card');
            const btnDetailButtons = document.querySelectorAll('.btn-detail');

            const detail = document.querySelector('.details')
            const card = document.querySelectorAll('.card-img');
            card.forEach(button => {

              const productId = button.getAttribute('data-product');
              const categoryId = button.getAttribute('data-categoryId');



              button.addEventListener('click', async (event) => {

                const categoryProduct = await filterCategoryProduct(categoryId);
                const product = await findProductData(productId);


                detailData.push(product);
                detailCategoryData.push(categoryProduct)

                localStorage.setItem('detailData', JSON.stringify(detailData));
                localStorage.setItem('basket', JSON.stringify(basket));
                localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
                window.location.href = 'detail.html'

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
                  <div class="dialogs"   >
                  <p class="quantity-dialogs-title">Quantity</p>
                      <div class="quantity-button" >
                       <button  type='button'  id="min">  <i class="fa-solid fa-caret-left"></i></button>
                       <button type='button'   id="max">  <i class="fa-solid fa-caret-right"></i></button>
                  
                  <input type="number" minlength="0"  id="quantityValue"   data-quantity="element"  />
                      </div>
                  </div>
                   <button class="btn-add"  data-productId="${element.id}" data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}">Add TO Cart</button>
                </div>
              </div>
          </div>
              `
                  let caretRight = document.querySelectorAll('#max');
                  let caretLeft = document.querySelectorAll('#min');
                  let quantityValue = document.querySelector('#quantityValue');
                  const dialogRemove = document.querySelector('.dialog-remove');
                  let basket = JSON.parse(localStorage.getItem('basket'));
                  if (!basket) {
  
                    localStorage.setItem('basket', JSON.stringify([]));
  
  
                  }
                  const btnAddButtons= document.querySelector('.btn-add');
                  caretLeft.forEach(button => {
                    button.addEventListener('click', event => {
  
                      quantityValue.value = +quantityValue.value - 1;
                      if (quantityValue.value == 0 || quantityValue.value < 0)
                        quantityValue.value = 0;
  
                    });
                  });
  
                  caretRight.forEach(button => {
                    button.addEventListener('click', event => {
  
                      quantityValue.value = +quantityValue.value + 1;
                    });
                  });
                  console.log(quantityValue.value)
  
  
                   
                      const productId = btnAddButtons.getAttribute('data-productId');
                      const title = btnAddButtons.getAttribute('data-title');
                      const image = btnAddButtons.getAttribute('data-image');
                      const price = btnAddButtons.getAttribute('data-price');
                   
                      btnAddButtons.addEventListener("click" ,(event)=>{
                        let _id = basket.find(item => item.id === id);
  
                    if (_id === undefined) {
                     
                        let item = {
                          productId,
                          count: quantityValue.value,
                          image,
                          title,
                          price
                        };
                      
                        basket.push(item);
                     
                    
                    }
                  });
                   
  
  
  
                    localStorage.setItem('basket', JSON.stringify(basket));
                    
                
                    
                  
                  btnCardButtons.forEach((buttons) => {
  
  
                    buttons.addEventListener('click', (event) => {
  
                      const id = buttons.getAttribute('data-id');
                      const title = buttons.getAttribute('data-title');
                      const price = buttons.getAttribute('data-price');
                      const image = buttons.getAttribute('data-image');
  
                      let basket = JSON.parse(localStorage.getItem('basket'));
                      let detailData = JSON.parse(localStorage.getItem('detailData'));
                      let detailCategoryData = JSON.parse(localStorage.getItem('detailCategoryData'));
  
                      if (!basket) {
  
                        localStorage.setItem('basket', JSON.stringify([]));
  
  
                      }
                      if (!detailData) {
                        localStorage.setItem('detailData', JSON.stringify([]))
                      }
                      if (!detailCategoryData) {
                        localStorage.setItem('detailCategoryData', JSON.stringify([]))
                      }
                      ;
  
  
  
                      const btnCardButtons = document.querySelectorAll('.btn-card');
                      const btnDetailButtons = document.querySelectorAll('.btn-detail');
  
                      const detail = document.querySelector('.details')
                      const card = document.querySelectorAll('.card-img');
                      card.forEach(button => {
  
                        const productId = button.getAttribute('data-product');
                        const categoryId = button.getAttribute('data-categoryId');
  
  
  
                        button.addEventListener('click', async (event) => {
  
                          const categoryProduct = await filterCategoryProduct(categoryId);
                          const product = await findProductData(productId);
  
  
                          detailData.push(product);
                          detailCategoryData.push(categoryProduct)
  
                          localStorage.setItem('detailData', JSON.stringify(detailData));
                          localStorage.setItem('basket', JSON.stringify(basket));
                          localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
                          window.location.href = 'detail.html'
  
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
  
  
                        buttons.addEventListener('click', (event) => {
  
                          const id = buttons.getAttribute('data-id');
                          const title = buttons.getAttribute('data-title');
                          const price = buttons.getAttribute('data-price');
                          const image = buttons.getAttribute('data-image');
  
                          let basket = JSON.parse(localStorage.getItem('basket'));
                          let _id = basket.find(item => item.id === id);
  
                          if (_id === undefined) {
                            let item = {
                              id,
                              count: 1,
                              image,
                              title,
                              price
                            };
                            basket.push(item);
  
                          } else {
                            _id.count++;
                          }
  
  
  
  
  
                          localStorage.setItem('basket', JSON.stringify(basket));
                          localStorage.setItem('detailData', JSON.stringify(detailData));
                          localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
  
                        });
                      });
  
  
  
                    });
                  });
                
  
  
                  dialogRemove.addEventListener("click", () => {
  
                    dialogContent.style.opacity = 0;
  
                  })
  
                } else {
                  console.log("no product find ")
                }
              });
            });
            btnCardButtons.forEach((buttons) => {


              buttons.addEventListener('click', (event) => {

                const id = buttons.getAttribute('data-id');
                const title = buttons.getAttribute('data-title');
                const price = buttons.getAttribute('data-price');
                const image = buttons.getAttribute('data-image');

                let basket = JSON.parse(localStorage.getItem('basket'));
                let _id = basket.find(item => item.id === id);

                if (_id === undefined) {
                  let item = {
                    id,
                    count: 1,
                    image,
                    title,
                    price
                  };
                  basket.push(item);

                } else {
                  _id.count++;
                }





                localStorage.setItem('basket', JSON.stringify(basket));
                localStorage.setItem('detailData', JSON.stringify(detailData));
                localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));


              });
            });



            const newProductElement = document.querySelector(".new");

            // Check if the element exists before manipulating its classList
            if (newProductElement) {
              if (element.isNewProduct.value == true) {
                newProductElement.classList.add("active");
              } else {
                newProductElement.classList.remove("active");
              }
            }
          });

        } else {
          console.log('No products found in the data.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })
  }
  const locationDetailsProduct = () => {
    const detail = document.querySelector('.details')
    const descriotitle = document.querySelector('.descrio-title');
    const rowRelaviews = document.querySelector('.row-relaviews');
    let detailData = JSON.parse(localStorage.getItem("detailData"))

    setTimeout(() => {
      localStorage.removeItem('detailCategoryData')
      localStorage.removeItem('detailData')
    }, 4500)

    let detailCategoryData = JSON.parse(localStorage.getItem("detailCategoryData"));


    if (detail) {
      detailData.forEach((element) => {
        console.log(element);

        detail.innerHTML = `
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
                      <h1 class="detail-title">${element.productName}</h1>
                      <p class="detail-price"> $ ${element.price}</p>
    
                      <div class="detail-body">
                          <p class="detail-description">${element.description.substring(0, 160)}</p>
    
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

        descriotitle.innerHTML = `${element.description}`

      })

      detailCategoryData.forEach((elements) => {
        elements.forEach((element) => {
          console.log(element); // Log the element for inspection

          rowRelaviews.innerHTML += `
            <div class="card" data-categoryId="${element.categoryId}">
              <span class="new" data-new="${element.isNewProduct}">New</span>
              <a class="card-img" data-product="${element.id}" data-categoryId="${element.categoryId}">
                <img src="${element.productImage}" alt="" />
              </a>
              <div class="card-body">
                <h2 class="card-title">${element.productName}</h2>
              </div>
              <div class="card-price">
                <a class="btn-card" data-id="${element.id}" data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}">AddToCart</a>
                <p class="price-title">$ ${element.price}</p>
              </div>
              <button type="submit" class="btn-detail" data-product="${element.id}">Quick Look <span><i class="fa-regular fa-heart"></i></span></button>
            </div>
          `;
          let basket = JSON.parse(localStorage.getItem('basket'));
          let detailData = JSON.parse(localStorage.getItem('detailData'));
          let detailCategoryData = JSON.parse(localStorage.getItem('detailCategoryData'));

          if (!basket) {

            localStorage.setItem('basket', JSON.stringify([]));


          }
          if (!detailData) {
            localStorage.setItem('detailData', JSON.stringify([]))
          }
          if (!detailCategoryData) {
            localStorage.setItem('detailCategoryData', JSON.stringify([]))
          }

          ;



          const btnCardButtons = document.querySelectorAll('.btn-card');
          const btnDetailButtons = document.querySelectorAll('.btn-detail');

          const detail = document.querySelector('.details')
          const card = document.querySelectorAll('.card-img');
          card.forEach(button => {

            const productId = button.getAttribute('data-product');
            const categoryId = button.getAttribute('data-categoryId');



            button.addEventListener('click', async (event) => {

              const categoryProduct = await filterCategoryProduct(categoryId);
              const product = await findProductData(productId);


              detailData.push(product);
              detailCategoryData.push(categoryProduct)

              localStorage.setItem('detailData', JSON.stringify(detailData));
              localStorage.setItem('basket', JSON.stringify(basket));
              localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
              window.location.href = 'detail.html'

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
                <div class="dialogs"   >
                <p class="quantity-dialogs-title">Quantity</p>
                    <div class="quantity-button" >
                     <button  type='button'  id="min">  <i class="fa-solid fa-caret-left"></i></button>
                     <button type='button'   id="max">  <i class="fa-solid fa-caret-right"></i></button>
                
                <input type="number" minlength="0"  id="quantityValue"   data-quantity="element"  />
                    </div>
                </div>
                 <button class="btn-add"  data-productId="${element.id}" data-title="${element.productName}" data-price="${element.price}" data-image="${element.productImage}">Add TO Cart</button>
              </div>
            </div>
        </div>
            `
                let caretRight = document.querySelectorAll('#max');
                let caretLeft = document.querySelectorAll('#min');
                let quantityValue = document.querySelector('#quantityValue');
                const dialogRemove = document.querySelector('.dialog-remove');
                let basket = JSON.parse(localStorage.getItem('basket'));
                if (!basket) {

                  localStorage.setItem('basket', JSON.stringify([]));


                }
                const btnAddButtons= document.querySelector('.btn-add');
                caretLeft.forEach(button => {
                  button.addEventListener('click', event => {

                    quantityValue.value = +quantityValue.value - 1;
                    if (quantityValue.value == 0 || quantityValue.value < 0)
                      quantityValue.value = 0;

                  });
                });

                caretRight.forEach(button => {
                  button.addEventListener('click', event => {

                    quantityValue.value = +quantityValue.value + 1;
                  });
                });
                console.log(quantityValue.value)


                 
                    const id= btnAddButtons.getAttribute('data-productId');
                    const title = btnAddButtons.getAttribute('data-title');
                    const image = btnAddButtons.getAttribute('data-image');
                    const price = btnAddButtons.getAttribute('data-price');
                   
                    btnAddButtons.addEventListener("click" ,(event)=>{
                      let _id = basket.find(item => item.id === id);

                  if (_id === undefined) {
                   
                      let item = {
                        productId,
                        count: quantityValue.value,
                        image,
                        title,
                        price
                      };
                    
                      basket.push(item);
                   
                  
                  }else{
                    id.count
                  }
                });
                 



                  localStorage.setItem('basket', JSON.stringify(basket));
                  
                
                  
                
                btnCardButtons.forEach((buttons) => {


                  buttons.addEventListener('click', (event) => {

                    const id = buttons.getAttribute('data-id');
                    const title = buttons.getAttribute('data-title');
                    const price = buttons.getAttribute('data-price');
                    const image = buttons.getAttribute('data-image');

                    let basket = JSON.parse(localStorage.getItem('basket'));
                    let detailData = JSON.parse(localStorage.getItem('detailData'));
                    let detailCategoryData = JSON.parse(localStorage.getItem('detailCategoryData'));

                    if (!basket) {

                      localStorage.setItem('basket', JSON.stringify([]));


                    }
                    if (!detailData) {
                      localStorage.setItem('detailData', JSON.stringify([]))
                    }
                    if (!detailCategoryData) {
                      localStorage.setItem('detailCategoryData', JSON.stringify([]))
                    }
                    ;



                    const btnCardButtons = document.querySelectorAll('.btn-card');
                    const btnDetailButtons = document.querySelectorAll('.btn-detail');

                    const detail = document.querySelector('.details')
                    const card = document.querySelectorAll('.card-img');
                    card.forEach(button => {

                      const productId = button.getAttribute('data-product');
                      const categoryId = button.getAttribute('data-categoryId');



                      button.addEventListener('click', async (event) => {

                        const categoryProduct = await filterCategoryProduct(categoryId);
                        const product = await findProductData(productId);


                        detailData.push(product);
                        detailCategoryData.push(categoryProduct)

                        localStorage.setItem('detailData', JSON.stringify(detailData));
                        localStorage.setItem('basket', JSON.stringify(basket));
                        localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));
                        window.location.href = 'detail.html'

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


                      buttons.addEventListener('click', (event) => {

                        const id = buttons.getAttribute('data-id');
                        const title = buttons.getAttribute('data-title');
                        const price = buttons.getAttribute('data-price');
                        const image = buttons.getAttribute('data-image');

                        let basket = JSON.parse(localStorage.getItem('basket'));
                        let _id = basket.find(item => item.id === id);

                        if (_id === undefined) {
                          let item = {
                            id,
                            count: 1,
                            image,
                            title,
                            price
                          };
                          basket.push(item);

                        } else {
                          _id.count++;
                        }





                        localStorage.setItem('basket', JSON.stringify(basket));
                        localStorage.setItem('detailData', JSON.stringify(detailData));
                        localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));

                      });
                    });



                  });
                });
              


                dialogRemove.addEventListener("click", () => {

                  dialogContent.style.opacity = 0;

                })

              } else {
                console.log("no product find ")
              }
            });
          });
          btnCardButtons.forEach((buttons) => {


            buttons.addEventListener('click', (event) => {

              const id = buttons.getAttribute('data-id');
              const title = buttons.getAttribute('data-title');
              const price = buttons.getAttribute('data-price');
              const image = buttons.getAttribute('data-image');

              let basket = JSON.parse(localStorage.getItem('basket'));
              let _id = basket.find(item => item.id === id);

              if (_id === undefined) {
                let item = {
                  id,
                  count: 1,
                  image,
                  title,
                  price
                };
                basket.push(item);

              } else {
                _id.count++;
              }





              localStorage.setItem('basket', JSON.stringify(basket));
              localStorage.setItem('detailData', JSON.stringify(detailData));
              localStorage.setItem('detailCategoryData', JSON.stringify(detailCategoryData));

            });
          });

        });
      });


    } else {
      console.log("not found")
    }




  }

  locationDetailsProduct();
  fetchCategoryData();
  productLength();
  fetchProductData();
  fetchData();

});