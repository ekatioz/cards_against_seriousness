/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "01a22c076c8e622a4782";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/client/CardsAgainst.js":
/*!************************************!*\
  !*** ./src/client/CardsAgainst.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Controller */ "./src/client/Controller.js");


new _Controller__WEBPACK_IMPORTED_MODULE_0__["Controller"]().init();

/***/ }),

/***/ "./src/client/Controller.js":
/*!**********************************!*\
  !*** ./src/client/Controller.js ***!
  \**********************************/
/*! exports provided: Controller */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Controller", function() { return Controller; });
/* harmony import */ var _Socket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Socket */ "./src/client/Socket.js");
/* harmony import */ var _commonStrings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../commonStrings */ "./src/commonStrings.js");
/* harmony import */ var _commonStrings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_commonStrings__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ui_Login__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui/Login */ "./src/client/ui/Login.js");
/* harmony import */ var _ui_Lobby__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui/Lobby */ "./src/client/ui/Lobby.js");
/* harmony import */ var _ui_MasterView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui/MasterView */ "./src/client/ui/MasterView.js");
/* harmony import */ var _ui_SlaveView__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ui/SlaveView */ "./src/client/ui/SlaveView.js");
/* harmony import */ var _ui_RoundEndView__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ui/RoundEndView */ "./src/client/ui/RoundEndView.js");









class Controller {

    constructor() {
        this.setUpUI();
        this.setUpSocketListeners();
        this._rounds = 0;
    }

    setUpUI() {
        this.lobby = new _ui_Lobby__WEBPACK_IMPORTED_MODULE_3__["Lobby"](() => _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].send({ type: _commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].ready }));
        this.login = new _ui_Login__WEBPACK_IMPORTED_MODULE_2__["Login"](username => {
            _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].send({ type: _commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].newPlayer, name: username });
            document.title = `${username} - ${document.title}`;
            this.view = this.lobby;
        });
        this.master = new _ui_MasterView__WEBPACK_IMPORTED_MODULE_4__["MasterView"]();
        this.slave = new _ui_SlaveView__WEBPACK_IMPORTED_MODULE_5__["SlaveView"]();
        this.roundEnd = new _ui_RoundEndView__WEBPACK_IMPORTED_MODULE_6__["RoundEndView"]();
        this.master.onCardChoosen = card => {
            _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].send({ type: _commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].chooseCard, card: card });
            this.view = this.roundEnd;
        };
        this.slave.onCardConfirmed = card => {
            _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].send({ type: _commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].confirmCard, text: card });
            this.view = this.roundEnd;
        };
        this.roundEnd.onNextRound = () => _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].send({ type: _commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].nextRound });
    }

    setUpSocketListeners() {
        _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].on(_commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].userlist, data => this.lobby.players = data.users);
        _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].on(_commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].role, data => this.role = data.role);
        _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].on(_commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].blackcard, data => {
            this.master.cloze = data.response;
            this.slave.cloze = data.response;
            this.roundEnd.cloze = data.response;
        });
        _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].on(_commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].whitecard, data => this.slave.addWhitecards(data.response));
        _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].on(_commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].cardConfirmed, () => this.master.addCoveredCard());
        _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].on(_commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].reveal, data => this.master.unlockCards(data.cards));
        _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].on(_commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].winner, data => {
            this.roundEnd.setWinner(data.player, data.card);
            if (this.role === _commonStrings__WEBPACK_IMPORTED_MODULE_1__["role"].master)
                this.roundEnd.showNextRoundButton();
        });
        _Socket__WEBPACK_IMPORTED_MODULE_0__["default"].on(_commonStrings__WEBPACK_IMPORTED_MODULE_1__["msgType"].nextRound, () => this.newRound());
    }

    newRound() {
        this._rounds++;
        if(this._rounds > 1) this.roundEnd.clear();
        if (this.role === _commonStrings__WEBPACK_IMPORTED_MODULE_1__["role"].master) {
            this.view = this.master;
        }
        else {
            this.view = this.slave;
        }
    }

    init() {
        this.view = this.login;
    }

    set view(uiElement) {
        if (this._view) document.body.removeChild(this._view.element);
        document.body.appendChild(uiElement.element);
        this._view = uiElement;
    }
}


