# Node-Js

## Understanding-Async-Requests

* The request was always a request sent from our browser when we submitted a form or entered a url or clicked a link and the response always was either a redirect or a new html page.

### What are Async Requests?

* Now typically you send a request from your client to the server and you get back a response, but there are tasks where you don't want to reload the page just to for example delete an item and actually in modern web applications, the portion that happens behind the scenes grows. Since we can do a lot with javascript in the browser where we never need to fetch a new html page but where we constantly change the existing page as this is faster than loading a new one.

* The idea behind asynchronous requests is that you do send the request but that request typically
contains just some data in a special format named json and that data is sent to the server, to a certain url or a route accepted by that server, so that logic doesn't change. The server can do whatever it wants to do with that and then we return a response and that response is also returned
behind the scenes, so it's not a new html page that needs to be rendered, it's instead again just some data in that json format typically.

* And that is how client server can communicate through javascript, so through client side javascript and the server side logic without reloading or rebuilding the page, without exchanging a new html page. And that allows you to do some work behind the scenes without interrupting the user flow, without reloading the page.(Refer Async image)

### Adding Client Side JS Code

* when I would click delete, I would simply well delete that, send that request to the server
and get back a new version of that page essentially where this product is then missing

* it would be a great user experience if we would never have to leave that page, if we wouldn't reload that page but if we click delete, we send that information that we want to get rid of that item to the server behind the scenes, the server can then still do its thing and once we're done, the server will respond just with some json data, and once we get that response in our browser, we can delete this dom element, 

* Lets create a file say admin.js inside public/js

* include this file in your admin/product.ejs footer. we added this at the footer because by the time the entire templated loaded before this file loads.

* Lets add some logic to that file (public/js/admin.js)

*  before that want to react to a click on this delete button, this button should not be of type submit anymore, i should be of type button instead.Actually I will remove this entire form because this form was required for sending a request through the browser, sending a request with this xwww url form encoded data. Now I'll not do it like this anymore, I will get rid of that

```html
<div class="card__actions">
    <a href="/admin/edit-product/<%= product._id %>?edit=true" class="btn">Edit</a>
    <input type="hidden" value="<%= product._id %>" name="productId">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>"/>
    // this refer to the elemenet we click
    <button class="btn" onclick="deleteProduct(this)">Delete</button>
</div>
```
* I will listen to a click to that button and then I will gather the product ID and the csrf token manually through the help of my client side javascript.

```js
// public/js/admin.js
const deleteProduct = (btn) => {
    //parentNode refer here is div class="card__actions" 
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
};
```
* now with these two pieces of information, we can now send our asynchronous requests to the server

### Sending & Handling Background Requests

* now to continue, we need a route on the backend to which we can send our javascript request. For that let's go to the routes folder and there to admin.js.

* We can use existing route but now since we'll send the request directly through javascript, we can actually use a different http verb.

* Thus far we always use get and post because the browser natively supports these for the requests sent by the browser, by form submission and by clicking links, it only knows get and post

* When we send requests through javascript, so through browser side javascript, we have access to other http verbs too.

* One of them is delete and this is a http verb, so http method which makes a lot of sense for deleting. Now it's only a semantic thing,we could use post, you can in general use any http verb to do anything because you define with your server side logic.

* but it makes sense to try to be clear about your intention and there is a delete verb, we can now use it

```js
// routes/admin.js
router.delete('/product/:productId', isAuth, adminController.deleteProduct);
```
* Now we can add our logics in admin controller 

```js
exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      // here we are deleting the product image
      fileHelper.deleteFile(product.imageUrl);

      // here we are deleting the product form DB
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      // !!!!****** now we return json responses because we don't want to render a new page, we just want to return some data.
      res.status(200).json({message: "Success!"})
      // !!!!****** i will not redirect, just will update the response in current page
      // res.redirect('/admin/products');
    })
    .catch(err => {
      // !!!!****** now we return json responses because we don't want to render a new page, we just want to return some data.
      res.status(500).json({message: "Deleting Product Failure!"})
    });
};
```

* now we need to send the request there from inside our client side admin.js file, so in the public
folder

```js
const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    // Here we can use the fetch method which is a method supported by the browser for sending http requests and it's not just for fetching data as the name might suggest, it's also for sending data.

    // /admin beacuse we are using admin route with default /admin ..

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        // Well we can set headers and in the headers, we could encode

        // our csrf token because we still need to attach this to our request and right now we are not doing that.
        
        // We cannot send it in the request body because delete requests don't have a body
        
        // but the good thing is the csurf package which we are using on a server does not just look into request bodies,

        headers: {
            'csrf-token': csrf
        }
        })
        .then(result => {
            // here we returing result as json
            return result.json();
        })
        .then(data => {
            console.log(data);
            // here we are finding and remove article once backende removed here this code removes that article from the DOM
            productElement.parentNode.removeChild(productElement);
        })
        .catch(err => {
            console.log(err);
        });
};
```
* Here we can use the fetch method which is a method supported by the browser for sending http requests and it's not just for fetching data as the name might suggest, it's also for sending data.

*  Well we can set headers and in the headers, we could encode our csrf token because we still need to attach this to our request and right now we are not doing that.We cannot send it in the request body because delete requests don't have a body but the good thing is the csurf package which we are using on a server does not just look into request bodies,

* Now one important note by the way, I'm not sending any json data with my request here because it
is a delete request without a post body. If it were and that is something we will see in the rest API section, then I would have to parse json data in my backend

* because there right now and that's just an important note, in app.js, there right now we only have two parsers, one for url encoded data which we don't have when we send json data and one for multipart data which we also don't have there.

* We would have to add a new body parser that is able to handle json data and extract that from incoming requests. I don't add it here because we don't need it here

```js
// console.js
// I get a response with a status code of 200, with request body which is a readable stream,I showed you how to get to that request body
Response {type: "basic", url: "http://localhost:8000/admin/product/5df5ea21a2ee147b7f13f946", redirected: false, status: 200, ok: true, …}
body: ReadableStream
bodyUsed: false
headers: Headers {}
ok: true
redirected: false
status: 200
statusText: "OK"
type: "basic"
url: "http://localhost:8000/admin/product/5df5ea21a2ee147b7f13f946"
__proto__: Response
```
* Note: Here page didn't reloaded just the existing page updated.

* The important thing here is that you can send data to your backend with the help, with these asynchronous requests and how you can include data and how you can handle that on the backend.

### Useful resources:

* More on the fetch API: https://developers.google.com/web/updates/2015/03/introduction-to-fetch

* More on AJAX Requests: https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started