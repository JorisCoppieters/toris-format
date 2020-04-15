# toris-format

toris-format is a Node utility for formatting SASS, HTML, Angular1 HTML and Angular2 HTML

### Trello Board

https://trello.com/b/2mSSarol/product-toris-format

### Installation
(requires [Node.js](https://nodejs.org/) v4+)
```sh
$ npm install toris-format
```

# Examples

Here are some example usages

### Print out well formatted HTML

Create and run a node file with:
```js
const format = require('toris-format');
const unformattedHTML = `
<html>
<h1 style="font-weight:bold" class="title">HI</h1>
   </html>
`
const config = {
    definition_type: 'HTML'
}
const formattedHTML = format.formatContents(unformattedHTML, config);
console.log(formattedHTML);
```

This will return:
```sh
<html>
    <h1
        class="title"
        style="font-weight:bold">HI</h1>
</html>
```

### Print out well formatted CSS

Create and run a node file with:
```js
const format = require('toris-format');
const unformattedCSS = `
.class {
    padding-left: -$unit;
padding-top: 2 -$unit;
padding-right: -2 2 -$unit;

width:-2; border: 0 -2px 0 0;
margin-top: -($unit / 2);
margin-bottom: -(1.25  *     $unit);
  padding: (0.2 * $unit) $unit;

}
`
const config = {
    definition_type: 'SCSS'
}
const formattedCSS = format.formatContents(unformattedCSS, config);
console.log(formattedCSS);
```

This will return:
```css
.class {
    padding-left: -$unit;
    padding-top: 2 -$unit;
    padding-right: -2 2 -$unit;
    width: -2;
    border: 0 -2px 0 0;
    margin-top: -($unit / 2);
    margin-bottom: -(1.25 * $unit);
    padding: (0.2 * $unit) $unit;
}
```

### Print out well formatted content from a file

Create and run a node file with:
```js
const format = require('toris-format');
const filePath = './file.css'
const config = {} // Don't need to set the definition type since this gets deduced from the file extension
const formatted = format.formatFile(filePath, config);
// To overwrite file, you'll need to write the formatted contents to the file
```

# Configuration Options

### Default Configuration for html formatting

```js
const config = {
    definition_type: 'HTML',
    add_noopener_noreferrer: false, // true or false
    angular_version: 1, // 1 or 2
    remove_css: false, // true or false
    allow_empty_files: false, // true or false
    indent: '    ', // spaces, tabs etc...
    convert_line_endings: true, // true or false
    line_ending: '\n', // \n, \r, \r\n
}
```

#### definition_type
Either `HTML` or `SCSS`, set to `HTML` for formatting HTML content
#### add_noopener_noreferrer
If set to true, adds `noopener noreferrer` to links with the `_blank` target
See [this link](https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/) for more details
#### angular_version
Which angular syntax to use for formatting, 1 refers to `AngularJS`/`Angular1`, 2 refers to `Angular`/`Angular2,3,4, etc...`
#### remove_css
Removes inline CSS from HTML and leaves a comment in place
#### allow_empty_files
Shows a warning on empty content
#### indent
The indent to use for formatting, can be any string, but spaces or tabs are recommended
#### convert_line_endings
If set to true, converts line endings
#### line_ending
Line ending to use for conversion if `convert_line_endings` is true, one of `\n`, `\r`, `\r\n`


### Default Configuration for css/scss formatting

```js
const config = {
    definition_type: 'SCSS',
    allow_empty: false, // true or false
    convert_line_endings: true, // true or false
    line_ending: '\n', // \n, \r, \r\n
}
```

#### definition_type
Either `HTML` or `SCSS`, set to `SCSS` for formattting CSS/SCSS content
#### allow_empty
Shows a warning on empty content
#### indent
The indent to use for formatting, can be any string, but spaces or tabs are recommended
#### convert_line_endings
If set to true, converts line endings
#### line_ending
Line ending to use for conversion if `convert_line_endings` is true, one of `\n`, `\r`, `\r\n`


# Todos
* Still more documentation to come

License
----

ISC
