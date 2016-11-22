/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	console.log("this is a test");
	import {Observable} from 'node_modules/rsjx/Rx';

	const display = document.getElementById('display');
	const incButton = document.getElementById('increment');
	const decButton = document.getElementById('decrement');
	const rstButton = document.getElementById('reset');

	let counter = 1;

	const inc$ = Observable.fromEvent(incButton, 'click');
	inc$.subscribe(ev => { display.innerHTML = counter++; });

	const dec$ = Observable.fromEvent(decButton, 'click');
	dec$.subscribe(ev => { display.innerHTML = counter--; });

	const rst$ = Observable.fromEvent(rstButton, 'click');
	rst$.subscribe(ev => {
	  counter = 1;
	  display.innerHTML = 0;
	});


/***/ }
/******/ ]);