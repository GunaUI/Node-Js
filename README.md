# Node-Js

## File Upload and Downloading

### Adding a File Picker to the Frontend

* Let us change the image URL textbox to file picker.

```js
<div class="form-control">
    <label for="imageUrl">Image URL</label>
    <input type="file" name="image" id="image">
</div>
```
### Handling Multipart Form Data

* Now we trying to log this form data in controller function we are not getting anything why ??

* we learned this a little bit earlier in this course, for extracting the content of our incoming requests, we set up a middleware in app.js, we're using a special middleware, this body parser middleware and this middleware uses or exposes a couple of different parsers and we're using the url encoded parser,
now url encoded data is basically text data.

* So if a form is submitted without a file, so just with text fields no matter if that text field then stores a number, a url or plaintext but it's all encoded in text when it is submitted. This format is then called url encoded

* If you inspect developer tool and check in network header you could find "Content-Type: application/x-www-form-urlencoded" , that is why we are getting empty data in add product console.

* we need to parse our data differently and the body parser that we're using here does not give us any parser, it does not include any parser that could handle file data as well. We need a new package for that,

```js
npm install --save multer
```
* Multer is another third party package that parses incoming requests but this package parses incoming requests for files, so it is able to handle file requests as well or requests with mixed data, with text and file data.

* We'll still keep body parser because we still have like for example, our sign up form where we only submit url encoded data but now we'll have to use a different encoding and that starts with our form

```js
// we need to add enctype as multipart/form-data
// Application xwww form url encoded as the default but now we'll switch to multipart form data
<form class="product-form" action="/admin/<% if (editing || hasError) { %>edit-product<% } else { %>add-product<% } %>" method="POST" enctype="multipart/form-data">
```
* which is simply the content type telling the server that this submission, that this request will not contain plaintext but will contain mixed data, text and binary data 

* multer, the package we just installed will be looking for incoming requests with this type of data (enctype="multipart/form-data") and will then be able to parse both the text and our file

### Handling File Uploads with Multer

* multer is some middleware which we execute on every incoming request and it then simply has a look at that request, sees if it's multipart form data and tries to extract files if that is the case. So it is some extra middleware we add and therefore we can import it here in our app.js file.

```js
const multer = require('multer');
// single('image') -> image(name) should match with file element name
// since we are going to upload single image we are using single
app.use(multer().single('image'));
```
* In controller add product action we need to fetch file with " const imageUrl = req.file"

```js
// imageUrl console response 

{ fieldname: 'image',
  originalname: '3 maxi (2).JPG',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  buffer:
   <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff e1 26 24 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 0e 01 0f 00 02 00 00 00 12 00 00 ... >,
  size: 450630 }
```
* this is the result of the streamed data, the file basically was sent to our server as a stream or was
handled as a stream to handle it efficiently if it was bigger and then this is the collected data in a
buffer which as we learned is like a bus stop, it gives you a way of working with the stream data, here in this case it's the combined stream and data and we could indeed work with that buffer to turn it into a file.

* We need to do some configuration in multer setup on app.js

* One option is specify file destination

```js
const multer = require('multer');
// this dest will create images folder and store this image in this destination path 
app.use(multer({dest: 'images'}).single('image'));

// Console output of image element 

{ fieldname: 'image',
  originalname: '3 maxi (2).JPG',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'images',
  filename: 'c2e023eb239dab8b57084abe838a3dec',
  path: 'images/c2e023eb239dab8b57084abe838a3dec',
  size: 450630 }
```
* if we add .png in the end of the file we could see our uploaded file.

### Configuring Multer to Adjust Filename & Filepath

* Now all we have to do is we have to ensure that our data gets stored correctly and for that we specify the destination folder but we can do more,

* we can set the storage key here which gives us way more configuration options than just the dest option.

```js

const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      // call back firt argument null is error message to multer and second argument is images folder
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
      // call back firt argument null is error message to multer and second argument is file name
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});
// we just need to inform multer that we want to use this storage engine and we do this by setting this as a value for the storage key in the multer options.

app.use(multer({ storage: fileStorage }).single('image'));

```
* Disk storage is in the end a storage engine which you can use with multer
and there you can pass a javascript object to configure that.

* It takes two keys, it takes the destination and it takes the file name.

