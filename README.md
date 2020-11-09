# Node-Js

## NodeJS & TypeScript

### TypeScript: What & Why?

* So, what is TypeScript and why would we use it?

* TypeScript is a superset to JavaScript. That simply means that it extends JavaScript. It builds up on JavaScript.

* And unlike JavaScript, TypeScript does not run in the browser. Instead, TypeScript has to be compiled to JavaScript so that it runs again.

* Now, why would we then work with it? Because TypeScript gives us, as a developer, a better development experience because it adds certain feature to the code which only exist during development, but which still help us write better code and avoid unwanted errors.

```js
function add (num1, num2){
  return num1+num2;
}
```
* What if you would pass in one and five as strings add('1','5') though? Then, you get back the string 15.So, one and five are then concatenated to one longer string instead of being converted to numbers, and then added as numbers.

* Now, the reason for this is that this is simply how JavaScript works. If you have an operation with a plus and at least one of the two operands is a string, then both will be combined as strings, essentially. That's how JavaScript works.

* Now, you might think that this is a unrealistic scenario because why would you call the function with two strings? Well, imagine that you have two inputs in your page. Two inputs where you fetch some user input. Now, you should know that whatever data you extract from such inputs is always extracted as text in JavaScript. So, even if the user entered a number in an input on your page, if you extract that data with JavaScript, it'll be a string. Now, you can always convert this to a number, of course, but if you forget this, and you pass the unconverted value to this function, you might get this unintended result.

* Now, that's where TypeScript can help us. To avoid such a unwanted behavior which occurs at runtime, so when our code executes, we can use TypeScript. Now, of course, we could also avoid this behavior at runtime with JavaScript. We could add an if check, for example, to see whether the values we received are strings or numbers. That is something we can check with JavaScript, and this would allow us to avoid such mistakes, but, of course, that means you have to write extra code at runtime to make sure that your code works when you actually could avoid this during development if you had strict type checks. So, if you simply could tell JavaScript, so to say in advance which types of data you want, and then JavaScript and your IDE could warn you when you have some code in your program where wrong types are fed in.

* And that's where TypeScript helps us. It adds strict typing.

* In general, TypeScript adds a bunch of features to JavaScript. It adds the types, and that's the most important addition. That's where TypeScript's name comes from.

* But it also unlocks certain next-generation JavaScript features, which we then can use in our code without any extra tools like Babel.

* It also adds some non next-gen features, so some features which don't exist in JavaScript at all, which help us write cleaner code.

* Now, all these features are stripped away once it's compiled, but during development, those features can help us write cleaner code.

* It adds meta-programming features like Decorators. It has rich configuration options that allow us as a developer to fine-tune how code should be compiled.

### TypeScript Setup

* Lets create a simple type script add function

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TypeScript</title>
  <script src="app.js" defer></script>
</head>
<body>
  <input type="number">
  <input type="number">
  <button>Add</button>
  <p></p>
</body>
</html>
```
* Now let's add a little app.ts file, .ts because we're going to write some TypeScript code in there.

```ts
function add(num1, num2) {
  return num1 + num2;
}

console.log(add(1, 6));

console.log(add('1', '6'));

```
* Now we need to install the TypeScript compiler. Now with Deno we didn't need to install it but now we do need to install it. Because we're not going to execute this code with Deno , I want to execute it in the browser instead, and as I mentioned, the browser doesn't run TypeScript. So we need to convert TypeScript to JavaScript, and for that, we need to TypeScript compiler.

* Deno also needs to convert it, there decompiler, the TypeScript compiler is just built into Deno. But we can install the compiler standalone by following the instructions we find on typeScriptlang.org, and the instructions are very simple.

```js
npm install -g typescript
```
* we'll install TypeScript. The TypeScript compiler globally on your system.

* Now we can run below command to convert your typescript into Js (app.js)

```js
tsc app.ts 
```

* But now we're not going to work in app.js, but we're going to work in app.ts. Now when working with Deno, you won't see those js files because they are generated and stored behind the scenes you could say. We only see it here because this is a very basic project where we control everything on our own with help of the compiler.

### Assigning Types

* Thus far, we have some basic code here, which works with numbers and strings. Now we wanna avoid that strings can pass in And for this in TypeScript files, we can set types, we can set types on variables, we can set types on parameters, in a bunch of other places as well.

* we add a type to a parameter as well as to a variable by adding a colon after the variable or parameter name. And then after we add the type we wanna use.

* Now TypeScript knows a bunch of Core Types which are simply built into TypeScript. (number, string, boolean, object, array,)

* Refer : https://www.typescriptlang.org/docs/handbook/basic-types.html 

```ts
function add(num1: number, num2: number) {
  return num1 + num2;
}

