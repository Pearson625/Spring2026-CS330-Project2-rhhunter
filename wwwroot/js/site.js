"use strict";

//email: nokix19354@pckage.com
//--------------------------- global variables ------------------------------------------

const backgrounds = [
    "https://images.unsplash.com/photo-1537420327992-d6e192287183?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];
let bgIndex = 0;

//------------------------------ Helper Functions --------------------------------------
//Gets time in HH:MM
function getCurrentTime() {
    const time = Temporal.Now.zonedDateTimeISO();
    const hours = String(time.hour).padStart(2, '0');
    const minutes = String(time.minute).padStart(2, '0');
    console.log(`${hours}:${minutes}`);
    return `${hours}:${minutes}`;
}

function performSearch(query) {
    var settings = {
        "url": "https://google.serper.dev/search",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "X-API-KEY": "b115eda2fd69fbfd193b8e8e22b72ddfa0d591af",
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "q": query
        }),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        displayResults(response);
    });
};

function displayResults(data) {
    $("#searchResults").empty(); // clear previous results

    let html = "";

    // Knowledge Graph (if available)
    if (data.knowledgeGraph) {
        html += `<h2>${data.knowledgeGraph.title}</h2>`;
        html += `<p>${data.knowledgeGraph.description}</p>`;
    }

    // Organic Results
    html += "<h2>Results</h3>";
    data.organic.forEach(result => {
        html += `
                 <div>
                      <a href="${result.link}" target="_blank">
                           <h4>${result.title}</h4>
                      </a>
                      <p>${result.snippet}</p>
                </div>
                `;
    });

    // People Also Ask
    if (data.peopleAlsoAsk) {
        html += "<h2>People Also Ask</h3>";
        data.peopleAlsoAsk.forEach(q => {
            html += `<p><strong>${q.question}</strong></p>`;
        });
    }

    // Related Searches
    if (data.relatedSearches) {
        html += "<h2>Related Searches</h3>";
        data.relatedSearches.forEach(r => {
            html += `<p>${r.query}</p>`;
        });
    }

    $("#searchResults").html(html);
    $("#searchResults").css("visibility", "visible");
};

//------------------------------ Event Listeners ---------------------------------------
window.onload = function init() {
    //on title click, rotate background
    document.getElementById("header").addEventListener("click", () => {
        bgIndex = (bgIndex + 1) % backgrounds.length;
        document.body.style.backgroundImage = `url(${backgrounds[bgIndex]})`;
    });

    //handle the time button
    $(function () {
        //initialize the div for a dialog
        $("#time").dialog({ autoOpen: false });

        //set the button to open a dialog
        $("#timeBtn").on("click", function () {
            $("#time")
                .html(getCurrentTime())
                .css("visibility", "visible")
                .dialog("open");
        });
    });

    //performs a search if the box 
    document.getElementById("searchBtn").addEventListener("click", () => {
        const query = document.getElementById("query").value.trim();

        if (query) performSearch(query);
        else alert("please enter a search into the text box first!");
    });
}