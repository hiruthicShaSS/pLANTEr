from flask.globals import request
from werkzeug.exceptions import BadRequest
from flask.json import jsonify
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup
from re import findall
from flask import Flask
from flask_cors import CORS
import time
import os
import pickle


app = Flask(__name__)
CORS(app)

chrome_options = webdriver.ChromeOptions()
chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--no-sandbox")
chrome = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), chrome_options=chrome_options)

def checkCache(username):
    return os.path.exists(f"{username}.cache")


@app.route("/fetch", methods=["GET"])
def fetch():
    username = None
    getInfo = 0
    force = 0
    try:
        username = str(request.args["username"])
        force = int(request.args["force"])
        getInfo = int(request.args["getInfo"])
    except BadRequest as e:
        return jsonify({
            "code": e.code,
            "description": e.description,
        })

    if (force == 0) and checkCache(username):
        data = None
        with open(f"{username}.cache", "rb") as file:
            data = pickle.load(file)
            data["time"] = "cache"
        return jsonify(data)

    start = time.time()
    data = {"info": {}}

    if getInfo== 1:
        chrome.get(f"https://github.com/{username}")
        try:
            data["info"]["image_url"] = chrome.find_element_by_xpath("/html[1]/body[1]/div[4]/main[1]/div[2]/div[1]/div[1]/div[1]/div[2]/div[1]/a[1]/img[1]").get_attribute("src")
            data["info"]["bio"] = chrome.find_element_by_xpath("/html[1]/body[1]/div[4]/main[1]/div[2]/div[1]/div[1]/div[1]/div[4]/div[1]").text
            data["info"]["blog"] = chrome.find_element_by_xpath("/html[1]/body[1]/div[4]/main[1]/div[2]/div[1]/div[1]/div[1]/div[5]/div[2]/ul[1]/li[1]/a[1]").get_attribute("href")
            data["info"]["twitter"] = chrome.find_element_by_xpath("/html[1]/body[1]/div[4]/main[1]/div[2]/div[1]/div[1]/div[1]/div[5]/div[2]/ul[1]/li[2]/a[1]").get_attribute("href")
            data["info"]["contacts"] = [
                chrome.find_element_by_xpath("/html[1]/body[1]/div[4]/main[1]/div[2]/div[1]/div[1]/div[1]/div[5]/div[2]/div[2]/div[1]/a[1]/span[1]").text,
                chrome.find_element_by_xpath("/html[1]/body[1]/div[4]/main[1]/div[2]/div[1]/div[1]/div[1]/div[5]/div[2]/div[2]/div[1]/a[2]/span[1]").text
            ] # Does'nt work
        except NoSuchElementException:
            pass


    chrome.get(
        f"https://github-readme-stats.vercel.app/api?username={username}")
    # Parse the content
    source = BeautifulSoup(chrome.page_source, "html.parser").text
    # Fetch the numbers from the text elements
    numbers = findall(r"[0-9]+", source)
    numbers = numbers[-6:]

    """
    Indexes:
        0 - Total Stars
        1 - Current Year
        2 - Total Commits
        3 - Total PRs
        4 - Total Issues
        5 - Contributed to
    """

    data["data"] = numbers
    data["time"] = time.time() - start

    with open(f"{username}.cache", "wb") as file:
        pickle.dump(data, file)

    return jsonify(data)


if __name__ == "__main__":
    app.run(threaded=True, debug=True)