console.log(add(1, 6));

console.log(add('1', '6'));

```
* Once i added type like this my IDE started complaing about the string parameter "Argument of type '"1"' is not assignable to parameter of type 'number'" because a string is not a number. If I compile this code, I also get this same error here,

* Nonetheless, it did compile the code. You can also configure TypeScript to not compile if it has such an error. The default is that it does compile. And here that's good, because that actually gives us another piece of important information.

* In the compiled JavaScript code, that colon number thing here is gone. Because as I mentioned before, it's a pure TypeScript feature. It doesn't exist in JavaScript. It's only there during development to give us exactly that error, which we see down there. That's why we have this feature.

### Type Inference & Type Casting

* let connect our html input with app.js

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TypeScript</title>
  <script src="app.js" defer></script>
</head>
<body>
  <input type="number" id="num1">
  <input type="number" id="num2">
  <button>Add</button>
  <p></p>
</body>
</html>
```
* TypeScript builds up on JavaScript. This means that any JavaScript code, works in TypeScript files.All JavaScript code is supported in TypeScript.

* Now we can use this in our app.ts
```ts
// not every HTML element has a value property. Input elements have value properties, paragraphs don't have value property for example So we need to convince TypeScript that what we get access to here will be an input.

const num1Element = document.getElementById('num1') as HTMLInputElement; //
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button'); // For the button, it knew that it's a button because we query select by the button tag.

function add(num1: number, num2: number) {
  return num1 + num2;
}
// my IDE knows that I can call addEventListener on the button element. How ??
// because it knows that when we select a button with querySelector, what we'll get back is an HTMLButtonElement.
// If I hover over a button element you see here, that's something which is called the inferred type. We didn't define this type explicitly.
// But we don't need to do this here, because TypeScript is able to infer types. And it's really smart regarding that. it's able to find out which type of value will eventually be stored in this constant because of this code here.

// So it knows will eventually have a button in there and that's why it knows that we can call addEventListener.
buttonElement.addEventListener('click', () => { 
  
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const result = add(+num1, +num2); // value actally always returns string That's the return type of this property.
  // Now here we need numbers. So here, the fix is easy, we converted this. But now we are forced to make that conversion and we can't forget or overlook it.
  console.log(result);
});

```
* Type casting - If we as a developer know with certainty that something is of a certain type, we can use the special as keyword which is added by TypeScript to tell TypeScript that what we select here will be off that type.

### Configuring TypeScript

* Now, I will not dive into all possible types we have. Instead I wanna focus on a couple of core features. Therefore, as a next step,

* So that they can briefly walk you through some Core Settings, especially one Core Setting. We can add a Configuration file, which will then be taken into account by the TypeScript compiler to this project by running

```ts
  tsc --init
```
* This adds a tsconfig.json file, which has quite a lot of options you can set.

```ts
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                     /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  }
}
```

* but I wanna talk about this "Strict" option because that is important. "Strict" mode is generally encouraged. It means that certain things are not allowed, which normally would be allowed in TypeScript.

* After this in app.ts file just by adding this configuration. I now get an error here that this is possibly 'null'

```ts
// here we will get error as "Object is possibly 'null'.ts"
buttonElement.addEventListener('click', () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const result = add(+num1, +num2);
  console.log(result);
});
```

* This is one "strict" mode feature. We have this "strictNullCheck" which is turned on. All those checks here are turned on. If "strict" is set to true, alternatively, you comment out to this line and just comment in the features you want down there.

