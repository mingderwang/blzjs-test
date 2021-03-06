[![Build Status](https://travis-ci.org/bluzelle/blzjs.svg?branch=devel)](https://travis-ci.org/bluzelle/blzjs) [![Coverage Status](https://coveralls.io/repos/github/bluzelle/blzjs/badge.svg)](https://coveralls.io/github/bluzelle/blzjs)
<a href="https://bluzelle.com/"><img src='https://raw.githubusercontent.com/bluzelle/api/master/source/images/Bluzelle%20-%20Logo%20-%20Big%20-%20Colour.png' alt="Bluzelle" style="width: 100%"/></a>

**blzjs** is a JavaScript library that can be used to access the Bluzelle database service.

# blzjs Installation

You will generally use *blzjs* from code running under the **Node.js** platform. For instructions on installing Node.js on your platform please see http://nodejs.org. Use of *blzjs* in web browser content is not currently supported.

You can use blzjs either in-place, or by building a library. In either case you will want to get the latest stable version of blzjs by doing the following:
```
git clone https://github.com/bluzelle/blzjs
```
This will create a directory named *blzjs* and download the library code to it.

For in-place use, simply create a JavaScript source file and include the following at the top of the file:
```
const { bluzelle } = require('path_to_blzjs/main.js');
```
You can then use the various functions described below.

To build a library and use it locally, you will need **npm** and **npx** installed. Please see the relevant documentation for your platform for instructions on how to do that.

You will then do the following:
```
cd blzjs
npm install
npx webpack
sudo npm link
```
Then in the directory where you create your source code, run
```
npm link bluzelle
```
And at the top of your source fill add the following:
```
const { bluzelle } = require ('bluzelle')
```

# Getting Started

The file crud.js in the *samples* directory contains example code that demonstrates how to use the blzjs API.

In general, you must initialize blzjs before calling any other functions. Do the following (using your own configuration parameters as applicable) to initialize:
```
let bz = await bluzelle({
        address:  my_account_address,
        mnemonic: my_mnemonic,
        uuid:     my_uuid,
        endpoint: my_endpoint,
        chain_id: my_chain_id
    });
```  
This performs some initial checks, retrieves your account information, and returns an object through which you can call the rest of the API functions.

You may now use the functions described below to perform database operations, as well as retrieve account and status information.

# blzjs API documentation
Read below for detailed documentation on how to use the Bluzelle database service.

![#1589F0](https://placehold.it/15/1589F0/000000?text=+) The Bluzelle JavaScript library works with promises (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to model asynchronous behavior. Ensure that dependent calls to the Bluzelle database are within `.then()` blocks or within asynchronous functions (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). Also ensure that promises exceptions are caught and handled.

![#1589F0](https://placehold.it/15/1589F0/000000?text=+) Keys and values in the Bluzelle database are plain strings to ensure compatibility for all forms of serialization. JavaScript applications will probably want to use `JSON.stringify(obj)` and `JSON.parse(str)` to convert object data to and from string format. Please note: keys may not contain the forward-slash (/) character.

![#1589F0](https://placehold.it/15/1589F0/000000?text=+) Some API functions take *gas_info* as a parameter. This is a JavaScript object containing parameters related to gas consumption as follows:
```javascript
{
    'max_gas': '0', // maximum amount of gas to consume for this call (integer)
    'max_fee': '0', // maximum amount to charge for this call (integer, in ubnt)
    'gas_price': '0' // maximum price to pay for gas (integer, in ubnt)
};
````
All values are optional. The `max_gas` value will always be honored if present, otherwise a default value will be used. If both `max_fee` and `gas_price` are specified, `gas_price` will be ignored and calculated based on the provided `max_fee`.

![#1589F0](https://placehold.it/15/1589F0/000000?text=+) Some API functions take *lease_info* as a parameter. This is a JavaScript object containing parameters related to the minimum time a key should be maintained in the database, as follows:
```javascript
{
    'days':    '0', // number of days (integer)
    'hours':   '0', // number of hours (integer)
    'minutes': '0'  // number of minutes (integer)
    'seconds': '0'  // number of seconds (integer)
};
````
All values are optional. If none are provided a default value of 10 days will be used.


![#1589F0](https://placehold.it/15/1589F0/000000?text=+) The example code in the `samples` directory requires Node.js in order to run. For instructions on how to install Node.js for your platform, please see http://nodejs.org

The samples require configuration to be set in the file `blz-config.js`. You can copy and modify the `blz-config.js.sample` file for this purpose.

## Exports

### bluzelle\({...}\)

Configures the Bluzelle connection. This may be called multiple times to create multiple clients.

```javascript
const {bluzelle} = require('bluzelle');

const api = await bluzelle({
    address: 'bluzelle1xhz23a58mku7ch3hx8f9hrx6he6gyujq57y3kp',
    mnemonic: 'volcano arrest ceiling physical concert sunset absent hungry tobacco canal census era pretty car code crunch inside behind afraid express giraffe reflect stadium luxury',
    endpoint: "http://localhost:1317",
    uuid:     "20fc19d4-7c9d-4b5c-9578-8cedd756e0ea",
    chain_id: "bluzelle"
});
```

| Argument | Description |
| :--- | :--- |
| **address** | The address of your Bluzelle account |
| **mnemonic** | The mnemonic of the private key for your Bluzelle account |
| endpoint | \(Optional\) The hostname and port of your rest server. Default: http://localhost:1317 |
| uuid | \(Optional\) Bluzelle uses `UUID`'s to identify distinct databases on a single swarm. We recommend using [Version 4 of the universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_%28random%29). Defaults to the account address. |
| chain_id | \(Optional\) The chain id of your Bluzelle account. Default: bluzelle |

`bluzelle` is the only export of the Bluzelle library. The calls below are methods of the object generated by calling `bluzelle`.

## General Functions

### version\()

Retrieve the version of the Bluzelle service.

```javascript
// promise syntax
api.version().then(() => { ... }, error => { ... });

// async/await syntax
await api.version();
```

Returns a promise resolving to a string containing the version information, e.g.

```
0.0.0-39-g8895e3e
```

Throws an exception if a response is not received from the connection.


### account\()

Retrieve information about the currently active Bluzelle account.

```javascript
// promise syntax
api.account().then(() => { ... }, error => { ... });

// async/await syntax
await api.account();
```

Returns a promise resolving to a JSON object representing the account information, e.g.

```
{ address: 'bluzelle1lgpau85z0hueyz6rraqqnskzmcz4zuzkfeqls7',
  coins: [ { denom: 'bnt', amount: '9899567400' } ],
  public_key: 'bluzellepub1addwnpepqd63w08dcrleyukxs4kq0n7ngalgyjdnu7jpf5khjmpykskyph2vypv6wms',
  account_number: 3,
  sequence: 218 }
```

Throws an exception if a response is not received from the connection.



## Database Functions

### create\(key, value, gas_info [, lease_info]\)

Create a field in the database.

```javascript
// promise syntax
api.create('mykey', '{ a: 13 }', {gas_price: 10}, {days: 100}).then(() => { ... }, error => { ... });

// async/await syntax
await api.create('mykey', '{ a: 13 }', {gas_price: 10}, {days: 100});
```

| Argument | Description |
| :--- | :--- |
| key | The name of the key to create |
| value | The string value to set the key |
| gas_info | Object containing gas parameters (see above) |
| lease_info (optional) | Minimum time for key to remain in database (see above) |

Returns a promise resolving to nothing.

Throws an exception when a response is not received from the connection, the key already exists, or invalid value.

### read\(key, prove\)

Retrieve the value of a key without consensus verification. Can optionally require the result to have a cryptographic proof (slower).

```javascript
// promise syntax
api.read('mykey').then(value => { ... }, error => { ... });

// async/await syntax
const value = await api.read('mykey');
```

| Argument | Description |
| :--- | :--- |
| key | The key to retrieve |
| prove | A proof of the value is required from the network (requires 'config trust-node false' to be set) |

Returns a promise resolving the string value of the key.

Throws an exception when the key does not exist in the database.
Throws an exception when the prove is true and the result fails verification.

### txRead\(key, gas_info\)

Retrieve the value of a key via a transaction (i.e. uses consensus).

```javascript
// promise syntax
api.txRead('mykey', {gas_price: 10}).then(value => { ... }, error => { ... });

// async/await syntax
const value = await api.txRead('mykey', {gas_price: 10});
```

| Argument | Description |
| :--- | :--- |
| key | The key to retrieve |
| gas_info | Object containing gas parameters (see above) |

Returns a promise resolving the string value of the key.

Throws an exception when the key does not exist in the database.

### update\(key, value, gas_info [, lease_info]\)

Update a field in the database.

```javascript
// promise syntax
api.update('mykey', '{ a: 13 }', {gas_price: 10}, {days: 100}).then(() => { ... }, error => { ... });

// async/await syntax
await api.update('mykey', '{ a: 13 }, {gas_price: 10}', {days: 100});
```

| Argument | Description |
| :--- | :--- |
| key | The name of the key to create |
| value | The string value to set the key |
| gas_info | Object containing gas parameters (see above) |
| lease_info (optional) | Positive or negative amount of time to alter the lease by. If not specified, the existing lease will not be changed. |

Returns a promise resolving to nothing.

Throws an exception when the key doesn't exist, or invalid value.

### delete\(key, gas_info\)

Delete a field from the database.

```javascript
// promise syntax
api.delete('mykey', {gas_price: 10}).then(() => { ... }, error => { ... });

// async/await syntax
await bluzelle.delete('mykey', {gas_price: 10});
```

| Argument | Description |
| :--- | :--- |
| key | The name of the key to delete |
| gas_info | Object containing gas parameters (see above) |

Returns a promise resolving to nothing.

Throws an exception when the key is not in the database.

### has\(key\)

Query to see if a key is in the database. This function bypasses the consensus and cryptography mechanisms in favor of speed.


```javascript
// promise syntax
api.has('mykey').then(hasMyKey => { ... }, error => { ... });

// async/await syntax
const hasMyKey = await api.has('mykey');
```

| Argument | Description |
| :--- | :--- |
| key | The name of the key to query |

Returns a promise resolving to a boolean value - `true` or `false`, representing whether the key is in the database.

### txHas\(key, gas_info\)

Query to see if a key is in the database via a transaction (i.e. uses consensus).

```javascript
// promise syntax
api.txHas('mykey', {gas_price: 10}).then(hasMyKey => { ... }, error => { ... });

// async/await syntax
const hasMyKey = await api.txHas('mykey', {gas_price: 10});
```

| Argument | Description |
| :--- | :--- |
| key | The name of the key to query |
| gas_info | Object containing gas parameters (see above) |

Returns a promise resolving to a boolean value - `true` or `false`, representing whether the key is in the database.

### keys\(\)

Retrieve a list of all keys. This function bypasses the consensus and cryptography mechanisms in favor of speed.

```javascript
// promise syntax
api.keys().then(keys => { ... }, error => { ... });

// async/await syntax
const keys = await api.keys();
```

Returns a promise resolving to an array of strings. ex. `["key1", "key2", ...]`.

### txKeys\(gas_info\)

Retrieve a list of all keys via a transaction (i.e. uses consensus).

```javascript
// promise syntax
api.txKeys({gas_price: 10}).then(keys => { ... }, error => { ... });

// async/await syntax
const keys = await api.txKeys({gas_price: 10});
```

| Argument | Description |
| :--- | :--- |
| gas_info | Object containing gas parameters (see above) |

Returns a promise resolving to an array of strings. ex. `["key1", "key2", ...]`.

### rename\(key, new_key, gas_info\)

Change the name of an existing key.

```javascript
// promise syntax
api.rename("key", "newkey", {gas_price: 10}).then(() => { ... }, error => { ... });

// async/await syntax
await api.rename("key", "newkey", {gas_price: 10});
```

| Argument | Description |
| :--- | :--- |
| key | The name of the key to rename |
| new_key | The new name for the key |
| gas_info | Object containing gas parameters (see above) |

Returns a promise resolving to nothing.

Throws an exception if the key doesn't exist.


| Argument | Description |
| :--- | :--- |
| key | The name of the key to query |

Returns a promise resolving to a boolean value - `true` or `false`, representing whether the key is in the database.

### count\(\)

Retrieve the number of keys in the current database/uuid. This function bypasses the consensus and cryptography mechanisms in favor of speed.

```javascript
// promise syntax
api.count().then(number => { ... }, error => { ... });

// async/await syntax
const number = await api.count();
```

Returns a promise resolving to an integer value.

### txCount\(gas_info\)

Retrieve the number of keys in the current database/uuid via a transaction.

```javascript
// promise syntax
api.txCount({gas_price: 10}).then(number => { ... }, error => { ... });

// async/await syntax
const number = await api.txCount({gas_price: 10});
```

| Argument | Description |
| :--- | :--- |
| gas_info | Object containing gas parameters (see above) |

Returns a promise resolving to an integer value.

### deleteAll\(gas_info\)

Remove all keys in the current database/uuid.

```javascript
// promise syntax
api.deleteAll({gas_price: 10}).then(() => { ... }, error => { ... });

// async/await syntax
await api.deleteAll({gas_price: 10});
```

| Argument | Description |
| :--- | :--- |
| gas_info | Object containing gas parameters (see above) |

Returns a promise resolving to nothing.

### keyValues\(\)

Enumerate all keys and values in the current database/uuid. This function bypasses the consensus and cryptography mechanisms in favor of speed.

```javascript
// promise syntax
api.keyValues().then(kvs => { ... }, error => { ... });

// async/await syntax
const kvs = await api.keyValues();
```

Returns a promise resolving to a JSON array containing key/value pairs, e.g.

```
[{"key": "key1", "value": "value1"}, {"key": "key2", "value": "value2"}]
```

### txKeyValues\(gas_info\)

Enumerate all keys and values in the current database/uuid via a transaction.

```javascript
// promise syntax
api.txKeyValues({gas_price: 10}).then(kvs => { ... }, error => { ... });

// async/await syntax
const kvs = await api.txKeyValues({gas_price: 10});
```

| Argument | Description |
| :--- | :--- |
| gas_info | Object containing gas parameters (see above) |

Returns a promise resolving to a JSON array containing key/value pairs, e.g.

```
[{"key": "key1", "value": "value1"}, {"key": "key2", "value": "value2"}]
```

### multiUpdate\(key_values, gas_info\)

Update multiple fields in the database.

```javascript
// promise syntax
api.multiUpdate([{key: "key1", value: "value1"}, {key: "key2", value: "value2"}], {gas_price: 10}).then(() => { ... }, error => { ... });

// async/await syntax
await api.multiUpdate([{key: "key1", value: "value1"}, {key: "key2", value: "value2"}, {gas_price: 10}');
```

| Argument | Description |
| :--- | :--- |
| key_values | An array of objects containing keys and values (see example avove) |
| gas_info | Object containing gas parameters (see above) |

Returns a promise resolving to nothing.

Throws an exception when any of the keys doesn't exist.


### getLease\(key\)

Retrieve the minimum time remaining on the lease for a key. This function bypasses the consensus and cryptography mechanisms in favor of speed.

```javascript
// promise syntax
api.getLease('mykey').then(value => { ... }, error => { ... });

// async/await syntax
const value = await api.getLease('mykey');
```

| Argument | Description |
| :--- | :--- |
| key | The key to retrieve the lease information for |

Returns a promise resolving the minimum length of time remaining for the key's lease, in seconds.

Throws an exception when the key does not exist in the database.

### txGetLease\(key, gas_info\)

Retrieve the minimum time remaining on the lease for a key, using a transaction.

```javascript
// promise syntax
api.txGetLease('mykey', {gas_price: 10}).then(value => { ... }, error => { ... });

// async/await syntax
const value = await api.txGetLease('mykey', {gas_price: 10});
```

| Argument | Description |
| :--- | :--- |
| key | The key to retrieve the lease information for |
| gas_info | Object containing gas parameters (see above) |

Returns a promise resolving the minimum length of time remaining for the key's lease, in seconds.

Throws an exception when the key does not exist in the database.

### renewLease\(key, gas_info[, lease_info]\)

Update the minimum time remaining on the lease for a key.

```javascript
// promise syntax
api.renewLease('mykey', {gas_price: 10}, {days: 100}).then(value => { ... }, error => { ... });

// async/await syntax
const value = await api.renewLease('mykey', {gas_price: 10}, {days: 100});
```

| Argument | Description |
| :--- | :--- |
| key | The key to retrieve the lease information for |
| gas_info | Object containing gas parameters (see above) |
| lease_info (optional) | Minimum time for key to remain in database (see above) |

Returns a promise resolving the minimum length of time remaining for the key's lease.

Throws an exception when the key does not exist in the database.


### renewLeaseAll\(gas_info[, lease_info]\)

Update the minimum time remaining on the lease for all keys.

```javascript
// promise syntax
api.renewLease('mykey', {gas_price: 10}, {days: 100}).then(value => { ... }, error => { ... });

// async/await syntax
const value = await api.renewLease('mykey', {gas_price: 10}, {days: 100});
```

| Argument | Description |
| :--- | :--- |
| gas_info | Object containing gas parameters (see above) |
| lease_info (optional) | Minimum time for key to remain in database (see above) |

Returns a promise resolving the minimum length of time remaining for the key's lease.

Throws an exception when the key does not exist in the database.


### getNShortestLeases\(n\)

Retrieve a list of the n keys in the database with the shortest leases.  This function bypasses the consensus and cryptography mechanisms in favor of speed.

```javascript
// promise syntax
api.getNShortestLeases(10).then(keys => { ... }, error => { ... });

// async/await syntax
const keys = await api.getNShortestLeases(10);
```

| Argument | Description |
| :--- | :--- |
| n | The number of keys to retrieve the lease information for |

Returns a JSON array of objects containing key, lease (in seconds), e.g.
```
[ { key: "mykey", lease: { seconds: "12345" } }, {...}, ...]
```

### txGetNShortestLeases\(n, gas_info\)

Retrieve a list of the N keys/values in the database with the shortest leases, using a transaction.

```javascript
// promise syntax
api.txGetNShortestLeases(10).then(keys => { ... }, error => { ... });

// async/await syntax
const keys = await api.txGetNShortestLeases(10);
```

| Argument | Description |
| :--- | :--- |
| n | The number of keys to retrieve the lease information for |
| gas_info | Object containing gas parameters (see above) |

Returns a JSON array of objects containing key, lifetime (in seconds), e.g.
```
[ { key: "mykey", lifetime: "12345" }, {...}, ...]
```
