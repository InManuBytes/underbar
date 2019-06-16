(function() {
  'use strict';

  window._ = {};

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function(val) {
    return val;
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   *
   *
   * IMPORTANT NOTE!
   * ===========
   *
   * The .first function is implemented for you, to help guide you toward success
   * in your work on the following functions. Whenever you see a portion of the
   * assignment pre-completed, be sure to read and understand it fully before
   * you proceed. Skipping this step will lead to considerably more difficulty
   * implementing the sections you are responsible for.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last n elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    return n === undefined ? array[array.length-1] : n > array.length ? array.slice() : array.slice(array.length-n,array.length);
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the
  // iterator function over each item in the input collection.
  _.each = function(collection, iterator) {
    if (Array.isArray(collection)){
      for (let i =0; i<collection.length;i++){
        iterator(collection[i],i,collection);
      }
    } else {
      let keys = Object.keys(collection);
      for (let i = 0; i<keys.length; i++){
        iterator(collection[keys[i]],keys[i],collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    // TIP: Here's an example of a function that needs to iterate, which we've
    // implemented for you. Instead of using a standard `for` loop, though,
    // it uses the iteration helper `each`, which you will need to write.
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) { //the -1 makes sure we only get the first instance of the search
        result = index; //saves the index of the first instance
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    let passTest = [];
    _.each(collection, (item, index) => {
      if (test(item)){
        passTest.push(item);
      }
    });
    return passTest;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    // TIP: see if you can re-use _.filter() here, without simply
    // copying code in and modifying it
    let testFalse = function(item){return test(item) === false};
    return _.filter(collection,testFalse);
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array, isSorted, iterator) {
    let duplicateFree = [];
    //keep an object to keep track of items as we check them
    let checkForDups = {};
    _.each(array, (item, index) => {
      //keep a variable that is either equal to the item in the array or 
      //the iterated value if a sorted list and an iterator are passed as arguments
      let value = (isSorted && iterator) ? iterator(item, index, array) : item;
      if (checkForDups[value] === undefined){
      //for every unique value save in the checkForDups obj with its item 
        checkForDups[value] = item; 
        //and push the actual item into the resulting array
        duplicateFree.push(item);
        /*this if part of the code is the reason _.uniq generates 
                _.uniq([1, 2, 2, 3, 4, 4],true,iterator) = [1,2] 
        when the iterator checks a truth statement like
                iterator = function(value) {return value === 1;};
        If we looked at the object that keeps track we'd see
                checkForDups = {true: 1,false: 2} 
        since true and false are the only unique values that are generated*/
      }
    });
    return duplicateFree;
  };


  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    // map() is a useful primitive iteration function that works a lot
    // like each(), but in addition to running the operation on all
    // the members, it also maintains an array of results.
    let mappedArray = [];
    _.each(collection,(item, index) => {
      let value = iterator(item, index, collection);
      mappedArray.push(value);
    });
    return mappedArray;
  };

  /*
   * TIP: map is really handy when you want to transform an array of
   * values into a new array of values. _.pluck() is solved for you
   * as an example of this.
   */

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(collection, key) {
    // TIP: map is really handy when you want to transform an array of
    // values into a new array of values. _.pluck() is solved for you
    // as an example of this.
    return _.map(collection, function(item){
      return item[key];
    });
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(accumulator, item) for each item. accumulator should be
  // the return value of the previous iterator call.
  //  
  // You can pass in a starting value for the accumulator as the third argument
  // to reduce. If no starting value is passed, the first element is used as
  // the accumulator, and is never passed to the iterator. In other words, in
  // the case where a starting value is not passed, the iterator is not invoked
  // until the second element, with the first element as its second argument.
  //  
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  //  
  //   var identity = _.reduce([5], function(total, number){
  //     return total + number * number;
  //   }); // should be 5, regardless of the iterator function passed in
  //          No accumulator is given so the first element is used.
  _.reduce = function(collection, iterator, accumulator) {
    //set the initial value to the first element
    let index = 0; 
    //get an array of the keys if the collection passed is an object
    let keys = !Array.isArray(collection) && Object.keys(collection);
    //get the length of the collection, if it's an array, or the keys-array if it's an object
    let length = (keys || collection).length;
    //if no value is passed to the accumulator set it to the first element/key and 
    //increase the index so that the first element is never passed to the iterator
    if (accumulator === undefined){
      accumulator = collection[keys ? keys[index] : index];
      index ++;
    }
    //loop through the collection and call the iterator for each item 
    //with the accumulator as the return value of the previous iterator call
    for (index; index<length;index++){
      //allows us to loop both through an array or an object by its keys
      let currentKey = keys ? keys[index] : index;
      accumulator = iterator(accumulator,collection[currentKey]);
    }
    return accumulator;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // TIP: Many iteration problems can be most easily expressed in
    // terms of reduce(). Here's a freebie to demonstrate!
    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    // TIP: Try re-using reduce() here.
    //iterator returns true/false
    return _.reduce(collection,(passesTruthTest, item) => {
      if (!passesTruthTest) {
        return false; //as soon as one test doesn't pass should just return false
      }
      return (!!iterator) ? !!iterator(item): !!item; //makes sure it works when no callback is provided
    },true);
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every() here.
    // some passing the tests is just another way of saying not all are failing
    return _.every(collection, (item) => {
      return ((!!iterator)? !!iterator(item) === false : !!item === false);
    }) ? false : true;     // if all are false .some should return false otherwise it's true
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(destination, source) {
   for (let i=1; i<arguments.length;i++){
        let newSource = arguments[i];
        _.each(newSource,(value,key,newSource) => {
          destination[key] = newSource[key];
        });
    }
    return destination;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(destination) {
    for (let i=1; i<arguments.length;i++){
        let newSource = arguments[i];
        _.each(newSource,(value,key,newSource) => {
          (destination[key]===undefined) ? destination[key] = newSource[key] : destination[key] = destination[key];
        });
    }
    return destination;
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memorize an expensive function's results by storing them. You may assume
  // that the function only takes primitives as arguments.
  // memoize could be renamed to oncePerUniqueArgumentList; memoize does the
  // same thing as once, but based on many sets of unique arguments.
  //
  // _.memoize should return a function that, when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    let resultsCache = {};
    return function(){
      //make the keys easier to access
      let key = JSON.stringify(arguments);
      if(resultsCache[key]===undefined){
        resultsCache[key] = func.apply(this,arguments);
      } 
      return resultsCache[key];
    }
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    //since we just need to pass the arguments after func and wait then we exclude those
    let args = Array.prototype.slice.call(arguments,2)
    return setTimeout(function() {
      return func.apply(this,args);
    },wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {
    let shuffledArray = array.slice();
    //we'll use the Durstenfield algorith to randomize the array's contents
    //For more see: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    /**this algorithm reduces time complexity from n^2 to n and says:
     * To shuffle an array a of n elements (indices 0..n-1):
     * for i from n−1 downto 1 do  
     * j ← random integer such that 0 ≤ j ≤ i
     * exchange a[j] and a[i]
     * 
     * It basically randomly picks an element and excludes it from the next draw
     * which is why you start with i=n-1
     */
    for (let i =shuffledArray.length-1;i>0;i--){
      /*** Math.floor() returns the largest integer less than or equal to a given number
      Math.random() returns a floating-point pseudo-random (not crypto secure) number < 1 and >= 0,
      which you can then scale to the desired range
      so we can use both to generate a random index betwen 1 and i (inclusive) by multiplying: 
      Math.random()*(max-min+1) = Math.random()*(i-0+1)
      */
      let j = Math.floor(Math.random()*(i+1)); //pick a random index -> item
      let tempItem = shuffledArray[i]; //hold the original item
      shuffledArray[i] = shuffledArray[j]; //exchange the index
      shuffledArray[j] = tempItem; //reassign

    }
    return shuffledArray;
  };


  /**
   * ADVANCED
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  // Calls the method named by functionOrKey on each value in the list.
  // Note: You will need to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  //
  // Note: This is difficult! It may take a while to implement.
  _.throttle = function(func, wait) {
  };
}());