```ts
/* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */
```
* So, they're all set to true when setting "Strict" to true. And one of these features ensures that you're not calling something on something else, which might be "null".

* we select the 'button', but of course, TypeScript can't know, whether that 'button' actually exists. 

* it does not check our HTML code. So therefore this could be 'null' if we don't find a 'button', if we have no buttonElement.

* Now to work around this, we have two options. We can add some code here where we check. If buttonElement is Truthy and move that code into that if check.

```js
if(buttonElement){
  buttonElement.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    console.log(result);
  });
}
```
* Alternatively, we know that there will be a button. Just as we know that these elements here are HTMLInputElements. In such cases, we can add an exclamation mark here.

```js
const buttonElement = document.querySelector('button')!;
```
* This simply means the statement in front of it. The expression in front of it, could theoretically be 'null', but we know that it isn't. So, please TypeScript ignored that 'null' case and take the other value.

* in this case, take HTMLButtonElement as the only value. This is important. And that's something I wanted to show you here.

* And that's something I wanted to show you here. One other thing that wouldn't be allowed with Strict mode is that you omit the type of one parameter for example,

```js
function add(num1, num2: number) { // here...
  return num1 + num2;
}
```
* now it complains that this parameter implicitly has the 'any' the type. There is an 'any' type which you cannot sign, and that's also is fine. But that's a very generic fallback type.

```js
function add(num1: any, num2: number) { // here...
  return num1 + num2;
}

```

* Any kind of value is allowed here. And therefore, this is really just a type you should know. If you have no idea, which kind of data you can expect, if you do know it better, it is recommended that you are as clear as possible,

* But even if you don't know it, if you set this to any it's okay. But not setting 'any' type, that's not something the "Strict" mode allows. Because then does this implicitly 'any', but it looks like you simply forgot to look into this argument and you should at least explicitly set 'any' to make it very clear that you don't know better, or that you indeed want to allow any kind of value here.

* So, explicit 'any' is allowed implicit 'any' isn't, and it's even better, if you set the specific type you are expecting.

* now important, As soon as you added that tsconfig.json file, Once you run the types of compiler, you can still select the file, but then the tsconfig.json configuration will not be taken into account.

```ts
tsc app.ts
```
* Instead, as soon as you do have such a tsconfig.json file, just run "tsc", and it will compile all types of files in the folder, whilst taking the Config File into account. So, only if you don't point at a specific file, the configuration file will be taken into account. And all types of files in the folder will be configured. You can still target the file if you want to.Then the configuration file is ignored for the types of compilation though.

* The IDE always picks up to config.json file. So the IDE support is always provided. No matter how you then compile it.

### Working with Union Types

* Now let's say, we actually want to make add a bit more flexible. It should work with numbers, but it should also work with strings. And I want to get that concatenated result.That's where we can use a feature called the Union Type.

* typeof - This is not TypeScript code. The typeof operator exists in JavaScript and it gives us back the types as strings, number and so on.

```js
const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button')!;

function add(num1: number | string, num2: number | string) { // 
  if (typeof num1 === 'number' && typeof num2 === 'number') {
    return num1 + num2;
  } else if (typeof num1 === 'string' && typeof num2 === 'string') {
    return num1 + ' ' + num2; // string 
  }
  return +num1 + +num2; // default number 
}

buttonElement.addEventListener('click', () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const result = add(+num1, +num2);
  const stringResult = add(num1, num2);
  console.log(result);
  console.log(stringResult);
});
```

* so that if we get a string and a number mixed, we always convert both to a number. If we have two numbers, we add them like this. If we have two strings, we add them like this. This is a so called Type Guard,

* And now you'll see that down there, I'm not able to call this for Booleans because this is neither a number or a string, and I'm only allowing these two kinds of types with my Union Type

### Using Object & Array Types

* Here we're working with numbers and strings, but actually also already with objects, HTML input element and the HTML button element, which is inferred here, is actually an object type because we have DOM objects here in JavaScript.Now, we can also define our own object types of course.

