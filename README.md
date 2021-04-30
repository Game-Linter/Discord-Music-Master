<div align="center">
    <img src="https://i.imgur.com/tQrygFc.png" width="128px" style="max-width:100%;">
    <h3 style="font-size: 2rem; margin-bottom: 0">Game-Linter Music Master README</h3>
    <h4 style="margin-top: 0">Revision 1</h4>
    <br />
</div>
<b style="display: flex"> Feel like supporting hosting and developement of this project??</b>
<a href="https://www.buymeacoffee.com/quasimodo64" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
<html lang="en">
	    <body>
    	<h1>Play almost any type of songs</h1>
    	<h4>Types of inputs</h4>
    	<ul>
    		<li>Normal youtube query or search</li>
    		<li>Youtube url or short youtube url</li>
          	<li>Youtube public playlist</li>
    		<li>Spotify track url</li>
    		<li>
    			Spotify Playlist URL
    		</li>
          <li>
    			Spotify Album URL
    		</li>
    	</ul>
    	<h4>Play inputs</h4>
    	<p><code>__audio [input]</code></p>
    <p></p>
      <h4>Play the given input instantly even if the queue is full so you don't have to wait for the queue to finish. When done, the bot will continue the previous queue</h4>
    	<p><code>__audionow [input]</code></p>
    	<h4>Pause</h4>
    	<p><code>__pause</code></p>
    	<h4>Skip</h4>
    	<p><code><code>__skip</code></code></p>
    	<h4>Resume</h4>
    	<p><code><code>__resume</code></code></p>
    	<h4>Quit</h4>
    	<p><code>__fuckoff</code></p>
    	<h4>Save playlist for server</h4>
    	<p><code>__save [nameOfPlaylist] [linkToPlaylist]</code></p>
    	<h4>Load Saved Playlist</h4>
    	<p><code>__load [nameOfPlaylist]</code></p>
   	<h4>Restart current song</h4>
    	<p><code>__restart</code></p>
	<h4>Help</h4>
    	<p><code>__help</code></p>
	<h4>Get Lyrics (if they exist)</h4>
    	<p><code>__lyrics</code></p>
    	<h4>Autoplay Toggle (playing Recommended Songs)</h4>
    	<p><code>__autoplay</code></p>
    	<h4>Loop Toogle current song forever or until you type the command again</h4>
    	<p><code>__loop</code></p>
      	<h4>Shuffle current queue</h4>
      	<p><code>__shuffle</code></p>
      <h3>Note 1:</h3>
      <p><code>The bot will leave the channel if left alone or moved to a channel by it self</code></p>
      <h3>Note 2:</h3>
      <p><code>The bot will keep playing related and recommended music to the currently playing track, as long as the queue is empty</code></p>
      <h3>Note: 3</h3>
      <p><code>The bot prioritize in order:</code></p>
      <ol>
      	<li>Loop if enabled</li>
        <li>Queue if not empty</li>
        <li>Autoplay which is enabled by default</li>
      </ol>
      <h1>Contributing</h1>
      <p>
      Game-Linter Music Master is a community project We invite your participation through issues and pull requests! You can peruse the <a href="https://github.com/darklight147/discord-music/blob/master/.github/CONTRIBUTING.md">
    	Contribution Guidelines
      </a>
      </p>
      <div>
      <h1> Developement </h1>
	      You need the latest version of <a href="https://www.typescriptlang.org/download" target="__blank">Typescript</a> <br/>
Clone the project and run:

```sh
yarn --frozen-lockfile
```

Replace all the `REMOVED` in config folder with your credentials

Then run:

```sh
yarn start
```

</div>
      <h3>Everything is Licensed under
      <a href="https://github.com/darklight147/discord-music/blob/master/LICENSE.md">AGPL-3.0 License</a>
      </h3>
    </body>

</html>
