# Node-Js

## Understanding Async Await in Node.js

### What is Async Await All About?

* Async and Await are  two key words which are part of the core javascript language. They're not an exclusive part of the node js runtime. They are also available in modern browsers or in Front-End projects.but you can use them in node js

* Async and Await allows you to write asynchronous requests

* So requests where you have some operation that takes a little while and comes back later in a synchronous way ,Only by the way it looks not by the way it behaves.

* how can you see or how can you identify asynchronous operations.

* Well for example when you're using. Promises Promises are a typical construct that help you deal with a synchronous code because promises were like that

* As we know if the db operation like countDocuments() might take some time by the time it will skip callback,and promises and then it will execute next set of code if any.

* We could add callback inside countDocuments but will looks more ugly and not readable..

### Transforming "Then Catch" to "Async Await"

```js
// first of all have to prepare and the async keyword in front of a function
exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  try {
      // await is similar like our old 'then' like structure
      // always keep in mind await just does some behind the scenes transformation of your code. It takes your code and adds then ofter it gets the result of that operation and then stores it in totalItems(const/let variable)
    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'Fetched posts successfully.',
      posts: posts,
      totalItems: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

```