* Let's say we have another function, print result and here it actually wants a result object


```js
const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button')!;

// Now objects are nice, sometimes you'll of course, work with arrays. Let's say instead of logging my results here, I wanna store them in arrays.

const numResults: number[]  = []; // number array type
const textResults: string[] = []; // string array type

function add(num1: number | string, num2: number | string) {
  if (typeof num1 === 'number' && typeof num2 === 'number') {
    return num1 + num2;
  } else if (typeof num1 === 'string' && typeof num2 === 'string') {
    return num1 + ' ' + num2;
  }
  return +num1 + +num2;
}

function printResult(resultObj: { val: number; timestamp: Date }) {
  // here i want a resultObj with val and timestamp structure
  console.log(resultObj.val);
}

buttonElement.addEventListener('click', () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const result = add(+num1, +num2);
  numResults.push(result as number);
  const stringResult = add(num1, num2);
  textResults.push(stringResult as string);
  printResult({ val: result as number, timestamp: new Date() }); // result as number -> we do number casting here to 
  console.log(numResults, textResults);
});

```
### Working with Type Aliases & Interfaces

* Now in our TypeScript code, we have some repetition. Not horrible and definitely bearable, but we have some repetition and some code that could be hard to read. For example here we have repetition, we re-use the same union type in two places. Now, this is definitely okay, but you could optimize this or improve this with a type alias.

* TypeScript has a built in type operator, which does not exist in JavaScript, don't confuse it with type of, type is a different one. This allows you to set up your own type alias so you can give a different type a new name.

```js
const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button')!;

const numResults: number[] = [];
const textResults: string[] = [];

type NumOrString = number | string;
type Result = { val: number; timestamp: Date };

function add(num1: NumOrString, num2: NumOrString) {
  if (typeof num1 === 'number' && typeof num2 === 'number') {
    return num1 + num2;
  } else if (typeof num1 === 'string' && typeof num2 === 'string') {
    return num1 + ' ' + num2;
  }
  return +num1 + +num2;
}

function printResult(resultObj: Result) {
  console.log(resultObj.val);
}

buttonElement.addEventListener('click', () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const result = add(+num1, +num2);
  numResults.push(result as number);
  const stringResult = add(num1, num2);
  textResults.push(stringResult as string);
  printResult({ val: result as number, timestamp: new Date() });
  console.log(numResults, textResults);
});
```
* So type aliases can be very useful. An alternative, at least when you're working with object types are interfaces.

* Interfaces also allow you to define the structure of an object.

```js
const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button')!;

const numResults: number[] = [];
const textResults: string[] = [];

type NumOrString = number | string;

interface ResultObj { // interface object
  val: number;
  timestamp: Date; // Date 
}

function add(num1: NumOrString, num2: NumOrString) {
  if (typeof num1 === 'number' && typeof num2 === 'number') {
    return num1 + num2;
  } else if (typeof num1 === 'string' && typeof num2 === 'string') {
    return num1 + ' ' + num2;
  }
  return +num1 + +num2;
}

function printResult(resultObj: ResultObj) {
  console.log(resultObj.val);
}

buttonElement.addEventListener('click', () => {
  const num1 = num1Element.value;
  const num2 = num2Element.value;
  const result = add(+num1, +num2);
  numResults.push(result as number);
  const stringResult = add(num1, num2);
  textResults.push(stringResult as string);
  printResult({ val: result as number, timestamp: new Date() });
  console.log(numResults, textResults);
});

```
* Now why would you use an interface or a type alias, what's the difference?

* If you're just defining the structure of an object, you can use either of the two. Using interfaces is a bit more common but it's not a must to. Interfaces can however also be used to force classes to implement certain methods or functionalities,

* A last important note is that if you would add your own class or constructor function, you could use the class name as a type as well,

* We can use date with new date to instantiate it and get the current date time stamp, but we can also use it just as a type. And that's true for any constructor function and class, no matter if it's a built in one, or your own one.

### Understanding Generics

* Generics are a feature that can look very confusing at first, but it makes a lot of sense. Actually, in our code here, we already have a generic type, our two array types here.

