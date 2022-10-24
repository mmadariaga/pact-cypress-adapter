"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var pactConfig = {
    consumerName: 'customer',
    providerName: 'provider'
};
var setupPact = function (consumerName, providerName) {
    pactConfig['consumerName'] = consumerName;
    pactConfig['providerName'] = providerName;
};
var ignoreDefaultBlocklist = Cypress.env('ignoreDefaultBlocklist') || false;
var globalBlocklist = Cypress.env('headersBlocklist') || [];
var headersBlocklist = ignoreDefaultBlocklist
    ? globalBlocklist
    : __spreadArray(__spreadArray([], globalBlocklist, true), constants_1.AUTOGEN_HEADER_BLOCKLIST, true);
var setupPactHeaderBlocklist = function (headers) {
    headersBlocklist = __spreadArray(__spreadArray([], headers, true), headersBlocklist, true);
};
var interceptDataMap = {};
var usePactIntercept = function (option, alias) {
    cy.intercept(option.method, option.url, option.response).as(alias);
    interceptDataMap["@".concat(alias)] = option;
};
var usePactWait = function (alias) {
    var _a;
    var formattedAlias = (0, utils_1.formatAlias)(alias);
    var matchingRules = {};
    if (interceptDataMap["@".concat(alias)]) {
        matchingRules.matchingRules = (_a = interceptDataMap["@".concat(alias)]) === null || _a === void 0 ? void 0 : _a.matchingRules;
    }
    // Cypress versions older than 8.2 do not have a currentTest objects
    var testCaseTitle = Cypress.currentTest ? Cypress.currentTest.title : '';
    //NOTE: spread only works for array containing more than one item
    if (formattedAlias.length > 1) {
        cy.wait(__spreadArray([], formattedAlias, true)).spread(function () {
            var intercepts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                intercepts[_i] = arguments[_i];
            }
            intercepts.forEach(function (intercept, index) {
                (0, utils_1.writePact)(__assign({ intercept: intercept, testCaseTitle: "".concat(testCaseTitle, "-").concat(formattedAlias[index]), pactConfig: pactConfig, blocklist: headersBlocklist }, matchingRules));
            });
        });
    }
    else {
        cy.wait(formattedAlias).then(function (intercept) {
            var flattenIntercept = Array.isArray(intercept) ? intercept[0] : intercept;
            (0, utils_1.writePact)(__assign({ intercept: flattenIntercept, testCaseTitle: "".concat(testCaseTitle), pactConfig: pactConfig, blocklist: headersBlocklist }, matchingRules));
        });
    }
};
var requestDataMap = {};
var usePactGet = function (alias) {
    var formattedAlias = (0, utils_1.formatAlias)(alias);
    // Cypress versions older than 8.2 do not have a currentTest objects
    var testCaseTitle = Cypress.currentTest ? Cypress.currentTest.title : '';
    formattedAlias.forEach(function (alias) {
        cy.get(alias).then(function (response) {
            var fullRequestAndResponse = {
                request: {
                    method: requestDataMap[alias].method,
                    url: requestDataMap[alias].url,
                    headers: response.requestHeaders,
                    body: response.requestBody
                },
                response: {
                    body: response.body,
                    statusCode: response.status,
                    headers: response.headers,
                    statusText: response.statusText
                }
            };
            (0, utils_1.writePact)({
                intercept: fullRequestAndResponse,
                testCaseTitle: "".concat(testCaseTitle, "-").concat(alias),
                pactConfig: pactConfig,
                blocklist: headersBlocklist
            });
        });
    });
};
var usePactRequest = function (option, alias) {
    cy.request(option).as(alias);
    // Store request url and method to a global item as cy.request.get() doesn't
    // provide related information
    requestDataMap["@".concat(alias)] = option;
};
Cypress.Commands.add('usePactWait', usePactWait);
Cypress.Commands.add('usePactRequest', usePactRequest);
Cypress.Commands.add('usePactIntercept', usePactIntercept);
Cypress.Commands.add('usePactGet', usePactGet);
Cypress.Commands.add('setupPact', setupPact);
Cypress.Commands.add('setupPactHeaderBlocklist', setupPactHeaderBlocklist);
//# sourceMappingURL=index.js.map