* These are two functions which multer will then call for an incoming file
and these functions then control how that file is handled regarding the place where you store it and regarding the naming

* call the callback with null as the first argument, that would be an error message you throw to inform multer that something is wrong with the incoming file 

* if that is null, you tell multer that it's OK to store it and then the second argument is the place where you do want to store it, like that images folder.

* Now file name also is a function, so it's also an arrow function where we also received the request object, some data about the file and a callback which we have to call to let multer know how to name it and there, we can also call this with null to still inform multer, ok we're fine store it please

* and then the second argument is the file name which we want to use 

### Filtering Files by Mimetype

* now we can also add a filter to multer to only allow certain kinds of files

```js

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'|| file.mimetype === 'image/png'){
    // if we accepted the file type
    cb(null, true);
  }else{
    // if we didn't accept this file type
    cb(null, false);
  }
}

app.use(multer({ storage: fileStorage, fileFilter : fileFilter }).single('image'));
```

### Storing File Data in the Database

* reg.file here will be an object of this format with information about the file and where it was stored, so where the physical file can be found and now I want to save that.

* We already storing our files in folders. we should not store data like this in the database, files should not be stored in a database, they are too big,it's too inefficient to store them in a database and query them from there.

* you need to store the path to the file

```js
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file
  const price = req.body.price;
  const description = req.body.description;
    // if we didn't get image data we should redirect.
  if(!image){
    return res.status(422).render('/admin/add-product', {
      path: '/admin/add-product',
      pageTitle: 'Products',
      editing: false,
      hasError: true,
      errorMessage: 'Attached file is not a image!',
      product: {title: title, price: price, description: description },
      validationErrors : [] // i won't mark anything as red
    });
  }
  // ***** I will use my image data which is that file object we get from multer and there we have information like the file path and it's this path that is interesting to me of course because this is the path that a file on my operating system,
  const imageUrl = image.path

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('/admin/add-product', {
            path: '/admin/add-product',
            pageTitle: 'Products',
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {title: title,  price: price, description: description },
            validationErrors : errors.array()
        });
    }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);

    });
};
```
* Now we upload and then updated the URL in Db, but still image is not visible in product .now that we are able to store data,
let's also learn how we can serve data

* Before that let us fix product image edit issue, in product update if the new upload not happended we need to retain the old image , its not mandatory to update image for every update click.

```js
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.log(errors.array());
      // we shoukd return this otherwise it will continue rest of the code 
      return res.status(422).render('/admin/edit-product', {
          path: '/admin/edit-product',
          pageTitle: 'Edit Product',
          editing: true,
          hasError: true,
          errorMessage: errors.array()[0].msg,
          product: {title: updatedTitle, price: updatedPrice, description: updatedDesc, _id : prodId },
          validationErrors : errors.array()
      });
  }

  Product.findById(prodId)
    .then(product => {
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/')
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      // if we are updating with new image at that time only we will update the new updated URL in Db.
      // if no image don't update
      if(image){
        const updatedImageUrl = image.path
        product.imageUrl = updatedImageUrl;
      }
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      }).catch(err => console.log(err));
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
```

### Serving Images Statically

* We have multiple options to serve files lets see one by one.

* Option 1 : files that are publicly available to everyone, like our product images is that we simply serve our images folder in a static way.

* What does this mean? in our app.js we already are statically serving a folder, we are serving the public folder with the express static middleware.

* we can serve more than one folder statically

* statically serving a folder simply means that requests to files in that folder will be handled automatically and the files will be returned,so all the heavy lifting is done behind the scenes by express .

```js
app.use(express.static(path.join(__dirname, 'images')));
```
* With the above static file change still our product image not visible why ?? because our app try to find image in "http://localhost:8000/admin/images/2019-12-13T06:57:59.112Z-0.jpeg"

* since we are in admin router its trying to find product image in  "admin/images/filename....."

* the solution for that is pretty straightforward. In our view products.ejs where I do show my image, we simply need to add a slash at the beginning which will turn this into an absolute path, so it will not append it to the current path but rather create a new path with only our domain

```js
<img src="/<%= product.imageUrl %>" alt="<%= product.title %>">
```

* The alternative would be to store that path in a database with a slash at the beginning of course

* Still our image not visible!. The reason for that is that the path now is correct but my images here in the images folder are served incorrectly 