/***/ }),

/***/ "./src/client/Socket.js":
/*!******************************!*\
  !*** ./src/client/Socket.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Socket {

    constructor() {
        if (!Socket.instance) {
            this._listeners = {};
            this._connection = new WebSocket(`ws://${location.hostname}:13700`);
            this._connection.onopen = () => console.log('ws connection open');
            this._connection.onerror = error => console.log('WebSocket Error ' + error);
            this._connection.onmessage = msg => {
                const data = JSON.parse(msg.data);
                console.log('message from socket', data);
                if (this._listeners[data.type]) {
                    this._listeners[data.type].forEach(cb => cb(data));
                }
            };
            Socket.instance = this;
        }
        return Socket.instance;
    }

    send(data) {
        this._connection.send(JSON.stringify(data));
    }

    on(type, callback) {
        if (this._listeners[type]) this._listeners[type].push(callback);
        else this._listeners[type] = [callback];
    }


}

const instance = new Socket();
Object.freeze(instance);

/* harmony default export */ __webpack_exports__["default"] = (instance);

/***/ }),

/***/ "./src/client/ui/Card.js":
/*!*******************************!*\
  !*** ./src/client/ui/Card.js ***!
  \*******************************/
/*! exports provided: Card */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Card", function() { return Card; });
/* harmony import */ var _UiElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UiElement */ "./src/client/ui/UiElement.js");


class Card extends _UiElement__WEBPACK_IMPORTED_MODULE_0__["UiElement"] {

    constructor(text, confirmationCallback) {
        super();
        if (confirmationCallback) this.addClickListener(e => confirmationCallback(this));

        this.addClass('card');
        this.text = text;
    }

    get text() {
        return this.element.innerText;
    }

    set text(text) {
        this.element.innerText = text;
    }
}

/***/ }),

/***/ "./src/client/ui/Cloze.js":
/*!********************************!*\
  !*** ./src/client/ui/Cloze.js ***!
  \********************************/
/*! exports provided: Cloze */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cloze", function() { return Cloze; });
/* harmony import */ var _UiElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UiElement */ "./src/client/ui/UiElement.js");


const gapSeperator = ' 💣 ';
class Cloze extends _UiElement__WEBPACK_IMPORTED_MODULE_0__["UiElement"]{

    constructor() {
        super();
        this.addClass('cloze');
    }

    setTextParts(...parts) {
        let text = '';
        parts.forEach((part, idx) => {

            text = text + part + (idx === parts.length - 1 ? '' : gapSeperator);
        });
        this.element.innerText = text;
    }
}

/***/ }),

/***/ "./src/client/ui/CoveredCard.js":
/*!**************************************!*\
  !*** ./src/client/ui/CoveredCard.js ***!
  \**************************************/
/*! exports provided: CoveredCard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoveredCard", function() { return CoveredCard; });
/* harmony import */ var _UiElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UiElement */ "./src/client/ui/UiElement.js");
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Card */ "./src/client/ui/Card.js");



class CoveredCard extends _Card__WEBPACK_IMPORTED_MODULE_1__["Card"] {

    constructor(confirmationCallback) {
        super('🙈');
        this._revealCallback = () => this._reveal();
        this.addClickListener(this._revealCallback);
        this.addClass('covered');
        this.addClass('locked');
        this._locked = true;
        this._confirmationCallback = confirmationCallback;
    }

    revealCovered(text){
        this.text = '🐵';
        this._coveredText = text;
        this._locked = false;
    }
    
    _reveal(){
        if(!this._locked){
            this.removeClass('covered');
            this.text = this._coveredText;
            this.removeClickListener(this._revealCallback);
            this.addClickListener(() => this._confirmationCallback(this));
        }
    }
}