```js
const numResults: number[] = [];
const textResults: string[] = [];
```

* A generic type simply is a type that interacts with another type, and an array is a great example.

* An array is a type on its own. It's a list of data, that's the core type, but it interacts with another type, the type of data inside of the array. So, you could say that the array is the outer type, but then you have all the elements in the array as an inner type.

* And this here, this way of defining an array type, is actually just a shortcut in TypeScript. The longer form would be that we set numResults to type Array, but now array is a so-called generic type, and you have to define the wrapped, the inner type, in this case, the value types of the values inside of the array

```js
const numResults: Array<number> = [];
```

* Another example for a generic type would be a promise. Now, for that, we can create a new promise down there,

* And, by default, this code won't work here because we need to add a library to tsconfig to, basically, tell tsconfig which kind of features we wanna support. And, for example, by default here, because of this target, it's configured to compile the TypeScript code down to es5 JavaScript code, which is quite old. If we pick es6 here, for example, now this will work.

```js
// tsconfig
 "target": "es6",        
```
* Because promise, of course, is not a TypeScript feature, it can't be compiled to something that works in older JavaScript Instead, we need to tell TypeScript that we wanna compile to JavaScript, which natively supports promise. And that's what we just did by changing the target to es6.

```js
// And a promise gets an argument which is a function, and that function itself gets two arguments, a resolve and a reject function, and, inside of the promise when we define it on our own,

const myPromise = new Promise<string>((resolve, reject) => { // without <string> we can't use split in
  setTimeout(() => {
    resolve('It worked!');
  }, 1000);
});

// we can, for example, set a timeout to execute some code after a second, and after that second we resolve the promise with, It worked!

// And then, we can use our own promise here to listen to the result, and console.log it here. And we could also add catch to react to the rejection of the promise.

myPromise.then((result) => {
  // For the array, it was the value stored in the array.
  // For the promise, it's the value the promise resolves to.
  // And, for example, here it resolves to a string, and, hence, we should be able to call split here,
  // But this does not work because TypeScript does not understand that this is a string. It does not know the type.

  // Well, by adding angle brackets after Promise, we can set the type to which promise will resolve to a string.
  console.log(result.split('w'));
});
```

* By the way, now with a config file, don't select the file manually otherwise the config file won't be taken into account by the compiler. It is taken into account by the IDE, but not by the compiler. Instead, just press "tsc" and it will compile all TypeScript files in the folder.

* But now, why is the promise a generic type? Because it eventually resolves to a value, and the value it resolves to that's the generic type for the promise.

* Now, you can't set angle brackets on every built-in object. It needs to be an object that supports this, but the promise object, the promise constructor function, does support generic types because you can set the value the promise will eventually resolve to.

### Node & TypeScript: Setup

* Now, with the TypeScript basics out of the way, let's see how we could utilize TypeScript in a simple Node Express application.

```js
tsc --init
```
*  I'll run npm init to basically turn this into a new npm controlled project where we then can install dependencies. I'll confirm all these defaults here, and that gives me an empty package JSON file.

```js
npm init
```
* Now, I wanna create a basic Node Express application, let's say a basic Node Express rest API, but with TypeScript instead of with JavaScript.

* And for this now, besides creating these configuration files here, of course we wanna install Express,

```js
npm install --save express
npm install --save body-parser
```
* the body-parser package to parse incoming request bodies.Now, with all of that installed, we could write a regular Node Express application

* Let's add app.js 
```js
const express = require('express');

const app = express();

app.listen(3000);
```
* and then we can register our middleware, our different routes, we can parse incoming request bodies, we can do all of that. But I now don't want to do it like that, instead now the goal is to write some TypeScript code.

* let's convert this to a TypeScript application and let me show you how we can build a basic rest API with TypeScript.

### Getting Started with Node and TypeScript

* So we get our app.js file, we get these configuration files. Now it's time to convert this to a TypeScript file. For this we can change the extension here to app.ts

* and now we can use TypeScript features in here. But automatically, you see that I'm getting an error here cannot find name require.

