# polyfills

Polyfills to use web APIs consistently on all browsers. Does not add support if it's not already there, but standardizes the usage,

## Installation
Add to your `dependencies` in `package.json`: 

```json
"polyfills": "git://github.com/beradrian/polyfills"
```

## Usage

After [installing](#installation), add somewhere in the beginning of your script

```js
require('polyfills/<module>');
```

or in Typescript (in Angular2-4 add it to `polyfills.ts`)

```ts
import 'polyfills/<module>';
```

where `<module>` is one of the polyfills
- `webrtc` for WebRTC.
- `filesystem` for FileSystem API
- `fullscreen` for FullScreen API

That's it!