* image visble in http://localhost:8000/2019-12-13T06:57:59.112Z-0.jpeg%22 but not in http://localhost:8000/images/2019-12-13T06:57:59.112Z-0.jpeg%22

* the reason for that is that express assumes that the files in the images folder are served as if they were in the root folder

* Of course we want to keep them in the images folder and keep the path like this and for this, we can simply adjust our middleware here and say if we have a request that goes to /images, that starts with /images, then serve these files statically and now /images is the folder we assume for this static serving

```js
app.use("/images", express.static(path.join(__dirname, 'images')));
```
### Downloading Files with Authentication

* So serving images statically is fine but we don't want to serve only images or only public files, I want to serve an invoice and that invoice should only be available to me.

* Now for that, let's start with a dummy invoice and I'll create a new folder for that,I'll name it invoices inside data folder.

* Now lets add dummy pdf inside this invoices folder..

* Now obviously, we could make our invoices folder here statically accessible but that's not what I want to do.

* Now we need to add link to download this PDF in orders page

```js
<h1>Order - # <%= order._id %>   - <a href="/orders/<%= order._id %>">Invoice</a></h1>
```

* Now i want to click and download this invoice how can we do that ?? 

* Since I want to handle this privately, I need to set up my own route for working with invoices because that will then allow me to check for things like is the user authenticated and so on.

```js
// shop route 
// since isAuth this file only available if we are loggedin
router.get('/orders/:orderId', isAuth, shopController.downloadInvoice);
```

* Lets add controller action for this downloadInvoice

```js
const fs = require('fs');
const path = require('path');

exports.downloadInvoice = (req, res, next) => {
  // this we will fetch from URL , orderId  should match with routes optional key string orderId
  const orderId = req.params.orderId
  const invoiceName = 'invoice_' + orderId + '.pdf';
  const invoicePath = path.join('data', 'invoices', invoiceName);      
  fs.readFile(invoicePath, (err, data) => {
    if (err) {
      return next(err);
    }
    res.send(data);
  });
};
```
* we need file system package to access file ,don't need to install a package it's already included in node and the file system allows you to do things like read files 

* Path here should be constructed with the path core module so that it works on all operating systems.

* Now we have to update the download href value

```js
<a href="/orders/<%= order._id %>">Invoice</a>
```
* Now the file downloaded but still we can't find the file type as .pdf

### Setting File Type Headers

* Now we can improve the way we return this however, we can pass some extra information to the browser so that it uses a different file name and also with the right extension. For this we'll set some headers

```js
exports.downloadInvoice = (req, res, next) => {
  // this we will fetch from URL , orderId  should match with routes optional key string orderId
  const orderId = req.params.orderId
  const invoiceName = 'invoice_' + orderId + '.pdf';
  const invoicePath = path.join('data', 'invoices', invoiceName);      
  fs.readFile(invoicePath, (err, data) => {
    if (err) {
      return next(err);
    }
    // pdf content type. this allow pdf open in browser..
    res.setHeader('Content-Type', 'application/pdf');
    //this allows us to define how this content should be served to the client.
    // filename is filename we want to serve.
    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + invoiceName + '"'
    );
    res.send(data);
  });
};

```
* Inline means it will open file in same screen, instead if we add "attachment", this will allow pdf to download in folder.

### Restricting File Access

* We can add some extra check in our controller that only the user who created this order can access this files.

```js
exports.downloadInvoice = (req, res, next) => {
  // this we will fetch from URL , orderId  should match with routes optional key string orderId
  const orderId = req.params.orderId
  // here we confirming order
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      // here we confirming order user and login user are same.
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice_' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);      
      fs.readFile(invoicePath, (err, data) => {
        if (err) {
          return next(err);
        }
        // pdf content type. this allow pdf open in browser..
        res.setHeader('Content-Type', 'application/pdf');
        //this allows us to define how this content should be served to the client.
        // filename is filename we want to serve.
        res.setHeader(
          'Content-Disposition',
          'inline; filename="' + invoiceName + '"'
        );
        res.send(data);
      });
    })
    .catch(err => next(err));
};
```

### Streaming Data vs Preloading Data

* we can also improve the way we are serving that file because right now, I'm simply reading that file and once I read it, I return it. Now for small files this is probably fine

