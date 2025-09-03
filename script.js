// Elements
let innerUploadImage = document.querySelector(".inner-upload-image");
let input = innerUploadImage.querySelector("input");
let image = document.querySelector("#image");
let loading = document.querySelector("#loading");
let btn = document.querySelector("button");
let text = document.querySelector("#text");
let output = document.querySelector(".output");

// Light/Dark Mode
const body = document.body;
const lightMode = document.getElementById("lightMode");
const darkMode = document.getElementById("darkMode");

darkMode.addEventListener("click", () => {
    body.classList.remove("light");
    darkMode.style.display = "none";
    lightMode.style.display = "inline";
});
lightMode.addEventListener("click", () => {
    body.classList.add("light");
    lightMode.style.display = "none";
    darkMode.style.display = "inline";
});

// File Details
let fileDetails = { mime_type: null, data: null };

// Image Upload
input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64data = e.target.result.split(",")[1];
        fileDetails.mime_type = file.type;
        fileDetails.data = base64data;

        innerUploadImage.querySelector("span").style.display = "none";
        innerUploadImage.querySelector("#icon").style.display = "none";
        image.style.display = "block";
        image.src = `data:${fileDetails.mime_type};base64,${fileDetails.data}`;
        output.style.display = "none";
    };
    reader.readAsDataURL(file);
});

// Click upload box
innerUploadImage.addEventListener("click", () => { input.click(); });

// Typing Effect Function (line by line)
function typeText(content, speed = 40) {
    text.innerHTML = "";
    output.style.display = "block";
    let lines = content.split("\n").filter(l => l.trim() !== "");
    let lineIndex = 0;

    function typeLine(line) {
        let charIndex = 0;
        let interval = setInterval(() => {
            if (charIndex < line.length) {
                text.innerHTML += line[charIndex];
                charIndex++;
            } else {
                clearInterval(interval);
                text.innerHTML += "\n";
                lineIndex++;
                if (lineIndex < lines.length) {
                    setTimeout(() => typeLine(lines[lineIndex]), 200);
                }
            }
        }, speed);
    }

    typeLine(lines[lineIndex]);
}

// API Request
async function generateResponse() {
    loading.style.display = "block";

    const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_KEY";

    const RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [
                        { "text": "solve the mathematical problem with proper steps" },
                        { "inline_data": { "mime_type": fileDetails.mime_type, "data": fileDetails.data } }
                    ]
                }
            ]
        })
    };

    try {
        let response = await fetch(Api_url, RequestOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

        // Typing effect
        typeText(apiResponse, 30);
    } catch (e) {
        console.log(e);
        typeText("Error generating solution. Try again.", 30);
    } finally {
        loading.style.display = "none";
    }
}

// Solve button click
btn.addEventListener("click", generateResponse);