* You need to understan that this require method is only available when we're running this code with Node.

* If we would want to run it in the browser, this does not exist. Now TypeScript does not know where we plan to run this code,and my IDE has built in TypeScript support and therefore it detects that TypeScript will not know whether it exists or not.

* So to let TypeScript know that this exists, we can simply run

```js
npm install --save-dev @types/node
```
* that's only used during development at types slash node. Now this at types thing here is important. On npm, you will find many at types packages. These are packages which provide TypeScript translations for JavaScript features you could say.

* They contain code that allows TypeScript to understand a certain library, a certain package or a certain commands, and with at types node, the thing is that if we install it, we can use Node.js specific syntax in our TypeScript files, because this dependency will provide TypeScript with the translation of this to JavaScript,

* After this package install you could see the error is gone

* The reason for that is that if we dig into this types node folder, here in the end, we got a dts file, we get a bunch of dts files actually, which provide all these core node modules translated to TypeScript, and it's really just translations from TypeScript to JavaScript. So here you don't find the entire node code re-written in TypeScript. Instead, these are really just instructions which TypeScript is able to understand so that it knows how to convert your TypeScript code to valid JavaScript code.

* In this example

```js
const express = require('express');

const app = express();

app.listen(3000);
```
* it would simply keep the code as it is because it would know that this code is valid JavaScript code if executed with Node.

* Will use more of those at types packages. Because for example with Express  I get no auto completion My IDE doesn't know that I can listen on the app here on this app object.

* Now that's not horrible, our code would run. But it would be nice if we would get this extra support by the IDE.

* So if TypeScript would understand that we have a listen method. This would also ensure that we can't pass in invalid data. For example, if we think that listen works like this, and it wants an object with the port here, then this is an error we might wanna catch, and currently, if I run tsc here to compile all files, this compiles just fine.

```js
app.listen({port :3000});
```
* Because TypeScript does not understand how this listen method looks like, which arguments it wants and how it works, and because of that, it just accepts this code.

* Now we can make TypeScript aware of the express package just as we made it aware of the node runtime in general by installing another types package

```js
npm install --save-dev @types/express
```
* Now that alone won't do the trick though, as you can tell, I still don't get an error, I still don't get auto completion Because installing the types like this is not enough. It was enough for a Node which is our general code we're writing. But it's not enough for this third party librarywhich we're importing like this,and the import syntax is the problem.

* By default, TypeScript is tuned for web apps running in the browser, and they are this import syntax would not be available. So that's not the default import syntax it expects when it comes to combining multiple files.

* We can change the expectations by TypeScript in a tsconfig.json file.Their module should indeed be set to commonjs.

```js
  "target": "es6",  
  "module": "commonjs",
  "moduleResolution": "node",
```
* let's also change the targets to es6 so that we compile our code to more modern JavaScript, which Node.js is capable of executing.Now with that, let's go back to app.ts and all the change code in one little other detail,

```js
// import express = require('express'); // you can use either this way or import express from 'express';
import express from 'express'; // which normally is not supported like this in Node.js, you can import express from express.
// In Node.js, by default you use that require syntax. Now with TypeScript, you can enable this syntax and TypeScript accepts this syntax.
import bodyParser from 'body-parser';

const app = express();

app.listen(3000);

```

* But if you then compile your code, if you run tsc, you will see that in the result in the end does looks quite different. But in the result here, it still uses require. Now it also transferred this code in a couple of other ways. But that's just some internal stuff that it does. It still uses require in the end here.

```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var todos_1 = __importDefault(require("./routes/todos"));
var app = express_1.default();
app.use(body_parser_1.default.json());
app.use(todos_1.default);
app.listen(3000);
```

* But we can write code like this. Which is especially nice if you're coming from the front end, and you're used to this import syntax. Now, of course, in the modern JavaScript feature section, I showed that this import from syntax is also supported by Node.js natively even if you're not using TypeScript,

* But please note that here, I didn't change the package json file to enable this import syntax, as we did have to do it in that other course section, and with TypeScript here, and that's something you'll see throughout this section,