* But in case if the file content is huge node will first of all access that file, read the entire content into memory and then return it with the response.

* This means that for bigger files, this will take very long before a response is sent and your memory on the server might actually overflow at some point for many incoming requests because it has to read all the data into memory which of course is limited.

* So reading file data into memory to serve it as a response is not really a good practice, for tiny files it might be ok but for bigger files, it certainly is not

* instead you should be streaming your response data and that is what we will do now.


```js
exports.downloadInvoice = (req, res, next) => {
  // this we will fetch from URL , orderId  should match with routes optional key string orderId
  const orderId = req.params.orderId

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice_' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);      
      //now we have to read read stream and node will be able to use that to read in the file step by step in different chunks.
      const file = fs.createReadStream(invoicePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      // here pipe method to forward the data that is read in with that stream to our response
      file.pipe(res);

    })
    .catch(err => next(err));
};


```
* now we have to read read stream and node will be able to use that to read in the file step by step in different chunks.

* I will use that file read stream and call the pipe method to forward the data that is read in with that stream to our response because the response object is a writable stream actually and you can use readable streams to pipe their output into a writable stream,

* So we can pipe our readable stream, the file stream into the response and that means that the response will be streamed to the browser and will contain the data and the data will basically be downloaded by the browser step by step and for large files,

* this is a huge advantage because node never has to pre-load all the data into memory but just streams it to the client on the fly and the most it has to store is one chunk of data.

* the chunks are what we work with, the buffers basically gives us access to these chunks and here we don't wait for all the chunks to come together and concatenate them into one object, instead we forward them to the browser which then is also able to concatenate the incoming data pieces into the final file.

###  Using PDFKit for .pdf Generation

* We can create a pdf on the fly on the server,instead of serving that hardcoded pdf here, let me create it on the fly instead.

* I want to generate that file based on the real order data.

*  how can we create a pdf?

* We can use thirdparty pdf generator refer : https://pdfkit.org/

```js
npm install --save pdfkit
```

* In Invoice download controller action

```js
const PDFDocument = require('pdfkit');

exports.downloadInvoice = (req, res, next) => {
  // this we will fetch from URL , orderId  should match with routes optional key string orderId
  const orderId = req.params.orderId

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice_' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);      

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      //  we pipe this output into a writable file stream,
      // here we are passing invoicePath is the path where we want to write
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      // HTTP response with setHeader
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('-----------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              '$' +
              prod.product.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
      // here we are making sure we are done writing 
      pdfDoc.end();


    })
    .catch(err => next(err));
};
```

* This is how you can generate data on the fly and how you can then return it in a response and also save it in a file because that is important too. We do both at the same step and I believe its very interesting to see which power nodejs has and what you can do with it especially when also playing around with the features of writable and readable streams, like here where we are creating a pdf on the fly and we were streaming it both into a file and back to the client.

###  Deleting Files

* In case if we are updating product image or deleting a product we should delete the corresponding old product image in folder .

* Let us create a common helper file to delete/unlink the file from the path provided.

```js
const fs = require('fs');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    });
}

exports.deleteFile = deleteFile;
```
* Now we can use this helper function in our controller edit product action action

```js
const fileHelper = require('../util/file');

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.log(errors.array());
      // we shoukd return this otherwise it will continue rest of the code 
      return res.status(422).render('/admin/edit-product', {
          path: '/admin/edit-product',
          pageTitle: 'Edit Product',
          editing: true,
          hasError: true,
          errorMessage: errors.array()[0].msg,
          product: {title: updatedTitle, price: updatedPrice, description: updatedDesc, _id : prodId },
          validationErrors : errors.array()
      });
  }

  Product.findById(prodId)
    .then(product => {
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/')
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      // if we are updating with new image at that time only we will update the new updated URL in Db.
      // if no image don't update
      if(image){
        // here we are removing/unlink the old image from folder
        fileHelper.deleteFile(product.imageUrl);

        const updatedImageUrl = image.path
        product.imageUrl = updatedImageUrl;
      }
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      }).catch(err => console.log(err));
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
```

* Same logic we should do while we completely deleting a product

```js
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
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
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
```
### Useful resources:

* Multer Official Docs: https://github.com/expressjs/multer

* Streaming Files: https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93

* Generating PDFs with PDFKit: http://pdfkit.org/docs/getting_started.html

