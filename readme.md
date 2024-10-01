<!-- NOTE: `spec.txt` is the source, don’t edit `readme.md` manually. -->

# MDX

> 🪦 **Archived**: this document is not maintained.
> This document was made jointly with `micromark`,
> which was later also turned into `markdown-rs`.
> At present,
> I don’t have the bandwidth to maintain 2 reference parsers
> *and* a spec.
>
> Markdown 💛 JSX
>
> This document is currently in progress.
> See also [micromark][micromark], [cmsm][cmsm], and [mdxjs][mdxjs].

## Contents

*   [1 Background](#1-background)
    *   [1.1 What is MDX?](#11-what-is-mdx)
    *   [1.2 Who created MDX?](#12-who-created-mdx)
    *   [1.3 Why MDX?](#13-why-mdx)
*   [2 Overview](#2-overview)
*   [3 MDX](#3-mdx)
    *   [3.1 Hello World](#31-hello-world)
    *   [3.2 Markdown](#32-markdown)
    *   [3.3 JSX](#33-jsx)
    *   [3.4 MDX](#34-mdx)
    *   [3.5 Syntax](#35-syntax)
*   [4 Parsing](#4-parsing)
    *   [4.1 Characters](#41-characters)
    *   [4.2 Infra](#42-infra)
    *   [4.3 Effects](#43-effects)
*   [5 State machine](#5-state-machine)
    *   [5.1 Before MDX block state](#51-before-mdx-block-state)
    *   [5.2 Before MDX span state](#52-before-mdx-span-state)
    *   [5.3 After MDX block state](#53-after-mdx-block-state)
    *   [5.4 After MDX span state](#54-after-mdx-span-state)
    *   [5.5 Data state](#55-data-state)
    *   [5.6 Before name state](#56-before-name-state)
    *   [5.7 Before closing tag name state](#57-before-closing-tag-name-state)
    *   [5.8 Primary name state](#58-primary-name-state)
    *   [5.9 After primary name state](#59-after-primary-name-state)
    *   [5.10 Before member name state](#510-before-member-name-state)
    *   [5.11 Member name state](#511-member-name-state)
    *   [5.12 After member name state](#512-after-member-name-state)
    *   [5.13 Before local name state](#513-before-local-name-state)
    *   [5.14 Local name state](#514-local-name-state)
    *   [5.15 After local name state](#515-after-local-name-state)
    *   [5.16 Before attribute state](#516-before-attribute-state)
    *   [5.17 Attribute expression state](#517-attribute-expression-state)
    *   [5.18 Attribute name state](#518-attribute-name-state)
    *   [5.19 After attribute name state](#519-after-attribute-name-state)
    *   [5.20 Before attribute local name state](#520-before-attribute-local-name-state)
    *   [5.21 Attribute local name state](#521-attribute-local-name-state)
    *   [5.22 After attribute local name state](#522-after-attribute-local-name-state)
    *   [5.23 Before attribute value state](#523-before-attribute-value-state)
    *   [5.24 Attribute value double quoted state](#524-attribute-value-double-quoted-state)
    *   [5.25 Attribute value single quoted state](#525-attribute-value-single-quoted-state)
    *   [5.26 Attribute value expression state](#526-attribute-value-expression-state)
    *   [5.27 Self-closing state](#527-self-closing-state)
    *   [5.28 Expression state](#528-expression-state)
    *   [5.29 Text state](#529-text-state)
    *   [5.30 Accent quoted open state](#530-accent-quoted-open-state)
    *   [5.31 Accent quoted state](#531-accent-quoted-state)
    *   [5.32 Accent quoted close state](#532-accent-quoted-close-state)
    *   [5.33 Tilde quoted open state](#533-tilde-quoted-open-state)
    *   [5.34 Tilde quoted state](#534-tilde-quoted-state)
    *   [5.35 Tilde quoted close state](#535-tilde-quoted-close-state)
*   [6 Adapter](#6-adapter)
    *   [6.1 Enter `'tag'` adapter](#61-enter-tag-adapter)
    *   [6.2 Enter `'closingSlash'` adapter](#62-enter-closingslash-adapter)
    *   [6.3 Enter `'attributeExpression'` adapter](#63-enter-attributeexpression-adapter)
    *   [6.4 Enter `'attributeName'` adapter](#64-enter-attributename-adapter)
    *   [6.5 Enter `'selfClosingSlash'` adapter](#65-enter-selfclosingslash-adapter)
    *   [6.6 Exit `'closingSlash'` adapter](#66-exit-closingslash-adapter)
    *   [6.7 Exit `'primaryName'` adapter](#67-exit-primaryname-adapter)
    *   [6.8 Exit `'memberName'` adapter](#68-exit-membername-adapter)
    *   [6.9 Exit `'localName'` adapter](#69-exit-localname-adapter)
    *   [6.10 Exit `'name'` adapter](#610-exit-name-adapter)
    *   [6.11 Exit `'attributeName'` adapter](#611-exit-attributename-adapter)
    *   [6.12 Exit `'attributeLocalName'` adapter](#612-exit-attributelocalname-adapter)
    *   [6.13 Exit `'attributeValue'` adapter](#613-exit-attributevalue-adapter)
    *   [6.14 Exit `'attributeValueExpression'` adapter](#614-exit-attributevalueexpression-adapter)
    *   [6.15 Exit `'attributeExpression'` adapter](#615-exit-attributeexpression-adapter)
    *   [6.16 Exit `'selfClosingSlash'` adapter](#616-exit-selfclosingslash-adapter)
    *   [6.17 Exit `'tag'` adapter](#617-exit-tag-adapter)
    *   [6.18 Exit `'expression'` adapter](#618-exit-expression-adapter)
*   [7 Appendix](#7-appendix)
    *   [7.1 Syntax](#71-syntax)
    *   [7.2 Deviations from Markdown](#72-deviations-from-markdown)
    *   [7.3 Deviations from JSX](#73-deviations-from-jsx)
    *   [7.4 Common MDX gotchas](#74-common-mdx-gotchas)
*   [8 References](#8-references)
*   [9 Acknowledgments](#9-acknowledgments)
*   [10 License](#10-license)

## 1 Background

### 1.1 What is MDX?

MDX is the combination of [Markdown][commonmark] with [JSX][jsx].
This document defines a syntax for MDX (without JavaScript, [MDXjs][mdxjs] does
that) by describing how to parse it.

### 1.2 Who created MDX?

The idea of combining [Markdown][commonmark], [JavaScript][javascript], and [JSX][jsx] was
a collaborative effort by [Guillermo Rauch][mdx-rauchg] (**[@rauchg][rauchg]**),
[James K. Nelson][mdx-jamesknelson] (**[@jamesknelson][jamesknelson]**), [John
Otander][mdx-johno] (**[@johno][johno]**), Tim Neutkens (**[@timneutkens][timneutkens]**),
Brent Jackson (**[@jxnblk][jxnblk]**), Jessica Stokes (**[@ticky][ticky]**), and more.
Markdown was [created by John Gruber][md] (**[@gruber][gruber]**).
[CommonMark by John McFarlane et al.][commonmark] (**[@jgm][jgm]**) is a popular
variant.
JSX was [created by Sebastian Markbåge et al.][jsx] (**[@sebmarkbage][sebmarkbage]**) at
Facebook, Inc.

### 1.3 Why MDX?

Markdown does not have a syntax for custom components.
MDX solves this.

There are many languages objectively better than Markdown, however, Markdown
is great because:

*   It looks like what it means and is relatively easy to read
*   Although images are [confusing][confusing], most stuff is relatively simple to write
*   It’s loose and ambiguous: it may not work but you won’t get an error (great
    for someone posting a comment to a forum if they forgot an asterisk)

Markdown *does* have a way to extend it, HTML, but that has drawbacks:

*   HTML in Markdown is naïve, how it’s parsed sometimes doesn’t make sense
*   HTML is unsafe by default, so it’s sometimes (partially) unsupported
*   HTML and Markdown don’t mix well, resulting in confusing rules such as
    blank lines or `markdown="1"` attributes
*   HTML is coupled with browsers, Markdown is useful for other things too

The frontend world has an alternative to HTML: JSX.
JSX is great, amongst other things, because:

*   It has a relatively familiar syntax (like XML)
*   It’s agnostic to semantics and intended for compilers (can have any
    domain-specific meaning)
*   It’s strict and unambiguous (great if an editor forgot a slash somewhere, as
    they’ll get an error early, instead of a book going to print with broken
    stuff in it)

## 2 Overview

This document first talks about the MDX syntax for authors, in the following
section.
Further sections define the syntax in-depth and for developers.
The appendix includes sections on notable differences from Markdown and JSX,
and a list of common MDX gotchas.

## 3 MDX

This section explains MDX for authors.

### 3.1 Hello World

The smallest MDX example looks like this:

```markdown
# Hello, world!
```

It displays a heading saying “Hello, world!” on the page.
With MDX you can add components:

```jsx
<MyComponent># Hello, world!</MyComponent>
```

MDX syntax can be boiled down to being JSX in Markdown.
It’s a superset of Markdown syntax that supports JSX.

### 3.2 Markdown

Traditionally, Markdown is used to generate HTML.
Many developers like writing markup in Markdown as it often looks more like
what’s intended and it is typically terser.
Instead of the following HTML:

```html
<blockquote>
  <p>A block quote with <em>some</em> emphasis.</p>
</blockquote>
```

You can write the equivalent in Markdown (or MDX) like so:

```markdown
> A block quote with _some_ emphasis.
```

Markdown is good for **content**.
MDX supports [most standard Markdown syntax][markdown-deviations].
It’s important to understand Markdown in order to learn MDX.

### 3.3 JSX

Recently, more and more developers have started using [JSX][jsx] to generate HTML
markup.
JSX is typically combined with a frontend framework like React or Vue.
These frameworks add support for components, which let you change repeating
things like the following markup:

```html
<h2>Hello, Venus!</h2>
<h2>Hello, Mars!</h2>
```

…to JSX (or MDX) like this:

```jsx
<Welcome name="Venus" />
<Welcome name="Mars" />
```

JSX is good for **components**.
It makes repeating things more clear and allows for separation of concerns.
MDX supports [most standard JSX syntax][jsx-deviations].

### 3.4 MDX

MDX is the combination of Markdown and JSX, for example, like so:

````mdx
<MyComponent>> Block quote</MyComponent>

<MyCodeComponent>
  ```html
  <!doctype html>
  ```
</MyCodeComponent>

<MyOtherComponent>
  # Heading<Footnote id="1" />

  - List
  - Items
</MyOtherComponent>

<Image
  alt='Photo of Lilo sitting in a tiny box'
  src='lilo.png'
/>

<also-component {attribute expression} />

<math value={attribute value expression} />

{
  block expression
}

The sum of `1 + 1` as calculated by an inline expression is {1 + 1}.
````

### 3.5 Syntax

The syntax of MDX within Markdown is formally defined by how to parse in [§ 4
Parsing][parsing] and in further sections, relatively formally in [§ 7.1
Syntax][syntax]), and informally by example here.

As MDX is not tied to HTML or JavaScript, the following examples do not show
output examples in HTML, but instead show whether they are okay, or whether they
crash.

For ease of reading, block elements will be capitalized, whereas span elements
will be lowercase, in the following examples.
But, casing does not affect parsing.

#### 3.5.1 Block

A block of MDX is an element or expression that is both the first thing on its
opening line, and the last thing on its closing line.

A self-closing block tag:

```mdx
<Component />
```

The start and end can be on different lines:

```mdx
<Component
/>
```

An arbitrary number of lines can be between the start and end:

```mdx
<Component

/>
```

This also applies to elements with opening and closing tags:

```mdx
<Component>


</Component>
```

Expressions can also be blocks:

```mdx
{


}
```

Parent containers of components don’t count when figuring out if something is
the first or last thing, such as in a block quote, a list, or in another block
component:

```mdx
> <Component />

- <Component />

<Parent>
  <Child />
</Parent>
```

#### 3.5.2 Span

A span of MDX is an element or expression that is not a block: it’s either not
the first thing, or the last thing, or both:

```mdx
This span is preceded by other things: <component />

<component /> This span is followed by other things.

These rules also apply to expressions ({ such as this one }).
```

#### 3.5.3 Content

An MDX block element can contain further Markdown blocks, whereas an MDX span
element can contain further Markdown spans.

On a single line:

```mdx
<Component>> Block quote</Component>
```

With generous whitespace:

```mdx
<Component>
> Block quote
</Component>
```

With indentation:

```mdx
<Component>
  > Block quote
</Component>
```

Spans cannot contain blocks:

```mdx
<component>> this is not a block quote</component>, because it’s not in a block
element.

Nor is this a <component># heading</component>
```

Blocks will create paragraphs:

```mdx
<Component>**Strongly important paragraph in a component**.</Component>

This <component>**is strongly important text in a component**</component> in a
paragraph.
```

Which gets a bit confusing if you are expected HTML semantics (to MDX, elements
don’t have semantics, so `h2` has no special meaning):

```mdx
<h2>And this is a paragraph in a heading!</h2>
```

MDX expressions can contain arbitrary data, with the exception that there must
be a matching number opening braces (U+007B LEFT CURLY BRACE (`{`)) and closing braces (U+007D RIGHT CURLY BRACE (`}`)):

```mdx
{
  This is a fine expression: no opening or closing braces
}

So is this: {{{}}}.

And this, an expression with extra closing braces after it: {}}}.
```

This example is incorrect, as there are not enough closing braces:

```mdx
{{{}.
```

#### 3.5.4 Closing MDX

MDX elements and expressions must be closed, and what closes them must be in an
expected place:

This example is incorrect, an unclosed tag:

```mdx
<Component>
```

This example is incorrect, because the “closing” tag is in fenced code.

````mdx
<Component>

```js
</Component>
```
````

This example is incorrect, because the “closing” tag is outside of the block
quote:

```mdx
> <Component>

</Component>
```

This example is incorrect, because the “closing” tag is not in the paragraph:

```mdx
A span component <component>

</component>
```

This example is incorrect, because the “closing” tag is in a different
paragraph:

```mdx
<component>This is one paragraph, with an inline opening tag.

This is another paragraph, with an inline closing tag</component>.
```

The same rules apply to expressions:

```mdx
{This is all fine…

…but because there is a dot after the closing brace, it’s not a block, which
results in two paragraphs, which means that the first paragraph has an unclosed
expression}.
```

#### 3.5.5 Attributes

MDX elements can have three types of attributes.

Attribute expressions:

```mdx
<Component {attribute expression} />
```

Boolean attributes:

```mdx
<Component boolean another />
```

Or initialized attributes, with a value.

```mdx
<Component key="value" other="more" />
```

Attribute values can also use single quotes:

```mdx
<Component quotes='single quotes: also known as apostrophes' />
```

Finally, attribute value expressions can be used with braces:

```mdx
<Component data={attribute value expression} />
```

#### 3.5.6 Names

Element names are optional, which is a feature called “fragments”:

```mdx
<>Fragment block with a paragraph</>

A <>fragment span</> in a paragraph.
```

The syntax of the name of an element follows the syntax of variables in
JavaScript, and dashes are also allowed (but not at the start):

```mdx
This is fine: <π />.

Also fine: <a‌b /> (there’s a zero-width non-joiner in there).

Dashes are <c-d /> fine too!
```

Names can be prefixed with a namespace using a colon:

```mdx
<svg:rect />
```

Similar to namespaces, dots can be used to access methods from objects:

```mdx
<org.acme.example />
```

(Namespaces and methods cannot be combined).

#### 3.5.7 Keys

Similar to names, keys of attributes also follow the same syntax as JavaScript
variables, and dashes are also allowed:

```mdx
This is all fine: <x π a‌b c-d />.
```

And namespaces can also be used:

```mdx
This is all fine: <z xml:lang="de" />.
```

(Methods don’t work for keys).

#### 3.5.8 Whitespace

Whitespace is mostly optional, except between two identifiers (such as the
name and a key, or between two keys):

```mdx
This is fine: <x/>.
Also fine: <x{attribute expression}/>.
Fine too: <v w=""x=''y z/>.
```

Most places accept whitespace:

```mdx
A bit much, but sure: < w / >.
< x >Go ahead< / x >
< z do your = 'thing' >
```

## 4 Parsing

The states of the [MDX state machine][mdx-state-machine] have certain effects, such as that they
create tokens in the [stack][stack] and [consume][consume] characters.
The purpose of the state machine is to tokenize.
The stack is used by adapters.

The [MDX adapter][mdx-adapter] handles tokens, which has further effects, such as
validating whether they are conforming and figuring out when parsing is done.
The purpose of the adapter is to handle the results of the tokenizer.

To parse MDX is to feed the [input character][input-character] to the [state][state] of the state
machine, and when not [settled][settled], repeat this step.

If parsing [crashed][crashed] with a label the content is nonsensical and the document
cannot be processed.
Without label, no MDX was found.

How MDX, whether it’s found or not, is handled is intentionally undefined and
left up to the host parser.
When to feed an [EOF][ceof] is similarly undefined.

Host parsers must not support indented code and autlinks, as those conflict with
MDX.

### 4.1 Characters

A character is a Unicode code point and is represented as a four to six digit
hexadecimal number, prefixed with `U+` (**\[UNICODE]**).

#### 4.1.1 Character groups

<a id="whitespace" href="#whitespace">**Whitespace**</a> is any character defined as [`WhiteSpace`][es-whitespace]
(**\[JavaScript]**).

<a id="identifier-start" href="#identifier-start">**Identifier start**</a> is any character defined as
[`IdentifierStart`][es-identifier-start], with the restriction that unicode
escape sequences do not apply (**\[JavaScript]**).

<a id="identifier" href="#identifier">**Identifier**</a> is any character defined as
[`IdentifierPart`][es-identifier-part], with the restriction that unicode escape
sequences do not apply (**\[JavaScript]**).

#### 4.1.2 Conceptual characters

An <a id="ceof" href="#ceof">**EOF**</a> character is a conceptual character (as in, not real character)
representing the lack of any further characters in the input.

### 4.2 Infra

The <a id="input-stream" href="#input-stream">**input stream**</a> consists of the characters pushed into it.

The <a id="input-character" href="#input-character">**input character**</a> is the first character in the [input stream][input-stream] that has
not been consumed.
Initially, the input character is the first character in the input.
Finally, when all character are consumed, the input character is an [EOF][ceof].

The <a id="stack" href="#stack">**stack**</a> is a list of tokens that are open, initially empty.
The <a id="current-token" href="#current-token">**current token**</a> is the last token in the [stack][stack].

The <a id="value" href="#value">**value**</a> of a token are all characters in the [input stream][input-stream] from where
the token was [enter][enter]ed (including) to where it [exit][exit]ed (excluding).

The <a id="element-stack" href="#element-stack">**element stack**</a> is a list of elements that are open, initially empty.
The <a id="current-element" href="#current-element">**current element**</a> is the last element in the [element stack][element-stack].

<a id="settled" href="#settled">**Settled**</a> is used to signal when parsing is done, whether it was a success
or not, and is initially off.
<a id="crashed" href="#crashed">**Crashed**</a> is used to signal when parsing is unsuccessful, and is initially
off.

The <a id="state" href="#state">**state**</a> is the way a character is handled.

A variable is declared with `let`, cleared with `unset`, or changed with
`set` (to set a value), `increment` (to add a numeric value), `decrement` (to
subtract a numeric value), `append` (to add a string value), `push` (to add a
value to a list), or `pop` (to remove a value from the end of a list).

Which values are used are left to the host programming language, but this
definition requires compatibility with **\[JSON]** for primitives (strings,
numbers, booleans, and null) and structured types (objects and arrays).

The <a id="shared-space" href="#shared-space">**shared space**</a> is an object.
`size`, `sizeOpen`, `currentAttribute`, and `currentTag` are variables in the
[shared space][shared-space].
These variables are available globally to all states and adapters.
Other variables are available locally to a state or adapter and not shared.

To <a id="dedent" href="#dedent">**dedent**</a> is to remove up to X initial U+0009 CHARACTER TABULATION (HT) or U+0020 SPACE (SP) characters from each
non-initial line in the given value, where X is the minimum number of U+0009 CHARACTER TABULATION (HT) or
U+0020 SPACE (SP) characters of all non-initial lines that contain other characters.

To <a id="decode" href="#decode">**decode**</a> is to parse character references as defined in “Character
reference state” of § 12.2 Parsing HTML documents (**\[HTML]**).

### 4.3 Effects

The [MDX state machine][mdx-state-machine] and [MDX adapter][mdx-adapter] have certain common effects.

#### 4.3.1 Switch

To <a id="switch" href="#switch">**switch**</a> to a state is to wait for a character in the given state.

#### 4.3.2 Consume

To <a id="consume" href="#consume">**consume**</a> the [input character][input-character] is to move on from it to the next
character in the [input stream][input-stream].

#### 4.3.3 Enter

To <a id="enter" href="#enter">**enter**</a> a token is to push a new token of the given type to the [stack][stack],
making it the [current token][current-token].

#### 4.3.4 Exit

To <a id="exit" href="#exit">**exit**</a> is to pop the [current token][current-token] from the [stack][stack].

#### 4.3.5 Done

<a id="done" href="#done">**Done**</a> is used to mark parsing as [settled][settled].

#### 4.3.6 Crash

<a id="crash" href="#crash">**Crash**</a> is used to mark parsing as [settled][settled] and [crashed][crashed].
When crashing with a given label, crashing causes a parse error.

## 5 State machine

The <a id="mdx-state-machine" href="#mdx-state-machine">**MDX state machine**</a> is used to tokenize MDX blocks and MDX spans.
Blocks (also known as flow) make up the structure of the document (such as
headings), whereas spans (also known as text or inline) make up the
intra-paragraph parts of the flow (such as emphasis).

The initial state varies based on whether flow or text is parsed, and is
respectively either [*Before MDX block state*][s-before-mdx-block] or [*Before MDX span state*][s-before-mdx-span].

The final state is switched to by the [MDX adapter][mdx-adapter], which right before
completion will [switch][switch] to either [*After MDX block state*][s-after-mdx-block] or [*After MDX span state*][s-after-mdx-span].

### 5.1 Before MDX block state

*   ↪ **U+0009 CHARACTER TABULATION (HT)**\
    ↪ **U+0020 SPACE (SP)**

    [Consume][consume]
*   ↪ **Anything else**

    [Switch][switch] to [*Before MDX span state*][s-before-mdx-span]

### 5.2 Before MDX span state

*   ↪ **U+003C LESS THAN (`<`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**

    [Switch][switch] to [*Data state*][s-data]
*   ↪ **Anything else**

    [Crash][crash]

### 5.3 After MDX block state

*   ↪ **U+0009 CHARACTER TABULATION (HT)**\
    ↪ **U+0020 SPACE (SP)**

    [Consume][consume]
*   ↪ **[EOF][ceof]**\
    ↪ **U+000A LINE FEED (LF)**\
    ↪ **U+000D CARRIAGE RETURN (CR)**

    [Done][done]
*   ↪ **Anything else**

    [Crash][crash]

### 5.4 After MDX span state

[Done][done]

### 5.5 Data state

*   ↪ **U+003C LESS THAN (`<`)**

    [Switch][switch] to [*Before name state*][s-before-name], [enter][enter] `'tag'`, and [consume][consume]
*   ↪ **U+007B LEFT CURLY BRACE (`{`)**

    [Switch][switch] to [*Expression state*][s-expression], [enter][enter] `'expression'`, let `size` be `1`, and
    [consume][consume]
*   ↪ **Anything else**

    [Switch][switch] to [*Text state*][s-text] and [enter][enter] `'text'`

### 5.6 Before name state

*   ↪ **U+002F SLASH (`/`)**

    [Switch][switch] to [*Before closing tag name state*][s-before-closing-tag-name], [enter][enter] `'closingSlash'`,
    [consume][consume], and [exit][exit]
*   ↪ **U+003E GREATER THAN (`>`)**

    [Switch][switch] to [*Data state*][s-data], [enter][enter] `'name'`, [exit][exit], [consume][consume], and
    [exit][exit]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Primary name state*][s-primary-name], [enter][enter] `'name'`, [enter][enter] `'primaryName'`,
    and [consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'before name'`

### 5.7 Before closing tag name state

*   ↪ **U+003E GREATER THAN (`>`)**

    [Switch][switch] to [*Data state*][s-data], [enter][enter] `'name'`, [exit][exit], [consume][consume], and
    [exit][exit]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Primary name state*][s-primary-name], [enter][enter] `'name'`, [enter][enter] `'primaryName'`,
    and [consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'before name'`

### 5.8 Primary name state

*   ↪ **U+002D DASH (`-`)**\
    ↪ **[Identifier][identifier]**

    [Consume][consume]
*   ↪ **U+002E DOT (`.`)**\
    ↪ **U+002F SLASH (`/`)**\
    ↪ **U+003A COLON (`:`)**\
    ↪ **U+003E GREATER THAN (`>`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**\
    ↪ **[Whitespace][whitespace]**

    [Switch][switch] to [*After primary name state*][s-after-primary-name] and [exit][exit]
*   ↪ **Anything else**

    [Crash][crash] `'in name'`

### 5.9 After primary name state

*   ↪ **U+002E DOT (`.`)**

    [Switch][switch] to [*Before member name state*][s-before-member-name] and [consume][consume]
*   ↪ **U+003A COLON (`:`)**

    [Switch][switch] to [*Before local name state*][s-before-local-name] and [consume][consume]
*   ↪ **U+002F SLASH (`/`)**\
    ↪ **U+003E GREATER THAN (`>`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**\
    ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Before attribute state*][s-before-attribute] and [exit][exit]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'after name'`

### 5.10 Before member name state

*   ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Member name state*][s-member-name], [enter][enter] `'memberName'`, and [consume][consume]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'before member name'`

### 5.11 Member name state

*   ↪ **U+002D DASH (`-`)**\
    ↪ **[Identifier][identifier]**

    [Consume][consume]
*   ↪ **U+002E DOT (`.`)**\
    ↪ **U+002F SLASH (`/`)**\
    ↪ **U+003E GREATER THAN (`>`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**\
    ↪ **[Whitespace][whitespace]**

    [Switch][switch] to [*After member name state*][s-after-member-name] and [exit][exit]
*   ↪ **Anything else**

    [Crash][crash] `'in member name'`

### 5.12 After member name state

*   ↪ **U+002E DOT (`.`)**

    [Switch][switch] to [*Before member name state*][s-before-member-name] and [consume][consume]
*   ↪ **U+002F SLASH (`/`)**\
    ↪ **U+003E GREATER THAN (`>`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**\
    ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Before attribute state*][s-before-attribute] and [exit][exit]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'after member name'`

### 5.13 Before local name state

*   ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Local name state*][s-local-name], [enter][enter] `'localName'`, and [consume][consume]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'before local name'`

### 5.14 Local name state

*   ↪ **U+002D DASH (`-`)**\
    ↪ **[Identifier][identifier]**

    [Consume][consume]
*   ↪ **U+002F SLASH (`/`)**\
    ↪ **U+003E GREATER THAN (`>`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**\
    ↪ **[Whitespace][whitespace]**

    [Switch][switch] to [*After local name state*][s-after-local-name], [exit][exit], and [exit][exit]
*   ↪ **Anything else**

    [Crash][crash] `'in local name'`

### 5.15 After local name state

*   ↪ **U+002F SLASH (`/`)**\
    ↪ **U+003E GREATER THAN (`>`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**\
    ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Before attribute state*][s-before-attribute]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'after local name'`

### 5.16 Before attribute state

*   ↪ **U+002F SLASH (`/`)**

    [Switch][switch] to [*Self-closing state*][s-self-closing], [enter][enter] `'selfClosingSlash'`, [consume][consume],
    and [exit][exit]
*   ↪ **U+003E GREATER THAN (`>`)**

    [Switch][switch] to [*Data state*][s-data], [consume][consume], and [exit][exit]
*   ↪ **U+007B LEFT CURLY BRACE (`{`)**

    [Switch][switch] to [*Attribute expression state*][s-attribute-expression], [enter][enter] `'attributeExpression'`, let
    `size` be `1`, and [consume][consume]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Attribute name state*][s-attribute-name], [enter][enter] `'attributeName'`, and [consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'before attribute name'`

### 5.17 Attribute expression state

*   ↪ **[EOF][ceof]**

    [Crash][crash] `'in attribute expression'`
*   ↪ **U+007B LEFT CURLY BRACE (`{`)**

    Increment `size` by `1` and [consume][consume]
*   ↪ **U+007D RIGHT CURLY BRACE (`}`)**

    If `size` is:

    *   ↪ **`1`**

        [Switch][switch] to [*Before attribute state*][s-before-attribute], unset `size`, [consume][consume], and
        [exit][exit]
    *   ↪ **Anything else**

        Decrement `size` by `1` and [consume][consume]
*   ↪ **Anything else**

    [Consume][consume]

### 5.18 Attribute name state

*   ↪ **U+002D DASH (`-`)**\
    ↪ **[Identifier start][identifier-start]**

    [Consume][consume]
*   ↪ **U+002F SLASH (`/`)**\
    ↪ **U+003A COLON (`:`)**\
    ↪ **U+003D EQUALS TO (`=`)**\
    ↪ **U+003E GREATER THAN (`>`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**\
    ↪ **[Whitespace][whitespace]**

    [Switch][switch] to [*After attribute name state*][s-after-attribute-name] and [exit][exit]
*   ↪ **Anything else**

    [Crash][crash] `'in attribute name'`

### 5.19 After attribute name state

*   ↪ **U+003A COLON (`:`)**

    [Switch][switch] to [*Before attribute local name state*][s-before-attribute-local-name] and [consume][consume]
*   ↪ **U+003D EQUALS TO (`=`)**

    [Switch][switch] to [*Before attribute value state*][s-before-attribute-value] and [consume][consume]
*   ↪ **U+002F SLASH (`/`)**\
    ↪ **U+003E GREATER THAN (`>`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**\
    ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Before attribute state*][s-before-attribute]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'after attribute name'`

### 5.20 Before attribute local name state

*   ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Attribute local name state*][s-attribute-local-name], [enter][enter] `'attributeLocalName'`, and
    [consume][consume]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'before local attribute name'`

### 5.21 Attribute local name state

*   ↪ **U+002D DASH (`-`)**\
    ↪ **[Identifier start][identifier-start]**

    [Consume][consume]
*   ↪ **U+002F SLASH (`/`)**\
    ↪ **U+003D EQUALS TO (`=`)**\
    ↪ **U+003E GREATER THAN (`>`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**\
    ↪ **[Whitespace][whitespace]**

    [Switch][switch] to [*After attribute local name state*][s-after-attribute-local-name] and [exit][exit]
*   ↪ **Anything else**

    [Crash][crash] `'in local attribute name'`

### 5.22 After attribute local name state

*   ↪ **U+003D EQUALS TO (`=`)**

    [Switch][switch] to [*Before attribute value state*][s-before-attribute-value] and [consume][consume]
*   ↪ **U+002F SLASH (`/`)**\
    ↪ **U+003E GREATER THAN (`>`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**\
    ↪ **[Identifier start][identifier-start]**

    [Switch][switch] to [*Before attribute state*][s-before-attribute]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'after local attribute name'`

### 5.23 Before attribute value state

*   ↪ **U+0022 QUOTATION MARK (`"`)**

    [Switch][switch] to [*Attribute value double quoted state*][s-attribute-value-double-quoted], [enter][enter] `'attributeValue'`,
    and [consume][consume]
*   ↪ **U+0027 APOSTROPHE (`'`)**

    [Switch][switch] to [*Attribute value single quoted state*][s-attribute-value-single-quoted], [enter][enter] `'attributeValue'`,
    and [consume][consume]
*   ↪ **U+007B LEFT CURLY BRACE (`{`)**

    [Switch][switch] to [*Attribute value expression state*][s-attribute-value-expression], [enter][enter]
    `'attributeValueExpression'`, let `size` be `1`, and [consume][consume]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'before attribute value'`

### 5.24 Attribute value double quoted state

*   ↪ **[EOF][ceof]**

    [Crash][crash] `'in attribute value'`
*   ↪ **U+0022 QUOTATION MARK (`"`)**

    [Switch][switch] to [*Before attribute state*][s-before-attribute], [consume][consume], and [exit][exit]
*   ↪ **Anything else**

    [Consume][consume]

### 5.25 Attribute value single quoted state

*   ↪ **[EOF][ceof]**

    [Crash][crash] `'in attribute value'`
*   ↪ **U+0027 APOSTROPHE (`'`)**

    [Switch][switch] to [*Before attribute state*][s-before-attribute], [consume][consume], and [exit][exit]
*   ↪ **Anything else**

    [Consume][consume]

### 5.26 Attribute value expression state

*   ↪ **[EOF][ceof]**

    [Crash][crash] `'in attribute value expression'`
*   ↪ **U+007B LEFT CURLY BRACE (`{`)**

    Increment `size` by `1` and [consume][consume]
*   ↪ **U+007D RIGHT CURLY BRACE (`}`)**

    If `size` is:

    *   ↪ **`1`**

        [Switch][switch] to [*Before attribute state*][s-before-attribute], unset `size`, [consume][consume], and
        [exit][exit]
    *   ↪ **Anything else**

        Decrement `size` by `1` and [consume][consume]
*   ↪ **Anything else**

    [Consume][consume]

### 5.27 Self-closing state

*   ↪ **U+003E GREATER THAN (`>`)**

    [Switch][switch] to [*Data state*][s-data], [consume][consume], and [exit][exit]
*   ↪ **[Whitespace][whitespace]**

    [Consume][consume]
*   ↪ **Anything else**

    [Crash][crash] `'after self-closing slash'`

### 5.28 Expression state

*   ↪ **[EOF][ceof]**

    [Crash][crash] `'in attribute value expression'`
*   ↪ **U+007B LEFT CURLY BRACE (`{`)**

    Increment `size` by `1` and [consume][consume]
*   ↪ **U+007D RIGHT CURLY BRACE (`}`)**

    If `size` is:

    *   ↪ **`1`**

        [Switch][switch] to [*Data state*][s-data], unset `size`, [consume][consume], and [exit][exit]
    *   ↪ **Anything else**

        Decrement `size` by `1` and [consume][consume]
*   ↪ **Anything else**

    [Consume][consume]

### 5.29 Text state

*   ↪ **[EOF][ceof]**

    [Crash][crash] `'in element'`
*   ↪ **U+003C LESS THAN (`<`)**\
    ↪ **U+007B LEFT CURLY BRACE (`{`)**

    [Switch][switch] to [*Data state*][s-data] and [exit][exit]
*   ↪ **U+0060 GRAVE ACCENT (`` ` ``)**

    [Switch][switch] to [*Accent quoted open state*][s-accent-quoted-open], let `sizeOpen` be `1`, and [consume][consume]
*   ↪ **U+007E TILDE (`~`)**

    [Switch][switch] to [*Tilde quoted open state*][s-tilde-quoted-open], let `sizeOpen` be `1`, and [consume][consume]
*   ↪ **Anything else**

    [Consume][consume]

### 5.30 Accent quoted open state

*   ↪ **[EOF][ceof]**

    [Crash][crash] `'in code'`
*   ↪ **U+0060 GRAVE ACCENT (`` ` ``)**

    Increment `sizeOpen` by `1` and [consume][consume]
*   ↪ **Anything else**

    [Switch][switch] to [*Accent quoted state*][s-accent-quoted] and [consume][consume]

### 5.31 Accent quoted state

*   ↪ **[EOF][ceof]**

    [Crash][crash] `'in code'`
*   ↪ **U+0060 GRAVE ACCENT (`` ` ``)**

    [Switch][switch] to [*Accent quoted close state*][s-accent-quoted-close], let `size` be `1`, and [consume][consume]
*   ↪ **Anything else**

    [Consume][consume]

### 5.32 Accent quoted close state

*   ↪ **U+0060 GRAVE ACCENT (`` ` ``)**

    Increment `sizeOpen` by `1` and [consume][consume]
*   ↪ **Anything else**

    If `size` is:

    *   ↪ **`sizeOpen`**

        [Switch][switch] to [*Text state*][s-text], unset `sizeOpen`, and unset `size`
    *   ↪ **Anything else**

        [Switch][switch] to [*Accent quoted state*][s-accent-quoted] and unset `size`

### 5.33 Tilde quoted open state

*   ↪ **[EOF][ceof]**

    [Crash][crash] `'in code'`
*   ↪ **U+007E TILDE (`~`)**

    Increment `sizeOpen` by `1` and [consume][consume]
*   ↪ **Anything else**

    [Switch][switch] to [*Tilde quoted state*][s-tilde-quoted] and [consume][consume]

### 5.34 Tilde quoted state

*   ↪ **[EOF][ceof]**

    [Crash][crash] `'in code'`
*   ↪ **U+007E TILDE (`~`)**

    [Switch][switch] to [*Tilde quoted close state*][s-tilde-quoted-close], let `size` be `1`, and [consume][consume]
*   ↪ **Anything else**

    [Consume][consume]

### 5.35 Tilde quoted close state

*   ↪ **U+007E TILDE (`~`)**

    Increment `sizeOpen` by `1` and [consume][consume]
*   ↪ **Anything else**

    If `size` is:

    *   ↪ **`sizeOpen`**

        [Switch][switch] to [*Text state*][s-text], unset `sizeOpen`, and unset `size`
    *   ↪ **Anything else**

        [Switch][switch] to [*Tilde quoted state*][s-tilde-quoted] and unset `size`

## 6 Adapter

The <a id="mdx-adapter" href="#mdx-adapter">**MDX adapter**</a> handles tokens from the [MDX state machine][mdx-state-machine], which has
further effects, such as validating whether they are conforming and figuring out
when parsing is done.

Adapters are defined to handle a token either when a token [enter][enter]s right
before it’s pushed to the stack, or when a token [exit][exit]s right after it’s
popped off the stack.

The adapters does not define how to construct a syntax tree, but does provide
the essentials for that.
Constructing syntax trees, whether abstract or concrete, is intentionally
undefined.

### 6.1 Enter `'tag'` adapter

1.  Let `currentTag` be a new object
2.  Let `name` of `currentTag` be `null`
3.  Let `close` of `currentTag` be `false`
4.  Let `selfClosing` of `currentTag` be `false`

### 6.2 Enter `'closingSlash'` adapter

If there is no [current element][current-element], [crash][crash] `'before name'` (**note**: a
closing tag with no open elements)

### 6.3 Enter `'attributeExpression'` adapter

If `close` of `currentTag` is `true`, [crash][crash] `'on closing tag after name'`
(**note**: a closing tag with an attribute)

### 6.4 Enter `'attributeName'` adapter

If `close` of `currentTag` is `true`, [crash][crash] `'on closing tag after name'`
(**note**: a closing tag with an attribute)

### 6.5 Enter `'selfClosingSlash'` adapter

If `close` of `currentTag` is `true`, [crash][crash] `'on closing tag before tag
end'` (**note**: a self-closing closing tag)

### 6.6 Exit `'closingSlash'` adapter

Let `close` of `currentTag` be `true`

### 6.7 Exit `'primaryName'` adapter

Let `name` of `currentTag` be the [value][value] of [current token][current-token]

### 6.8 Exit `'memberName'` adapter

Append U+002E DOT (`.`) and the [value][value] of [current token][current-token] to `name` of `currentTag`

### 6.9 Exit `'localName'` adapter

Append U+003A COLON (`:`) and the [value][value] of [current token][current-token] to `name` of `currentTag`

### 6.10 Exit `'name'` adapter

If `close` of `currentTag` is `true` and `name` of `currentTag` is not the same
as `name` of [current element][current-element], [crash][crash] `'on closing tag after name'`
(**note**: mismatched tags)

### 6.11 Exit `'attributeName'` adapter

1.  Let `currentAttribute` be a new object
2.  Let `name` of `currentAttribute` be the [value][value] of [current token][current-token]
3.  Let `value` of `currentAttribute` be `null`

### 6.12 Exit `'attributeLocalName'` adapter

Append U+003A COLON (`:`) and the [value][value] of [current token][current-token] to `name` of
`currentAttribute`

### 6.13 Exit `'attributeValue'` adapter

Let `value` of `currentAttribute` be the [decode][decode]d [value][value], excluding its
first and last characters, of [current token][current-token]

### 6.14 Exit `'attributeValueExpression'` adapter

Let `value` of `currentAttribute` be the [dedent][dedent]ed [value][value], excluding its
first and last characters, of [current token][current-token]

### 6.15 Exit `'attributeExpression'` adapter

1.  Let `currentAttribute` be a new object
2.  Let `type` of `currentAttribute` be `'mdxAttributeExpression'`
3.  Let `value` of `currentAttribute` be the [dedent][dedent]ed [value][value], excluding
    its first and last characters, of [current token][current-token]

### 6.16 Exit `'selfClosingSlash'` adapter

Let `selfClosing` of `currentTag` be `true`

### 6.17 Exit `'tag'` adapter

> **Note**: if there is no [current element][current-element], the [input character][input-character] is the
> start of the element’s content.
> If `close` of `currentTag` is `true`, and there is a single value in
> the [element stack][element-stack], the first character of the token is the end of the
> element’s content.
> The content should be parsed further by the host parser to find nested MDX
> constructs.

1.  If `close` of `currentTag` is `true`, pop the [current element][current-element] from the
    [element stack][element-stack]
2.  Otherwise, if `selfClosing` of `currentTag` is `false`, push `currentTag` to
    the [element stack][element-stack]

Finally, if there is no [current element][current-element], [switch][switch] to either
[*After MDX block state*][s-after-mdx-block] or [*After MDX span state*][s-after-mdx-span], based on whether flow or text is parsed.

### 6.18 Exit `'expression'` adapter

> **Note**: if there is no [current element][current-element], the first character after the
> start of the token is the start of the expression’s content, and the last
> character before the end of the token is the end of the expression’s content.
> The content could be parsed by the host parser.

If there is no [current element][current-element], [switch][switch] to either [*After MDX block state*][s-after-mdx-block] or
[*After MDX span state*][s-after-mdx-span], based on whether flow or text is parsed.

## 7 Appendix

### 7.1 Syntax

The syntax of MDX is described in [W3C Backus–Naur form][w3c-bnf] with the
following additions:

1.  **`A - B`** — matches any string that matches `A` but does not match `B`.
2.  **`'string'`** — same as **`"string"`** but with single quotes.
3.  **`BREAK`** — lookahead match for a block break opportunity (either
    [EOF][ceof], U+000A LINE FEED (LF), or U+000D CARRIAGE RETURN (CR))

The syntax of MDX is defined as follows, however, do note that interleaving
(mixing) of Markdown and MDX is defined elsewhere.

<pre><code>; Entries
<a id=x-mdx-block href=#x-mdx-block>mdxBlock</a> ::= *<a href=#x-space-or-tab>spaceOrTab</a> (<a href=#x-element>element</a> | <a href=#x-expression>expression</a>) *<a href=#x-space-or-tab>spaceOrTab</a> BREAK
<a id=x-mdx-span href=#x-mdx-span>mdxSpan</a> ::= <a href=#x-element>element</a> | <a href=#x-expression>expression</a>

<a id=x-element href=#x-element>element</a> ::= <a href=#x-self-closing>selfClosing</a> | <a href=#x-closed>closed</a>
<a id=x-self-closing href=#x-self-closing>selfClosing</a> ::=
  ; constraint: tag MUST be named, MUST NOT be closing, and MUST be self-closing
  <a href=#x-tag>tag</a>
<a id=x-closed href=#x-closed>closed</a> ::=
  ; constraint: tag MUST NOT be closing and MUST NOT be self-closing
  <a href=#x-tag>tag</a>
  *<a href=#x-data>data</a>
  ; constraint: tag MUST be closing, MUST NOT be self-closing, MUST not have
  ; attributes, and either both tags MUST have the same name or both tags MUST
  ; be nameless
  <a href=#x-tag>tag</a>

<a id=x-data href=#x-data>data</a> ::= <a href=#x-expression>expression</a> | <a href=#x-element>element</a> | <a href=#x-tick-quoted>tickQuoted</a> | <a href=#x-tilde-quoted>tildeQuoted</a> | <a href=#x-text>text</a>

<a id=x-tag href=#x-tag>tag</a> ::=
  '<' *1<a href=#x-closing>closing</a>
  *1(*<a href=#x-whitespace>whitespace</a> <a href=#x-name>name</a> *1<a href=#x-attributes-after-identifier>attributesAfterIdentifier</a> *1<a href=#x-closing>closing</a>)
  *<a href=#x-whitespace>whitespace</a> '>'

<a id=x-attributes-after-identifier href=#x-attributes-after-identifier>attributesAfterIdentifier</a> ::=
  1*<a href=#x-whitespace>whitespace</a> (<a href=#x-attributes-boolean>attributesBoolean</a> | <a href=#x-attributes-value>attributesValue</a>) |
  *<a href=#x-whitespace>whitespace</a> <a href=#x-attributes-expression>attributesExpression</a> |
<a id=x-attributes-after-value href=#x-attributes-after-value>attributesAfterValue</a> ::=
  *<a href=#x-whitespace>whitespace</a> (<a href=#x-attributes-boolean>attributesBoolean</a> | <a href=#x-attributes-expression>attributesExpression</a> | <a href=#x-attributes-value>attributesValue</a>)
<a name=attributes-boolean href=#x-attributes-boolean>attributesBoolean</a> ::= <a href=#x-key>key</a> *1<a href=#x-attributes-after-identifier>attributesAfterIdentifier</a>
<a name=attributes-expression href=#x-attributes-expression>attributesExpression</a> ::= <a href=#x-expression>expression</a> *1<a href=#x-attributes-after-value>attributesAfterValue</a>
<a name=attributes-value href=#x-attributes-value>attributesValue</a> ::= <a href=#x-key>key</a> <a href=#x-initializer>initializer</a> *1<a href=#x-attributes-after-value>attributesAfterValue</a>

<a id=x-closing href=#x-closing>closing</a> ::= *<a href=#x-whitespace>whitespace</a> '/'

<a id=x-name href=#x-name>name</a> ::= <a href=#x-identifier>identifier</a> *1(<a href=#x-local>local</a> | <a href=#x-members>members</a>)
<a id=x-key href=#x-key>key</a> ::= <a href=#x-identifier>identifier</a> *1<a href=#x-local>local</a>
<a id=x-local href=#x-local>local</a> ::= *<a href=#x-whitespace>whitespace</a> ':' *<a href=#x-whitespace>whitespace</a> <a href=#x-identifier>identifier</a>
<a id=x-members href=#x-members>members</a> ::= <a href=#x-member>member</a> *<a href=#x-member>member</a>
<a id=x-member href=#x-member>member</a> ::= *<a href=#x-whitespace>whitespace</a> '.' *<a href=#x-whitespace>whitespace</a> <a href=#x-identifier>identifier</a>

<a id=x-identifier href=#x-identifier>identifier</a> ::= <a href=#x-identifier-start>identifierStart</a> *<a href=#x-identifier-part>identifierPart</a>
<a id=x-initializer href=#x-initializer>initializer</a> ::= *<a href=#x-whitespace>whitespace</a> '=' *<a href=#x-whitespace>whitespace</a> <a href=#x-value>value</a>
<a id=x-value href=#x-value>value</a> ::= <a href=#x-double-quoted>doubleQuoted</a> | <a href=#x-single-quoted>singleQuoted</a> | <a href=#x-expression>expression</a>
<a id=x-expression href=#x-expression>expression</a> ::= '{' *(<a href=#x-expression-text>expressionText</a> | <a href=#x-expression>expression</a>) '}'

<a id=x-tick-quoted href=#x-tick-quoted>tickQuoted</a> ::=
  <a href=#x-tick-fence>tickFence</a>
  ; constraint: nested fence MUST NOT be the same size as the opening fence
  *(<a href=#x-tick-text>tickText</a> | <a href=#x-tick-fence>tickFence</a>)
  ; constraint: closing fence MUST be the same size as the opening fence
  <a href=#x-tick-fence>tickFence</a>
<a id=x-tilde-quoted href=#x-tilde-quoted>tildeQuoted</a> ::=
  <a href=#x-tilde-fence>tildeFence</a>
  ; constraint: nested fence MUST NOT be the same size as the opening fence
  *(<a href=#x-tilde-text>tildeText</a> | <a href=#x-tilde-fence>tildeFence</a>)
  ; constraint: closing fence MUST be the same size as the opening fence
  <a href=#x-tilde-fence>tildeFence</a>
<a id=x-tick-fence href=#x-tick-fence>tickFence</a> ::= 1*'`'
<a id=x-tilde-fence href=#x-tilde-fence>tildeFence</a> ::= 1*'~'
<a id=x-double-quoted href=#x-double-quoted>doubleQuoted</a> ::= '"' *<a href=#x-double-quoted-text>doubleQuotedText</a> '"'
<a id=x-single-quoted href=#x-single-quoted>singleQuoted</a> ::= "'" *<a href=#x-single-quoted-text>singleQuotedText</a> "'"

<a id=x-space-or-tab href=#x-space-or-tab>spaceOrTab</a> ::= " " | "\t"
<a id=x-text href=#x-text>text</a> ::= <a href=#x-character>character</a> - '<' - '{' - '`' - '~'
<a id=x-whitespace href=#x-whitespace>whitespace</a> ::= <a href=#x-es-whitespace>esWhitespace</a>
<a id=x-double-quoted-text href=#x-double-quoted-text>doubleQuotedText</a> ::= <a href=#x-character>character</a> - '"'
<a id=x-single-quoted-text href=#x-single-quoted-text>singleQuotedText</a> ::= <a href=#x-character>character</a> - "'"
<a id=x-tick-text href=#x-tick-text>tickText</a> ::= <a href=#x-character>character</a> - '`'
<a id=x-tilde-text href=#x-tilde-text>tildeText</a> ::= <a href=#x-character>character</a> - '~'
<a id=x-expression-text href=#x-expression-text>expressionText</a> ::= <a href=#x-character>character</a> - '{' - '}'
<a id=x-identifier-start href=#x-identifier-start>identifierStart</a> ::= <a href=#x-es-identifier-start>esIdentifierStart</a>
<a id=x-identifier-part href=#x-identifier-part>identifierPart</a> ::= <a href=#x-es-identifier-part>esIdentifierPart</a> | '-'

; Unicode
; Any unicode code point
<a id=x-character href=#x-character>character</a> ::=

; ECMAScript
; See “IdentifierStart”: &lt;<a href=https://tc39.es/ecma262/#prod-IdentifierStart>https://tc39.es/ecma262/#prod-IdentifierStart</a>>
<a id=x-es-identifier-start href=#x-es-identifier-start>esIdentifierStart</a> ::=
; See “IdentifierPart”: &lt;<a href=https://tc39.es/ecma262/#prod-IdentifierPart>https://tc39.es/ecma262/#prod-IdentifierPart</a>>
<a id=x-es-identifier-part href=#x-es-identifier-part>esIdentifierPart</a> ::=
; See “Whitespace”: &lt;<a href=https://tc39.es/ecma262/#prod-WhiteSpace>https://tc39.es/ecma262/#prod-WhiteSpace</a>>
<a id=x-es-whitespace href=#x-es-whitespace>esWhitespace</a> ::=
</code></pre>

### 7.2 Deviations from Markdown

MDX adds constructs to Markdown but also prohibits certain normal Markdown
constructs.

#### 7.2.1 HTML

Whether block or inline, HTML in Markdown is not supported.

Character data, processing instructions, declarations, and comments are not
supported at all.
Instead of HTML elements, use JSX elements.

Incorrect:

```markdown
# Hello, <span style=color:red>world</span>!
<!--To do: add message-->
<img>
```

Correct:

```markdown
# Hello, <span style='color:red'>world</span>!
<img />
```

#### 7.2.2 Indented code

Indentation to create code blocks is not supported.
Instead, use fenced code blocks.

The reason for this change is so that elements can be indented.

Incorrect:

```markdown
    console.log(1)
```

Correct:

````markdown
```js
console.log(1)
```
````

#### 7.2.3 Autolinks

Autolinks are not supported.
Instead, use links or references.

The reason for this change is because whether something is an element (whether
HTML or JSX) or an autolink is ambiguous (Markdown normally treats `<svg:rect>`,
`<xml:lang/>`, or `<svg:circle{...props}>` as links).

Incorrect:

```markdown
See <https://example.com> for more information
```

Correct:

```markdown
See [example.com](https://example.com) for more information.
```

#### 7.2.4 Errors

Whereas all Markdown is valid, incorrect MDX will crash.

### 7.3 Deviations from JSX

MDX removes certain constructs from JSX, because JSX is typically mixed with
JavaScript whereas MDX is usable without it.

#### 7.3.1 Comments

JavaScript comments in JSX are not supported.

Incorrect:

```jsx
<hi/*comment!*//>
<hello// comment!
/>
```

Correct:

```jsx
<hi/>
<hello
/>
```

#### 7.3.2 Element or fragment attribute values

JSX elements or JSX fragments as attribute values are not supported.

The reason for this change is that it would be confusing whether Markdown would
work.

Incorrect:

```jsx
<welcome name=<>Venus</> />
<welcome name=<span>Pluto</span> />
```

Correct:

```jsx
<welcome name='Mars' />
```

#### 7.3.3 U+003E GREATER THAN (`>`) and U+007D RIGHT CURLY BRACE (`}`) are fine

JSX does not allow U+003E GREATER THAN (`>`) or U+007D RIGHT CURLY BRACE (`}`) literally in text, they need to be encoded as
character references.
There is no good reason for this (some JSX parsers agree with us and don’t crash
either).
In Markdown, U+003E GREATER THAN (`>`) is used to start a block quote.
Therefore, in MDX, U+003E GREATER THAN (`>`) and U+007D RIGHT CURLY BRACE (`}`) are fine literally and don’t need to be encoded.

#### 7.3.4 Expressions

JSX allows valid JavaScript inside expressions.
We support *anything* in braces.
Because JSX parses JavaScript, it knows when it sees a U+007D RIGHT CURLY BRACE (`}`) whether it means the
end of the expression, or if there is more JavaScript after it.
As we don’t parse JavaScript, but do want to allow further braces in
expressions, we count opening braces (U+007B LEFT CURLY BRACE (`{`)) and expect just as many closing
braces (U+007D RIGHT CURLY BRACE (`}`)) in expressions.

Incorrect:

```jsx
<punctuation
  data={{
    '{': false // Left curly brace
  }}
/>
```

Correct:

```jsx
<punctuation
  data={{
    '{': false, // Left curly brace
    '}': false // Right curly brace
  }}
/>
```

### 7.4 Common MDX gotchas

Markdown *first* looks for blocks (such as a heading) and only later looks for
spans (such as emphasis) in those blocks.

This becomes a problem typically in the two cases listed below.
However, as MDX has parse errors, parsing will crash, and an error will be
presented.

#### 7.4.1 Blank lines in JSX spans

Incorrect:

```markdown
The plot for the movie was, <span>wait for it…

…that she didn’t die!</span>
```

Correct:

```markdown
The plot for the movie was, <span>wait for it…
…that she didn’t die!</span>
```

#### 7.4.2 U+003E GREATER THAN (`>`) seen as block quote

Incorrect:

```markdown
Here’s a cute photo of my cat: <Image
  alt='Photo of Lilo sitting in a tiny box'
  src='lilo.png'
  /
>
```

Correct:

```markdown
Here’s a cute photo of my cat: <Image alt='Photo of Lilo sitting in a tiny box' src='lilo.png' />
```

Or as a block (U+003E GREATER THAN (`>`) is fine in JSX blocks):

```markdown
Here’s a cute photo of my cat:

<Image
  alt='Photo of Lilo sitting in a tiny box'
  src='lilo.png'
  /
>
```

## 8 References

*   **\[Markdown]**:
    [CommonMark][commonmark].
    J. MacFarlane, et al.
*   **\[HTML]**:
    [HTML standard][html].
    A. van Kesteren, et al.
    WHATWG.
*   **\[JavaScript]**:
    [ECMAScript language specification][javascript].
    Ecma International.
*   **\[JSON]**:
    [The JavaScript Object Notation (JSON) Data Interchange Format][json].
    T. Bray.
    IETF.
*   **\[UNICODE]**:
    [The Unicode standard][unicode].
    Unicode Consortium.

## 9 Acknowledgments

Thanks to Gatsby, Inc. for funding the work to define MDX further.

## 10 License

Copyright © 2020 Titus Wormer.
This work is licensed under a
[Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

<!--Definitions-->

[html]: https://html.spec.whatwg.org/multipage/

[javascript]: https://tc39.es/ecma262/

[jsx]: https://facebook.github.io/jsx/

[json]: https://tools.ietf.org/html/rfc7159

[commonmark]: https://commonmark.org

[unicode]: https://www.unicode.org/versions/

[confusing]: https://twitter.com/gruber/status/1246489863932821512

[es-whitespace]: https://tc39.es/ecma262/#prod-WhiteSpace

[es-identifier-start]: https://tc39.es/ecma262/#prod-IdentifierStart

[es-identifier-part]: https://tc39.es/ecma262/#prod-IdentifierPart

[mdx-rauchg]: https://spectrum.chat/frontend/general/mdx-proposal~1021be59-2738-4511-aceb-c66921050b9a

[mdx-jamesknelson]: https://github.com/frontarm/mdx-util/tree/0f5f6d62bac4b83edc4bc3890dde3011079fa318

[mdx-johno]: https://github.com/mdx-js/mdx/tree/a96ede2c104084ae21efa8bd95319011e558ec9d

[md]: https://daringfireball.net/2004/03/introducing_markdown

[rauchg]: https://github.com/rauchg

[jamesknelson]: https://github.com/jamesknelson

[johno]: https://github.com/johno

[timneutkens]: https://github.com/timneutkens

[jxnblk]: https://github.com/jxnblk

[ticky]: https://github.com/ticky

[gruber]: https://github.com/gruber

[jgm]: https://github.com/jgm

[sebmarkbage]: https://github.com/sebmarkbage

[w3c-bnf]: https://www.w3.org/Notation.html

[mdxjs]: https://mdxjs.com

[micromark]: https://github.com/micromark/micromark

[cmsm]: https://github.com/micromark/common-markup-state-machine

[markdown-deviations]: #72-deviations-from-markdown

[jsx-deviations]: #73-deviations-from-jsx

[parsing]: #4-parsing

[syntax]: #71-syntax

[whitespace]: #whitespace

[identifier-start]: #identifier-start

[identifier]: #identifier

[ceof]: #ceof

[input-stream]: #input-stream

[input-character]: #input-character

[stack]: #stack

[current-token]: #current-token

[value]: #value

[element-stack]: #element-stack

[current-element]: #current-element

[settled]: #settled

[crashed]: #crashed

[state]: #state

[shared-space]: #shared-space

[dedent]: #dedent

[decode]: #decode

[switch]: #switch

[consume]: #consume

[enter]: #enter

[exit]: #exit

[done]: #done

[crash]: #crash

[mdx-state-machine]: #mdx-state-machine

[mdx-adapter]: #mdx-adapter

[s-before-mdx-block]: #51-before-mdx-block-state

[s-before-mdx-span]: #52-before-mdx-span-state

[s-after-mdx-block]: #53-after-mdx-block-state

[s-after-mdx-span]: #54-after-mdx-span-state

[s-data]: #55-data-state

[s-before-name]: #56-before-name-state

[s-before-closing-tag-name]: #57-before-closing-tag-name-state

[s-primary-name]: #58-primary-name-state

[s-after-primary-name]: #59-after-primary-name-state

[s-before-member-name]: #510-before-member-name-state

[s-member-name]: #511-member-name-state

[s-after-member-name]: #512-after-member-name-state

[s-before-local-name]: #513-before-local-name-state

[s-local-name]: #514-local-name-state

[s-after-local-name]: #515-after-local-name-state

[s-before-attribute]: #516-before-attribute-state

[s-attribute-expression]: #517-attribute-expression-state

[s-attribute-name]: #518-attribute-name-state

[s-after-attribute-name]: #519-after-attribute-name-state

[s-before-attribute-local-name]: #520-before-attribute-local-name-state

[s-attribute-local-name]: #521-attribute-local-name-state

[s-after-attribute-local-name]: #522-after-attribute-local-name-state

[s-before-attribute-value]: #523-before-attribute-value-state

[s-attribute-value-double-quoted]: #524-attribute-value-double-quoted-state

[s-attribute-value-single-quoted]: #525-attribute-value-single-quoted-state

[s-attribute-value-expression]: #526-attribute-value-expression-state

[s-self-closing]: #527-self-closing-state

[s-expression]: #528-expression-state

[s-text]: #529-text-state

[s-accent-quoted-open]: #530-accent-quoted-open-state

[s-accent-quoted]: #531-accent-quoted-state

[s-accent-quoted-close]: #532-accent-quoted-close-state

[s-tilde-quoted-open]: #533-tilde-quoted-open-state

[s-tilde-quoted]: #534-tilde-quoted-state

[s-tilde-quoted-close]: #535-tilde-quoted-close-state