/***/ }),

/***/ "./src/client/ui/FullscreenElement.js":
/*!********************************************!*\
  !*** ./src/client/ui/FullscreenElement.js ***!
  \********************************************/
/*! exports provided: FullscreenElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FullscreenElement", function() { return FullscreenElement; });
/* harmony import */ var _UiElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UiElement */ "./src/client/ui/UiElement.js");


class FullscreenElement extends _UiElement__WEBPACK_IMPORTED_MODULE_0__["UiElement"]{

    constructor() {
        super();
        this.addClass('fullscreen');
    }
}

/***/ }),

/***/ "./src/client/ui/Hand.js":
/*!*******************************!*\
  !*** ./src/client/ui/Hand.js ***!
  \*******************************/
/*! exports provided: Hand */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Hand", function() { return Hand; });
/* harmony import */ var _UiElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UiElement */ "./src/client/ui/UiElement.js");
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Card */ "./src/client/ui/Card.js");



class Hand extends _UiElement__WEBPACK_IMPORTED_MODULE_0__["UiElement"]{

    constructor(confirmationCallback) {
        super();
        this.addClass('hand');
        this.confirmationCallback = confirmationCallback;
    }

    addCard(cardText) {
        this.addUiElement(new _Card__WEBPACK_IMPORTED_MODULE_1__["Card"](cardText,this.confirmationCallback));
    }

    removeCard(uiElement){
        this.removeUiElement(uiElement);
    }
}

/***/ }),

/***/ "./src/client/ui/Lobby.js":
/*!********************************!*\
  !*** ./src/client/ui/Lobby.js ***!
  \********************************/
/*! exports provided: Lobby */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Lobby", function() { return Lobby; });
/* harmony import */ var _FullscreenElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FullscreenElement */ "./src/client/ui/FullscreenElement.js");
/* harmony import */ var _PlayersList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PlayersList */ "./src/client/ui/PlayersList.js");
/* harmony import */ var _ProceedButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ProceedButton */ "./src/client/ui/ProceedButton.js");




class Lobby extends _FullscreenElement__WEBPACK_IMPORTED_MODULE_0__["FullscreenElement"] {

    constructor(readyCallback) {
        super();
        this.addClass('login');
        this._players = new _PlayersList__WEBPACK_IMPORTED_MODULE_1__["PlayersList"]();
        this.addUiElement(this._players);
        const ready = new _ProceedButton__WEBPACK_IMPORTED_MODULE_2__["ProceedButton"]('Bereit', () => {
            this.removeUiElement(ready);
            readyCallback();
        });
        this.addUiElement(ready);
    }

    set players(players){
        this._players.update(players);
    }
}

/***/ }),

/***/ "./src/client/ui/Login.js":
/*!********************************!*\
  !*** ./src/client/ui/Login.js ***!
  \********************************/
/*! exports provided: Login */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Login", function() { return Login; });
/* harmony import */ var _FullscreenElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FullscreenElement */ "./src/client/ui/FullscreenElement.js");
/* harmony import */ var _ProceedButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProceedButton */ "./src/client/ui/ProceedButton.js");
/* harmony import */ var _resources_names__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../resources/names */ "./src/resources/names.js");
/* harmony import */ var _resources_names__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_resources_names__WEBPACK_IMPORTED_MODULE_2__);




class Login extends _FullscreenElement__WEBPACK_IMPORTED_MODULE_0__["FullscreenElement"] {

    constructor(loginCallback) {
        super();
        this.addClass('login');
        const username = document.createElement('input');
        username.className = 'username-input';
        username.value = _resources_names__WEBPACK_IMPORTED_MODULE_2___default()();
        this.addDomElement(username);
        this.addUiElement(new _ProceedButton__WEBPACK_IMPORTED_MODULE_1__["ProceedButton"]('Login', () =>
            username.value && username.value !== ''
                ? loginCallback(username.value)
                : {}));
    }
}

