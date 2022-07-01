# Introduction

UI Components.

# XcUIDialog

```
let dialog = new XcUIDialog( {
      content : `
        <textarea rows="10" cols="50">
        </textarea>
        <hr/>
        <button data-id="run" class = "btn btn-outline-primary">▶</button>
        <p data-id="error" class="text-danger" style="height:1em;"> </p>
        `,
      title: `MyTitle`
    });
```

## constructor

`constructor({content = '', title = '', open = false} = {})`

* content HTML content string 
* title string

## title (getter)

Get the title

`get title()`

## title (setter)

`set title(val)`

* val The title string

## setContent

`setContent(content)`
* content The HTML content string.

Set the HTML content of the dialog.

# XcUIDisplay

This is a HUD like message display board.

```
      <xcui-display id="test" style="position: fixed; left: 0em; top: 0em; width: fit-content; height: 5em; max-width: 50em; margin: 0.5em; overflow: auto; overflow-wrap: break-word; word-wrap: break-word; word-break:break-word;"></xcui-display>
```

```
    let outputDisplay = document.getElementById("test");
    outputDisplay.log(`Do not forget to logout if you have finished your tasks.`);

    for (var i=0; i<5; i += 1) {
      outputDisplay.warn("Hello, %s. You've called me %d times.", "Bob", i+1);
    }
```

## constructor

`constructor()`

## clear

`clear()`

Clear all of the content.

## log

`log(...args)`
* args msg A JavaScript string containing zero or more substitution strings.

Print messages with the log style. The message may be a single string (with optional substitution values).

## warn

`warn(...args)`

* args msg A JavaScript string containing zero or more substitution strings.

Print messages with the warning style. The message may be a single string (with optional substitution values).

## error

`error(...args)`

* args msg A JavaScript string containing zero or more substitution strings.

Print messages with the error style. The message may be a single string (with optional substitution values).

## debug

`debug(...args)`

* args msg A JavaScript string containing zero or more substitution strings.

Print messages with the debug style. The message may be a single string (with optional substitution values).

## info

`info(...args)`

* args msg A JavaScript string containing zero or more substitution strings.

Print messages with the info style. The message may be a single string (with optional substitution values).

## showElement

`showElement(elem)`

* elem An HTML element

```
    let outputDisplay = document.getElementById("test");

    let p = document.createElement('p');
    p.innerText = str;
    p.style.cssText = 'margin: 0.5em; padding: 0em;';
    
    outputDisplay.showElement(p);
```
