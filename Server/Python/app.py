from flask.globals import request
from flask.json import jsonify
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup
import html2text
from re import findall
from flask import Flask
from flask_cors import CORS, cross_origin
import time
import os


app = Flask(__name__)
CORS(app)
chrome = webdriver.Chrome("#Path to chromedriver")


@app.route("/fetch", methods=["GET"])
def fetch():
    os.system("cls")
    start = time.time()
    username = str(request.args["username"])
    getInfo = str(request.args["getInfo"])

    data = {"info": {}}

    if getInfo == "true":
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

    return jsonify(data)


if __name__ == "__main__":
    app.run(threaded=True, debug=True)