* we will also still be able to omit file extensions for example, and other difference to the baked in modern import export syntax.

* I've written that it's pretty similar though, but the difference that you need to understand here essentially, just instead here in TypeScript we always can and actually should use this import from syntax, and it is then still compiled down to that require import syntax node uses by default.

* So there will be a difference between the code we write and decode that will actually run on the server, and now we also get help regarding the arguments we can pass to listen, and now for the argument, we see that indeed listen has this handle argument which it accepts which can be typed any, and therefore it doesn't yell at us here.

* this extra IDE support, which we get thanks to TypeScript, as well as this import syntax which might be preferred
by some developers since we're used to data import syntax from the client, these are already some advantages we get from using TypeScript.

### Writing TypeScript Express.js Code

* With the basics out of the way, let's turn this into a very basic REST API. For that, I'll actually add a routes folder again, and in there have my basic routes and now let's say we're building a very simple to do app REST API.Certainly not the most exciting thing we can build, but a great practice for Node Express and TypeScript.

* So here I have my todos.ts file, before that let us add model interface

```js
export interface Todo {
  id: string;
  text: string;
}
```
* In todos.ts file 

```ts
import { Router } from 'express'; // import Router from express

import { Todo } from '../models/todo';

let todos: Todo[] = []; // Array Todo with this types interface

const router = Router(); // Router call reference

router.get('/', (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.post('/todo', (req, res, next) => {
  // We wanna extract any data that's attached to the incoming request from its body.
  // And we have learned that we can use the body-parser package for that.

  const body = req.body;
  // Todo type interface fetched from model
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };

  todos.push(newTodo);

  res.status(201).json({ message: 'Added Todo', todo: newTodo, todos: todos });
});

router.put('/todo/:todoId', (req, res, next) => {
  const params = req.params;
  const tid = params.todoId;
  const body = req.body;
  const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
  if (todoIndex >= 0) {
    todos[todoIndex] = { id: todos[todoIndex].id, text: body.text };
    return res.status(200).json({ message: 'Updated todo', todos: todos });
  }
  res.status(404).json({ message: 'Could not find todo for this id.' });
});

router.delete('/todo/:todoId', (req, res, next) => {
  const params = req.params;
  todos = todos.filter((todoItem) => todoItem.id !== params.todoId);
  res.status(200).json({ message: 'Deleted todo', todos: todos });
});

export default router; // his will export router as the default export in this file.

```
* The default export then simply is what we can import an app.ts with todosRoutes from './routes/todos';

```js
import express from 'express';
import bodyParser from 'body-parser';

import todosRoutes from './routes/todos'; // This import syntax will always pick the default export of a file

const app = express();

app.use(bodyParser.json()); // bodyParser - get data from incomming request.

app.use(todosRoutes); // use todosRoutes as middleware

app.listen(3000);
```
* Now you saw that here I got all the completion, even though we haven't installed the types package for body-parser. Now, that's actually some extra convenience added by TypeScript

```json
{
  "name": "tsnode",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.19.0",
    "express": "^4.17.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.8",
    "@types/node": "^14.14.6"
  }
}
```
* And to a certain extent, such inference can be made even with just a JavaScript code. So for example, here TypeScript and my IDE were able to find out that indeed there is a JSON method exposed on the body-parser object into JavaScript source code off that library. For perfect TypeScript support, where it understands everything, including all arguments types you might be able to provide, I still recommend that you always install types packages for the libraries you're working with.

```js
npm install --save-dev @types/body-parser
```
* Just for this extra TypeScript safety, even though I will admit that for the purpose we're using it here, we wouldn't need that.

* Just for this extra TypeScript safety, even though I will admit that for the purpose we're using it here, we wouldn't need that.

### Testing the API

* To test this entire API, we first of all need to compile it. And we can just run TSC for that, since this will compile all the TypeScript files in this project.

