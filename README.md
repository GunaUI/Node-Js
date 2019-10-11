# Node-Js

## JS in a Nutshell

* Javascript is a weakly typed programming language, it's an object oriented programming language and it's very versatile

### what do you mean with that? 

* Weakly type :  means that we have no explicit type assignment, - javascript knows types like numbers or text which is called string or booleans which is true or false
but it doesn't force you to define which type you're using in a variable or in a function. you can also have a variable where you store a number which you then suddenly change to a
string.

* Since not have strict typing, it also can lead to errors,so it is just something you have to be aware of.

* object oriented :  means that data can be organized in logical objects , And one important concept here is that you have to be aware about the difference of primitive and reference types. Refer https://academind.com/learn/javascript/ (for reference vs premitive type) - https://www.youtube.com/watch?v=9ooYYRLdg_g


    * String is of primitive value : primitive value are copied by value, stored on stack memory (one over other - very easy to access)
    * Objects are reference type : it will change if the object change in between based on the refered object., stored on heap memory (little bit longer to access, it holds huge data, not short living as like stack, perfect for bigger amount of data and the data changes frequently)
        * Here in reference type variable :  (for eg employee) --> Pointer ---> Address of the object{} in the Heap.
        * If in case if we assign  employee object  to new object :  (employee1= employee)--> new pointer --> same address of the object{}  as first ponter did not new object.
            * here object is not a new copy but the pointer different point to the same object.

* versatility - outside of a browser set up  or also on a server. Can Perform broad varitey of tasks.

### Var, let and const keyword

* var - outdated syntax - function scoped
* let - is block scoped
* const - Never changing  variable

### Arrow function

* Why we should use Arrow function => Refer : https://www.youtube.com/watch?v=Pv9flm-80vM

### Array Map

* Array map will return new array with updated data not same as of old array.
* Refer other array inbuilt methods.

### Array/Object with const keyword can we push new value ??

* Yes we can !!, since in array/Object with const even after you push new value the corresponding pointers remains same only the pointers pointing the address changed. thats why const with refernce type we could change the value eventhough its const.

### Spread and Rest operator

* immutability : Let's say we want to implement a pattern where when we add a new hobby, we don't edit the original array but we create a new array with all the old values and the new value,this is actually a pretty common pattern called immutability
* The idea behind that is that we avoid errors because we always have this clear approach of copy then edit and don't edit existing objects which might lead to more unreadable code.

```js
hobbies = ["sports", "book reading"];
//Spread operator
const copiedArray = [...hobbies]
// same for objects
const copiedObj = {...hobbies}
```
* Rest operator looks just like spread operator but it bundles arguments and returns as array. it depends on the place where we use it in function argument rest operator in object it is spread operator.

```js
const toArray = (...args) => {
    return args;
}

console.log(toArray(1, 2, 3, 4))
// output [1,2,3,4]
```

### Destructuring

* we could destructure the object based on our need no need to accept the entire object and then process that 

```js
const person ={
    name : "Guna",
    age : 30,
    qualification : "Engineering in computer science"
}

const printName = ({ name })=>{
    console.log(name)
}

printName(person);

// same applies to variable also not only functions

const {name, age} = person

// Same for array also

hobbies = ["sports", "book reading"];
const [hobby1, hobby2] = hobbies
console.log(hobby1)
console.log(hobby2)
```

###  Async Code & Promises

```js
const fetchData = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Done!');
    }, 1500);
  });
  return promise;
};

setTimeout(() => {
  console.log('Timer is done!');
  fetchData()
    .then(text => {
      console.log(text);
      return fetchData();
    })
    .then(text2 => {
      console.log(text2);
    });
}, 2000);

console.log('Hello!');
console.log('Hi!');

```

### Template Literals

```js
console.log("My name is " + name + " and I am " + age + " years old."); // older way

console.log(`My name is ${name} and I am ${age} years old.`); // New way

```


