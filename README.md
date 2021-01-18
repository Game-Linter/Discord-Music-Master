<div align="center">
    <img src="https://i.imgur.com/tQrygFc.png" width="128px" style="max-width:100%;">
    <h3 style="font-size: 2rem; margin-bottom: 0">Game-Linter Music Master README</h3>
    <h4 style="margin-top: 0">Revision 1</h4>
    <br />
</div>

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
    	<p>__audio [input]</p>
    	<p></p>
      <h4>Play the given input instantly even if the queue is full so you don't have to wait for the queue to finish. When done, the bot will continue the previous queue</h4>
    	<p>__audionow [input]</p>
    	<h4>Pause</h4>
    	<p>__pause</p>
    	<h4>Skip</h4>
    	<p>__skip</p>
    	<h4>Resume</h4>
    	<p>__resume</p>
    	<h4>Quit</h4>
    	<p>__fuckoff</p>
    	<h4>Autoplay Toggle (playing Recommended Songs)</h4>
    	<p>__autoplay</p>
    	<h4>Loop Toogle current song forever or until you type the command again</h4>
    	<p>__loop</p>
      	<h4>Shuffle current queue</h4>
      	<p>__shuffle</p>
      <h3>Note 1:</h3>
      <p>The bot will leave the channel if left alone or moved to a channel by it self</p>
      <h3>Note 2:</h3>
      <p>The bot will keep playing related and recommended music to the currently playing track, as long as the queue is empty</p>
      <h3>Note: 3</h3>
      <p>The bot prioritize in order:</p>
      <ol>
      	<li>Loop is enabled</li>
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