* So you see that this completes without errors. One important note, is that in the models folder, you'll see the todo JS file is pretty empty here.

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
```
* And the reason for that is that interfaces are a pure TypeScript feature. Which helps TypeScript during compilation, but which generate no actual code. Because this feature doesn't create anything that would exist in JavaScript.

* Therefore, we essentially have an empty file here without anything in it. if you take a closer look. But our code still works, because that todo interface is only used as a type definition in the other files.

* And that's a feature which doesn't exist in JavaScript anyways, that's what I mean, it only matters during compilation. We disregard all those JavaScript files, and we can now just run them as we're used to.

* Test with POSTMAN

###  Using Type Casting

* I want to start with some extra TypeScript features, which you can utilize. Maybe you saw that when I accessed the request body or the request params, I get auto-completion as long as I work on the request object.

* params as well as body,nin the end here, is of type any.

* That's the type of body and that's the type of params. Well, params is actually a params dictionary. But that's essentially just an object with key value pairs, where any keys are allowed.

* And we're using TypeScript to avoid mistakes like this. Of course TypeScript can't anticipate which kind of data we get on incoming requests, but we as a developer should know which kind of data we get there. We can let TypeScript know about this.

* And now to make TypeScript aware of our knowledge of how a request body should look like, we can alter this a little bit.

* We can set the body here, equal to request body, and then use type conversion with the ask keyword to convince TypeScript that this is of a certain type. And now we can define a type of our choice that reflects how a body, how a request body for this route, should look like.

* we set this to an object type, where we know that there will be a text property which would be a string.

```js
import { Router } from 'express';

import { Todo } from '../models/todo';

type RequestBody = { text: string }; // RequestBody object type
type RequestParams = { todoId: string }; // RequestParams object type

let todos: Todo[] = [];

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.post('/todo', (req, res, next) => {
  const body = req.body as RequestBody; // RequestBody
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };

  todos.push(newTodo);

  res.status(201).json({ message: 'Added Todo', todo: newTodo, todos: todos });
});

router.put('/todo/:todoId', (req, res, next) => {
  const params = req.params as RequestParams; // RequestParams
  const tid = params.todoId;
  const body = req.body as RequestBody; // RequestBody
  const todoIndex = todos.findIndex((todoItem) => todoItem.id === tid);
  if (todoIndex >= 0) {
    todos[todoIndex] = { id: todos[todoIndex].id, text: body.text };
    return res.status(200).json({ message: 'Updated todo', todos: todos });
  }
  res.status(404).json({ message: 'Could not find todo for this id.' });
});

router.delete('/todo/:todoId', (req, res, next) => {
  const params = req.params as RequestParams; // RequestParams
  todos = todos.filter((todoItem) => todoItem.id !== params.todoId);
  res.status(200).json({ message: 'Deleted todo', todos: todos });
});

export default router;
```

### Moving to a Better Project Structure

* the more annoying thing for me here is that we always have these JavaScript files next to the TypeScript files. and we shouldn't work in those extra JavaScript files. You shouldn't change that code. You should only work in the TypeScript files.

* And therefore, I wanna ensure that the compiled files end up in a different place. And to achieve this, we can go to the tsconfig.json file

```js
// tsconfig.json
"outDir": "./dist",    
```
* This allows you to set a directory where the generated JavaScript files will be stored in. And here, I will specify dist, This will create a new dist sub-folder, and all of our compiled files will end up in that folder.

* And if I now delete the other JavaScript files outside of the dist folder to only have my TypeScript source code there, if I rerun tsc, you see they're not appearing again.

* They're really only in the dist folder. So, that's great. Now, the dist folder holds our finished Node app, which we can run with the Node executable.

* And our source code is outside of that. Maybe you also want a separate source folder in which you store your source code though,to have a clear separation of input and output.

* And now in tsconfig.json, we can set up our rootDir which specifies the root directory of input files. And I wanna set that to /src to make it clear

```json
"rootDir": "./src",   
```
* that that's the folder that contains our TypeScript code.

* And then the outDir is the folder where the compiled code should end up in.

* And if I delete dist, that folder is of course regenerated, which proves that everything works. Now important, we're always executing the code into dist folder because Node.js is not capable of running TypeScript code like this. We only work in the source folder though, and then we compile it to JavaScript to have our executable code.