/***/ }),

/***/ "./src/client/ui/MasterView.js":
/*!*************************************!*\
  !*** ./src/client/ui/MasterView.js ***!
  \*************************************/
/*! exports provided: MasterView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MasterView", function() { return MasterView; });
/* harmony import */ var _Cloze__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cloze */ "./src/client/ui/Cloze.js");
/* harmony import */ var _FullscreenElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FullscreenElement */ "./src/client/ui/FullscreenElement.js");
/* harmony import */ var _CoveredCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CoveredCard */ "./src/client/ui/CoveredCard.js");




class MasterView extends _FullscreenElement__WEBPACK_IMPORTED_MODULE_1__["FullscreenElement"] {

    constructor() {
        super();
        this.addClass('master');
        this._cloze = new _Cloze__WEBPACK_IMPORTED_MODULE_0__["Cloze"]();
        this.addUiElement(this._cloze);
        this._cCards = [];
    }

    addCoveredCard(){
        const cCard = new _CoveredCard__WEBPACK_IMPORTED_MODULE_2__["CoveredCard"](choosen => {
            this._cCards.forEach(card => {
                this.removeUiElement(card);
            });
            this._cCards.length = 0;
            this._chooseCallback(choosen.text);
        });
        this._cCards.push(cCard);
        this.addUiElement(cCard);
    }

    unlockCards(cards){
        shuffle(cards).forEach((card,i) => this._cCards[i].revealCovered(card));
    }

    set onCardChoosen(cb){
        this._chooseCallback = cb;
    }

    set cloze(parts){
        this._cloze.setTextParts(...parts);
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/***/ }),

/***/ "./src/client/ui/PlayersList.js":
/*!**************************************!*\
  !*** ./src/client/ui/PlayersList.js ***!
  \**************************************/
/*! exports provided: PlayersList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlayersList", function() { return PlayersList; });
/* harmony import */ var _UiElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UiElement */ "./src/client/ui/UiElement.js");


class PlayersList extends _UiElement__WEBPACK_IMPORTED_MODULE_0__["UiElement"]{

    constructor() {
        super();
        this.addClass('lobby-list');
    }

    update(players){
        this.clear();
        players.forEach(player => {
            const entry = document.createElement('div');
            entry.className = `lobby-entry ${player.ready? 'ready' : ''}`;
            entry.innerText = player.name + (player.ready? '👓' : '');
            this.addDomElement(entry);
        });
    }
}

/***/ }),

/***/ "./src/client/ui/ProceedButton.js":
/*!****************************************!*\
  !*** ./src/client/ui/ProceedButton.js ***!
  \****************************************/
/*! exports provided: ProceedButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProceedButton", function() { return ProceedButton; });
/* harmony import */ var _UiElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UiElement */ "./src/client/ui/UiElement.js");


class ProceedButton extends _UiElement__WEBPACK_IMPORTED_MODULE_0__["UiElement"]{

    constructor(caption, action) {
        super();
        this.element = document.createElement('button');
        this.addClass('start-button');
        this.element.innerText = caption;
        this.element.addEventListener('click',action);
    }
}

/***/ }),

/***/ "./src/client/ui/RoundEndView.js":
/*!***************************************!*\
  !*** ./src/client/ui/RoundEndView.js ***!
  \***************************************/
/*! exports provided: RoundEndView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoundEndView", function() { return RoundEndView; });
/* harmony import */ var _Cloze__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cloze */ "./src/client/ui/Cloze.js");
/* harmony import */ var _FullscreenElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FullscreenElement */ "./src/client/ui/FullscreenElement.js");
/* harmony import */ var _ProceedButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ProceedButton */ "./src/client/ui/ProceedButton.js");




class RoundEndView extends _FullscreenElement__WEBPACK_IMPORTED_MODULE_1__["FullscreenElement"] {

