from flask import Flask, request
from flask_cors import cross_origin

import os
import pandas as pd

app = Flask(__name__)

# Pig Latin Translator method.
# Translate the input name to Pig Latin in lowercase
def pig_it(text: str):
    words = text.split(" ")

    new_words = []
    for word in words:
        if word.isalpha():
            new_word = word[1:]+word[0] + "ay"
            new_words.append(new_word)
        else:
            new_words.append(word)

    return " ".join(new_words).lower()  


def get_post_code_detail(code: int):
    path = os.path.split(os.path.realpath(__file__))[0]  # Get running directory of the program
    post_code_df = pd.read_excel(path+"/data/post_code.xlsx")  # Use pandas to read .xlsx file
    filter_df = post_code_df[post_code_df["zip"] == int(code)]  # Filter data by ZipCode
    if len(filter_df) >= 1:  # Determine whether the relevant information of this ZipCode can be obtained
        county_name = filter_df["county_name"].values[0]  # Get the county name
        total_people = post_code_df[post_code_df["county_name"]
                                    == county_name]["population"].sum()  # Get the population
        return [county_name, total_people]
    else:
        return False


@app.route("/create_phrase")  # Flask App routing
@cross_origin()
def create_phrase():
    name = request.args.get("name")  # Received name from the front
    post_code = request.args.get("post_code")  # Received ZipCode from the front

    pig_it_text = pig_it(name)
    post_code_detail = get_post_code_detail(post_code)

    if post_code_detail:
        return {
            "code": 200,
            "data": {
                "pig_it": pig_it_text,
                "county_name": post_code_detail[0],
                "total_people": post_code_detail[1],
            },
            "message": "success"
        }
    else:
        return {
            "code": 200,
            "data": {
                "pig_it": pig_it_text,
                "county_name": None,
                "total_people": None,
            },
            "message": "success"
        }


if __name__ == "__main__":
    app.run("localhost", 8888)
