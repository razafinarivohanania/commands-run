# Overview

It's simple tool to run many command lines in one command line

# Installation

Run command line :
```
npm i
```

# Use

* Copy `commands.template.json` in the same directory and rename it `commands.json`. Replace content with your commands list.
* Run command line :
```
npm start [group command name]
```

# Example

* Create a simple file `count.js` in the same directory

```javascript
const args = process.argv.slice(2);

/**
 * First argument will be used as total count
 */
const total = args[0];

/**
 * Second argument will be used as sleep time
 */
const sleep = args[1];

let index = 0;

function count() {
    index++;
    
    console.log(`Count ${index}`);
    if (index >= total)
        return;

    setTimeout(count, sleep);
}

/**
 * Count from 1 to total in sleep interval time
 */
count();
```

* Create `commands.json` in the same directory

```json
{
    "rapidCount": [
        {
            "command": "node count 10 500",
            "name": "First count"
        },
        {
            "command": "node test 10 300",
            "name": "Second count"
        }
    ],
    "slowCount" : [
        {
            "command": "node count 5 5000",
            "name": "First count",
            "timeout" : 1000
        },
        {
            "command": "node count 5 3000",
            "name": "Second count"
        },
        {
            "command": "node count 3 7000",
            "name": "Third count"
        }
    ]
}
```

* Let's run the slow count :D

```
npm start slowCount
```

It will output something like :

```
[DEBUG First count] > Run command [node count 5 5000] at [your directory]
[DEBUG First count] : Count 1
[DEBUG First count] > Timeout [1000 ms] reached
[DEBUG Second count] > Run command [node count 5 3000] at [your directory]
[DEBUG Second count] : Count 1
[DEBUG First count] : Count 2
[DEBUG Second count] : Count 2
[DEBUG Second count] : Count 3
[DEBUG First count] : Count 3
[DEBUG Second count] : Count 4
[DEBUG Second count] : Count 5
[DEBUG Second count] > Command closed with code [0]
[DEBUG Third count] > Run command [node count 3 7000] at [your directory]
[DEBUG Third count] : Count 1
[DEBUG First count] : Count 4
[DEBUG First count] : Count 5
[DEBUG First count] > Command closed with code [0]
[DEBUG Third count] : Count 2
[DEBUG Third count] : Count 3
[DEBUG Third count] > Command closed with code [0]

```