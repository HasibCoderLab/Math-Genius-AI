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
        text.innerHTML = apiResponse;
        output.style.display = "block";
    } catch (e) {
        console.log(e);
        text.innerHTML = "Error generating solution. Try again.";
        output.style.display = "block";
    } finally {
        loading.style.display = "none";
    }
}

// Solve button click
btn.addEventListener("click", generateResponse);