    constructor() {
        super();
        this.addClass('roundEnd');
        this._cloze = new _Cloze__WEBPACK_IMPORTED_MODULE_0__["Cloze"]();
        this.addUiElement(this._cloze);

        this._winner = document.createElement('div');
        this._winner.className = 'winner';

        this._winningCard = document.createElement('div');
        this._winningCard.className = 'winningCard';

        this._nextRound = new _ProceedButton__WEBPACK_IMPORTED_MODULE_2__["ProceedButton"]('Nächste Runde', () => this._nextRoundCallback());
    }

    showNextRoundButton() {
        this.addUiElement(this._nextRound);
    }

    setWinner(winner, card) {
        this._winner.innerText = `${winner} gewinnt diese Runde!`;
        this.addDomElement(this._winner);

        this._winningCard.innerText = card;
        this.addDomElement(this._winningCard);
    }

    set onNextRound(cb) {
        this._nextRoundCallback = cb;
    }

    set cloze(parts) {
        this._cloze.setTextParts(...parts);
    }

    clear() {
        this.removeDomElement(this._winner);
        this.removeDomElement(this._winningCard);
        if (this._nextRound.isAttached()) this.removeUiElement(this._nextRound);
        this._cloze.clear();
    }
}

/***/ }),

/***/ "./src/client/ui/SlaveView.js":
/*!************************************!*\
  !*** ./src/client/ui/SlaveView.js ***!
  \************************************/
/*! exports provided: SlaveView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SlaveView", function() { return SlaveView; });
/* harmony import */ var _Cloze__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cloze */ "./src/client/ui/Cloze.js");
/* harmony import */ var _FullscreenElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FullscreenElement */ "./src/client/ui/FullscreenElement.js");
/* harmony import */ var _Hand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Hand */ "./src/client/ui/Hand.js");




class SlaveView extends _FullscreenElement__WEBPACK_IMPORTED_MODULE_1__["FullscreenElement"] {

    constructor() {
        super();
        this.addClass('slave');
        this._cloze = new _Cloze__WEBPACK_IMPORTED_MODULE_0__["Cloze"]();
        this._hand = new _Hand__WEBPACK_IMPORTED_MODULE_2__["Hand"](confirmed => {
            this._hand.removeCard(confirmed);
            this._confirmedCallback(confirmed.text);
        });
        this.addUiElement(this._cloze);
        this.addUiElement(this._hand);
    }

    /**
     * @param {(card: any) => void} cb
     */
    set onCardConfirmed(cb){
        this._confirmedCallback = cb;
    }

    /**
     * @param {any} parts
     */
    set cloze(parts){
        this._cloze.setTextParts(...parts);
    }

    addWhitecards(cards){
        cards.forEach(card => {
            this._hand.addCard(card);
        });
    }
}

/***/ }),

/***/ "./src/client/ui/UiElement.js":
/*!************************************!*\
  !*** ./src/client/ui/UiElement.js ***!
  \************************************/
/*! exports provided: UiElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UiElement", function() { return UiElement; });
class UiElement {
    constructor() {
        this.element = document.createElement('div');
    }

    clear() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
    }

    isAttached(){
        return !!this.element.parentNode;
    }

    addClickListener(cb){
        this.element.addEventListener('click',cb);
    }

    removeClickListener(cb){
        this.element.removeEventListener('click',cb);
    }

    addClass(name) {
        this.element.classList.add(name);
    }

    removeClass(name) {
        this.element.classList.remove(name);
    }

    addDomElement(domElement) {
        this.element.appendChild(domElement);
    }

    addUiElement(uiElement) {
        this.addDomElement(uiElement.element);
    }

    removeDomElement(domElement) {
        this.element.removeChild(domElement);
    }

    removeUiElement(uiElement) {
        this.removeDomElement(uiElement.element);
    }
}

/***/ }),

