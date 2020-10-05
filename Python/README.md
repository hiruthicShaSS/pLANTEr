# Flask server

### Setting Up
  - Step 1
    ```bash
    pip install -r requirements.txt
    ```
  - Step 2
    Setup environment
    - [Linux](http://blog.likewise.org/2015/01/setting-up-chromedriver-and-the-selenium-webdriver-python-bindings-on-ubuntu-14-dot-04/)
    - [Windows](http://jonathansoma.com/lede/foundations-2018/classes/selenium/selenium-windows-install/)
  - Step 3
    ```bash
    python app.py
    ```
  - Step 4<br />
    Change the link in the <a href="https://github.com/hiruthic2002/pLANTEr/blob/659fae36ae1bd72408bb5bb9b5d7c3da15f92ec1/Website/index.js#L139">../Website/index.js</a>
  - Step 5
    Open the website in local machine and test.

<br />

### For testing the python server
API link: ```https://planter-server.herokuapp.com/fetch?username=<username>&getInfo=<bool>```

API refrence:
  - username -> GitHub username
  - getInfo -> boolean, for geting user info. False will return only PRs and commit count
  
Working site: [Take me](https://hiruthic2002.github.io/pLANTEr/Website/)

  

### For remote server testing
Heroku build button is making some issues. If you can fix it kindly make a **PR** or you can just push the fioles in the Python directory to your heroku app
<!-- [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/hiruthic2002/pLANTEr/tree/main) -->