/***/ "./src/commonStrings.js":
/*!******************************!*\
  !*** ./src/commonStrings.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
    role:{
        master: 'master',
        slave: 'slave',
    },
    ui:{
        cloze: 'cloze',
        card: 'card',
        hand: 'hand',
        proceedButton: 'button',
        lobby: 'lobby'
    },
    msgType:{
        newPlayer: 'newUser',
        ready: 'ready',
        userlist:'userlist',
        role:'role',
        whitecard:'whitecard',
        blackcard:'blackcard',
        nextRound: 'nextRound',
        chooseCard: 'chooseCard',
        confirmCard: 'confirmCard',
        cardConfirmed: 'cardConfirmed',
        reveal: 'reveal',
        winner:'winner'
    }
};

/***/ }),

/***/ "./src/resources/names.js":
/*!********************************!*\
  !*** ./src/resources/names.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

const names = [
    'Antonio Boyle',
    'Kerys Krause',
    'Quinn Coffey',
    'Ella - Grace Hood',
    'Benas Fisher',
    'Willie Lloyd',
    'Tierney Storey',
    'Kairon Bender',
    'Lance Zuniga',
    'Eoin Fraser',
    'Priscilla Peel',
    'Nancy Moran',
    'Ayyub Bellamy',
    'Louis Mellor',
    'Anna Wang',
    'Flynn Gillespie',
    'Latoya Shields',
    'Sam Wood',
    'Kenan Foley',
    'Zane Richmond',
    'Santino Poole',
    'Samantha Dorsey',
    'Petra Espinoza',
    'Sofija Rayner',
    'Shea Bowers',
    'Avleen Acevedo',
    'Yusha Knights',
    'Eduard Murray',
    'Jay - Jay Lang',
    'Henri Field',
    'Dewey Tanner',
    'Eryk Mcfarlane',
    'Ellouise Garrett',
    'Ferne Middleton',
    'Zakariah Newton',
    'Marwah Sanchez',
    'Isla - Mae Park',
    'Isaak Stuart',
    'Arooj Frost',
    'Cheryl Mcnamara',
    'Willa Martin',
    'Emma Knox',
    'Lillia Bryant',
    'Nela Flynn',
    'Om Mendoza',
    'Emmeline White',
    'Abiha Roman',
    'Suman Brown',
    'Landon Fowler',
    'Evie - Mai Rennie',
    'Zidan Hendricks',
    'Blane Greenaway',
    'Salahuddin Eastwood',
    'Tayla Alston',
    'Arley Valencia',
    'Darcie Peacock',
    'Sakina Rahman',
    'Jill Bruce',
    'Donnie Grey',
    'Jackson Gentry',
    'Sophia - Rose Cuevas',
    'Ronaldo French',
    'Zakariya Stevenson',
    'Kara Terry',
    'Brendan Peterson',
    'Kamile Strong',
    'Leonard Johnston',
    'Camille Cullen',
    'Nola Thorne',
    'Chelsie Truong',
    'Safah Amos',
    'Aqeel Laing',
    'Mckenzie Cornish',
    'Serenity Anthony',
    'Pascal Beach',
    'Meerab Aguirre',
    'Vihaan Hassan',
    'Azeem Busby',
    'Kenneth Nicholson',
    'Adil Hyde',
    'Jules Schaefer',
    'Rhiann Carr',
    'Rihanna Whitfield',
    'Kerri Sanders',
    'Nella Palmer',
    'Siena Mccarty',
    'Cherry Chamberlain',
    'Curtis Mackenzie',
    'Roxanne Abbott',
    'Reanna Yang',
    'Myra Cole',
    'Eleni Correa',
    'Zayaan Sargent',
    'Aoife Crawford',
    'Ayana Graves',
    'Chad Fulton',
    'Matthew Bannister',
    'Amani Cunningham',
    'Sayed Humphrey'
];

module.exports = function () {
    var x = Math.floor(Math.random() * names.length);
    return names[x];
};


/***/ }),

/***/ 0:
/*!***************************************!*\
  !*** multi ./src/client/CardsAgainst ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/client/CardsAgainst */"./src/client/CardsAgainst.js");


/***/ })

/******/ });
//# sourceMappingURL=main-bundle.js.map